'use client';

import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Box
} from '@mui/material';
import React, { useState, useEffect } from 'react';

interface UserOutputDTO {
  id: number;
  fname: string;
  lastname: string; 
  email: string;
  role: string;
  createdAt: string;
}

interface EditDialogProps {
  open: boolean;
  user: UserOutputDTO | null;
  roles: string[];
  onClose: () => void;
  onSave: (updatedUser: UserOutputDTO) => Promise<void>; // Added Promise<void> return type
}

export function EditUserDialog({ open, user, onClose, onSave, roles}: EditDialogProps) {
  const [formData, setFormData] = useState<UserOutputDTO | null>(null);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (field: keyof UserOutputDTO, value: string) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (formData) {
      await onSave(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modifier l'utilisateur</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField label="ID" value={formData?.id ?? ''} fullWidth disabled />
        <TextField
          label="Nom"
          value={formData?.lastname ?? ''} 
          onChange={(e) => handleChange('lastname', e.target.value)} 
          fullWidth
        />
        <TextField
          label="Prénom"
          value={formData?.fname ?? ''}
          onChange={(e) => handleChange('fname', e.target.value)}
          fullWidth
        />
        <TextField
          label="Email"
          value={formData?.email ?? ''}
          onChange={(e) => handleChange('email', e.target.value)}
          fullWidth
        />
        <TextField
          select
          label="Rôle"
          value={formData?.role ?? ''}
          onChange={(e) => handleChange('role', e.target.value)}
          fullWidth
        >
          {roles.filter(role => role.toLowerCase() !== 'all').map((role) => (
            <MenuItem key={role} value={role}>{role}</MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" sx={{ 
          borderColor: '#050EAD', 
          color: '#050EAD', 
          '&:hover': {
            backgroundColor: '#f0f2ff',
            borderColor: '#030a8c',
            color: '#030a8c',
          }
        }}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: '#050EAD', color: '#fff' }}>Enregistrer</Button>
      </DialogActions>
    </Dialog>
  );
}