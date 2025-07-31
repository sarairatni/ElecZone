'use client';

import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress,
  Box, IconButton, MenuItem, Select, Dialog, DialogTitle,
  DialogContent, DialogActions, Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { EditUserDialog } from './EditUserDialog';
import CreateUserDialog from './CreateUserDialog';
import { RegisterUserDTO } from './CreateUserDialog';


interface UserOutputDTO {
    id: number;
    fname: string;
    lname: string;
    email: string;
    role: string;
    createdAt: string;
  }
  
export default function GestionUtilisateurs() {
  const [users, setUsers] = useState<UserOutputDTO[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<UserOutputDTO | null>(null);
  const filteredUsers = users?.filter(user => selectedRole === "All" || user.role === selectedRole);
  const roles = ["All", "ADMIN", "COSTUMER"];
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur serveur');
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Impossible de charger les utilisateurs');
        setLoading(false);
      });
  }, []);

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (deleteId == null) return;
    setDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${deleteId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      setUsers((prev) => prev ? prev.filter(u => u.id !== deleteId) : prev);
      setDeleting(false);
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
  // handke edit 
const handleEdit = (user: UserOutputDTO) => {
  setEditUser(user);
};

const handleEditSave = async (updatedUser: UserOutputDTO) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${updatedUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser),
    });
    if (!res.ok) throw new Error('Échec de la mise à jour');

    setUsers((prev) =>
      prev?.map((u) => (u.id === updatedUser.id ? updatedUser : u)) ?? null
    );
    setEditUser(null);
  } catch (err) {
    alert('Erreur lors de la mise à jour');
  }
};

// add user 
const handleCreateUser = async (newUser: RegisterUserDTO) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) throw new Error('Erreur lors de la création');
  
      const createdUser = await res.json();
      setUsers((prev) => prev ? [...prev, createdUser] : [createdUser]);
    } catch (err) {
      alert('Erreur lors de la création');
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black">Liste des utilisateurs</h1>
        <div className="flex gap-4 items-center">
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            size="small"
          >
            {roles.map(role => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
          <button
  className="bg-[#ff6767] text-white text-xs px-3 py-2 rounded-lg hover:bg-[#ff6767] flex items-center gap-2"
  onClick={() => setOpenCreate(true)}
>
  <AddIcon fontSize="small" /> nouvel utilisateur
</button>
        </div>
      </div>

      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 4, justifyContent: 'center' }}>
          <CircularProgress size={24} />
          <span>Chargement...</span>
        </Box>
      )}

      {error && (
        <Box sx={{ color: 'error.main', py: 4, textAlign: 'center' }}>{error}</Box>
      )}

      {!loading && !error && filteredUsers && filteredUsers.length === 0 && (
        <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
          Aucun utilisateur trouvé.
        </Box>
      )}

      {!loading && !error && filteredUsers && filteredUsers.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="Table utilisateurs">
            <TableHead>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Nom</b></TableCell>
                <TableCell><b>Prénom</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Rôle</b></TableCell>
                <TableCell><b>Inscrit le</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.lname}</TableCell>
                  <TableCell>{user.fname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: '#FEE2E2',
                          color: '#EF4444',
                          '&:hover': { backgroundColor: '#FCA5A5' }
                        }}
                        onClick={() => handleDelete(user.id)}
                        disabled={deleting}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: '#DBEAFE',
                          color: '#2563EB',
                          '&:hover': { backgroundColor: '#93C5FD' }
                        }}
                        onClick={() => handleEdit(user)}
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
      )}

      {/* Confirm Delete Dialog */}
      <Dialog open={deleteId !== null} onClose={cancelDelete} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cet utilisateur ?
          {deleteError && <Box sx={{ color: 'error.main', mt: 2 }}>{deleteError}</Box>}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} disabled={deleting} variant="outlined">
            Annuler
          </Button>
          <Button
            onClick={confirmDelete}
            disabled={deleting}
            variant="contained"
            sx={{ bgcolor: '#ff6767', color: 'white', '&:hover': { bgcolor: '#ff4d4d' } }}
          >
            {deleting ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* edit */}
      <EditUserDialog
  open={editUser !== null}
  user={editUser}
  roles={roles}
  onClose={() => setEditUser(null)}
  onSave={handleEditSave}
/>
{/** add user */}
<CreateUserDialog
  open={openCreate}
  roles={roles}
  onClose={() => setOpenCreate(false)}
  onCreate={handleCreateUser}
/>

    </div>
  );
}
