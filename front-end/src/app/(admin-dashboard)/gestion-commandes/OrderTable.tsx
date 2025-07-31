import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: {
    ProductID: string;
    Name: string;
    Description: string;
    Price: number;
    ImgUrl: string;
  };
}

interface User {
  id: string;
  fname: string;
  lastname: string;
  email: string;
}

interface Order {
  id: string;
  customerFname: string;
  customerLname: string;
  customerPhone: string;
  customerId: string;
  wilaya: string;
  commune: string;
  postalCode?: string;
  detailedAddress: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  user: User;
}

export default function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Refresh the orders list
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleValidateOrder = async (orderId: string) => {
    await updateOrderStatus(orderId, 'ACCEPTED');
  };

  const handleRejectOrder = async (orderId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Erreur lors de la suppression de la commande');
    }
  };

  const handleDeliverOrder = async (orderId: string) => {
    await updateOrderStatus(orderId, 'DELIVERED');
  };

  const ActionButtons = ({ row }: { row: Order }) => {
    const status = row.status.toUpperCase();
    
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        {status === 'PENDING' && (
          <>
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => handleValidateOrder(row.id)}
            >
              Valider
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => handleRejectOrder(row.id)}
            >
              Refuser
            </Button>
          </>
        )}
        {status === 'ACCEPTED' && (
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleDeliverOrder(row.id)}
          >
            Livraison
          </Button>
        )}
        {(status === 'DELIVERED') && (
          <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            Commande livrée
          </Box>
        )}
      </Box>
    );
  };

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID Commande', 
      width: 120 
    },
    { 
      field: 'customerId', 
      headerName: 'ID Client', 
      width: 100 
    },
    {
      field: 'clientName',
      headerName: 'Client',
      width: 180,
      valueGetter: (value, row) => 
        `${row.customerLname?.toUpperCase() || ''} ${row.customerFname || ''}`,
    },
    { 
      field: 'customerPhone', 
      headerName: 'Téléphone', 
      width: 130 
    },
    {
      field: 'location',
      headerName: 'Localisation',
      width: 200,
      valueGetter: (value, row) => `${row.wilaya}, ${row.commune}`,
    },
    { 
      field: 'detailedAddress', 
      headerName: 'Adresse', 
      width: 200 
    },
    {
      field: 'totalPrice',
      headerName: 'Prix Total',
      width: 120,
      type: 'number',
      valueFormatter: (value) => `${value} DA`,
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 120,
      valueFormatter: (value) => new Date(value).toLocaleDateString('fr-FR'),
    },
    {
      field: 'status',
      headerName: 'Statut',
      width: 120,
      renderCell: (params) => {
        const status = params.value.toUpperCase();
        
        const getStatusStyle = (status: string) => {
          switch (status) {
            case 'PENDING':
              return {
                backgroundColor: '#FEF3E2',
                color: '#F59E0B',
                label: 'En attente'
              };
            case 'ACCEPTED':
              return {
                backgroundColor: '#DBEAFE',
                color: '#2563EB',
                label: 'Acceptée'
              };
            case 'DELIVERED':
              return {
                backgroundColor: '#D1FAE5',
                color: '#059669',
                label: 'Livrée'
              };
            default:
              return {
                backgroundColor: '#F3F4F6',
                color: '#6B7280',
                label: params.value
              };
          }
        };

        const statusStyle = getStatusStyle(status);
        
        return (
          <Box
          sx={{
            backgroundColor: statusStyle.backgroundColor,
            color: statusStyle.color,
            padding: '2px 3px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 500,
            display: 'inline-block',
            minWidth: '80px',
            textAlign: 'center'
          }}
        >
          {statusStyle.label}
        </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => <ActionButtons row={params.row} />,
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <Paper sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={orders}
        columns={columns}
        loading={loading}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 25]}
        sx={{ border: 0 }}
        disableRowSelectionOnClick
      />
    </Paper>
  );
}