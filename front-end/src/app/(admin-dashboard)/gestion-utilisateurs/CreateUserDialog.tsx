'use client';

import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Box,
  colors
} from '@mui/material';
import React, { useState } from 'react';

export interface RegisterUserDTO {
  fname: string;
  lastname: string;
  email: string;
  password: string;
  role?: "ADMIN" | "COSTUMER" | "LIVREUR";
}

interface CreateUserDialogProps {
    open: boolean;
    onClose: () => void;
    onCreate: (user: RegisterUserDTO) => void;
    roles: string[];
  }


export default function CreateUserDialog({ open, onClose, onCreate,roles }: CreateUserDialogProps) {
  const [formData, setFormData] = useState<RegisterUserDTO>({
    fname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'COSTUMER',
  });

  const handleChange = (field: keyof RegisterUserDTO, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    onCreate(formData);
    onClose();
    setFormData({
      fname: '',
      lastname: '',
      email: '',
      password: '',
      role: 'COSTUMER',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField
          label="Nom"
          value={formData.lastname}
          onChange={(e) => handleChange('lastname', e.target.value)}
          fullWidth
        />
        <TextField
          label="Prénom"
          value={formData.fname}
          onChange={(e) => handleChange('fname', e.target.value)}
          fullWidth
        />
        <TextField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          fullWidth
        />
        <TextField
          label="Mot de passe"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          fullWidth
        />
        <TextField
          select
          label="Rôle"
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
          fullWidth
        >
          {roles.filter(role => role.toLowerCase() !== 'all').map((role) => (
            <MenuItem key={role} value={role}>{role}</MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
      <Button 
  onClick={onClose} 
  variant="outlined" 
  sx={{ 
    borderColor: '#050EAD', 
    color: '#050EAD', 
    '&:hover': {
      backgroundColor: '#f0f2ff',
      borderColor: '#030a8c',
      color: '#030a8c',
    }
  }}
>
  Annuler
</Button>
        <Button 
  onClick={handleSubmit} 
  variant="contained" 
  sx={{ backgroundColor: '#050EAD', color: '#fff' }}
>
  Créer
</Button>
      </DialogActions>
    </Dialog>
  );
}
