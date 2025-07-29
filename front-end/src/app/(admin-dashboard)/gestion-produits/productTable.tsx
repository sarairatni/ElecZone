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
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

interface ProductRow {
  ProductID: number;
  Name: string;
  Description: string;
  Price: number;
  categoryId?: number;
}

interface ProductTableProps {
  categoryId?: number;
}



function truncate(str: string | undefined, n: number) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n) + '...' : str;
}

export default function ProductTable({ categoryId }: ProductTableProps) {
  const [products, setProducts] = React.useState<ProductRow[] | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [deleting, setDeleting] = React.useState<boolean>(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);
  const [editProduct, setEditProduct] = React.useState<ProductRow | null>(null);
  const [editLoading, setEditLoading] = React.useState<boolean>(false);
  const [editError, setEditError] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState<Partial<ProductRow>>({});

  React.useEffect(() => {
    if (!categoryId) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}/products`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Erreur lors du chargement');
        setLoading(false);
      });
  }, [categoryId]);

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (deleteId == null) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      console.log("🍿product id :", deleteId);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${deleteId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      setProducts((prev) => prev ? prev.filter(p => p.ProductID !== deleteId) : prev);
      setDeleteId(null);
    } catch (err) {
      setDeleteError('Erreur lors de la suppression');
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
    setDeleteError(null);
  };

  const handleEdit = (product: ProductRow) => {
    setEditProduct(product);
    setEditForm({ ...product });
    setEditError(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const confirmEdit = async () => {
    if (!editProduct) return;
    setEditLoading(true);
    setEditError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${editProduct.ProductID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Erreur lors de la modification');
      const updated = await res.json();
      setProducts((prev) => prev ? prev.map(p => p.ProductID === updated.ProductID ? updated : p) : prev);
      setEditProduct(null);
    } catch (err) {
      setEditError('Erreur lors de la modification');
    } finally {
      setEditLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditProduct(null);
    setEditError(null);
  };

  // Validation for edit form
  const isEditFormValid = !!(
    editForm.Name &&
    editForm.Description &&
    editForm.Price !== undefined &&
    editForm.Price !== null &&
    String(editForm.Price).trim() !== ''
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 4, justifyContent: 'center' }}>
        <CircularProgress size={24} />
        <span>Loading...</span>
      </Box>
    );
  }

  if (error) {
    return <Box sx={{ color: 'error.main', py: 4, textAlign: 'center' }}>{error}</Box>;
  }

  if (!products || products.length === 0) {
    return <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary', fontSize: 13 }}>Cette catégorie n'a aucun produit.</Box>;
  }

  return (
    <>
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
            {products.map((row) => (
              <TableRow key={row.ProductID} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{row.ProductID}</TableCell>
                <TableCell>{row.Name}</TableCell>
              <TableCell>
                  <Tooltip title={row.Description} arrow placement="top">
                  <span className="cursor-pointer">
                      {truncate(row.Description, 30)}
                  </span>
                </Tooltip>
              </TableCell>
                <TableCell>{row.Price} DA</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    sx={{ backgroundColor: '#FEE2E2', color: '#EF4444', '&:hover': { backgroundColor: '#FCA5A5' } }}
                      onClick={() => handleDelete(row.ProductID)}
                      disabled={deleting}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ backgroundColor: '#DBEAFE', color: '#2563EB', '&:hover': { backgroundColor: '#93C5FD' } }}
                      onClick={() => handleEdit(row)}
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
      {/* Delete confirmation dialog */}
      <Dialog open={deleteId !== null} onClose={cancelDelete} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer ce produit ?
          {deleteError && <Box sx={{ color: 'error.main', mt: 2 }}>{deleteError}</Box>}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} disabled={deleting} variant="outlined">Annuler</Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Edit product dialog */}
      <Dialog open={!!editProduct} onClose={cancelEdit} maxWidth="xs" fullWidth>
        <DialogTitle>Modifier le produit</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="ID Produit"
            name="ProductID"
            value={editForm.ProductID ?? ''}
            fullWidth
            margin="dense"
            disabled
          />
          <TextField
            label="Nom"
            name="Name"
            value={editForm.Name ?? ''}
            onChange={handleEditChange}
            fullWidth
            margin="dense"
            required
          />
          <TextField
            label="Description"
            name="Description"
            value={editForm.Description ?? ''}
            onChange={handleEditChange}
            fullWidth
            margin="dense"
            required
            multiline
            minRows={2}
          />
          <TextField
            label="Prix"
            name="Price"
            type="number"
            value={editForm.Price ?? ''}
            onChange={handleEditChange}
            fullWidth
            margin="dense"
            required
            inputProps={{ min: 0, step: 0.01 }}
          />
          {editError && <Box sx={{ color: 'error.main', mt: 1 }}>{editError}</Box>}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelEdit} disabled={editLoading} variant="outlined"
            sx={{
              color: '#050EAD',
              borderColor: '#050EAD',
              '&:hover': { borderColor: '#050EAD', bgcolor: '#f0f4ff' },
            }}
          >Annuler</Button>
          <Button onClick={confirmEdit} disabled={editLoading || !isEditFormValid} variant="contained" 
            sx={{
              bgcolor: '#050EAD',
              color: '#fff',
              '&:hover': { bgcolor: '#2936d1' },
            }}
          >
            {editLoading ? 'Modification...' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
