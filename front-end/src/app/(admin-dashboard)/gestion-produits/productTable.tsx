import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';

interface ProductRow {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId?: number;
}

interface ProductTableProps {
  categoryId?: number;
}

const rows: ProductRow[] = [
  {
    id: 1,
    name: 'iPhone 14 Pro',
    description: 'Le dernier iPhone avec écran OLED, triple caméra, et puce A16 Bionic. Superbe autonomie et design premium.',
    price: 1599,
    categoryId: 1,
  },
  {
    id: 2,
    name: 'Samsung Galaxy S23',
    description: 'Smartphone Android haut de gamme, écran AMOLED 120Hz, caméra 108MP, batterie longue durée.',
    price: 1399,
    categoryId: 1,
  },
  {
    id: 3,
    name: 'Xiaomi Redmi Note 12',
    description: 'Excellent rapport qualité/prix, écran 6.5", batterie 5000mAh, caméra 50MP.',
    price: 499,
    categoryId: 2,
  },
  {
    id: 4,
    name: 'Oppo Reno 8',
    description: 'Design élégant, charge ultra-rapide, écran AMOLED, caméra performante.',
    price: 899,
    categoryId: 2,
  },
];

function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n) + '...' : str;
}

export default function ProductTable({ categoryId }: ProductTableProps) {
  // Filter by categoryId if provided
const filteredRows = rows;
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="table produits">
        <TableHead>
          <TableRow>
            <TableCell className="font-bold">ID Produit</TableCell>
            <TableCell className="font-bold">Nom</TableCell>
            <TableCell className="font-bold">Description</TableCell>
            <TableCell className="font-bold">PU</TableCell>
            <TableCell className="font-bold">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRows.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                <Tooltip title={row.description} arrow placement="top">
                  <span className="cursor-pointer">
                    {truncate(row.description, 30)}
                  </span>
                </Tooltip>
              </TableCell>
              <TableCell>{row.price} DA</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    sx={{ backgroundColor: '#FEE2E2', color: '#EF4444', '&:hover': { backgroundColor: '#FCA5A5' } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ backgroundColor: '#DBEAFE', color: '#2563EB', '&:hover': { backgroundColor: '#93C5FD' } }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
