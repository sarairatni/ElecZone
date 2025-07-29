
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { supabase } from '@/utils/supabaseClient';
import { useEffect } from 'react';

interface CreateProductPopUpProps {
  open: boolean;
  onClose: () => void;
  categoryId: number;
}

export default function CreateProductPopUp({ open, onClose, categoryId }: CreateProductPopUpProps) {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [image, setImage] = React.useState<File | null>(null);
  const [imgUrl, setImgUrl] = React.useState<string>('/photo.png');
  const [creating, setCreating] = React.useState(false);
const [createError, setCreateError] = React.useState<string | null>(null);



const handleCreateProduct = async () => {
  if (!name || !description || !price) {
    setCreateError("Tous les champs sont obligatoires.");
    return;
  }

  setCreating(true);
  setCreateError(null);

  try {
    let imageUrl = null;

    if (image) {
    
      const fileExt = image.name.split('.').pop();
      console.log("fileExt",fileExt)
      const fileName = `${Date.now()}.${fileExt}`;
      console.log("fileName",fileName)
      const filePath = `${fileName}`;
      console.log("filePath",filePath)


      const { error: uploadError } = await supabase
        .storage
        .from('products')
        .upload(filePath, image, {
          upsert: true,
        });

        if (uploadError) {
          console.log("Upload error:", uploadError.message || uploadError);
          throw uploadError;
        }

      const { data } = supabase.storage.from('products').getPublicUrl(filePath);
      imageUrl = data.publicUrl;
      console.log("image URLLL",imageUrl);
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Name: name,
        Description: description,
        Price: parseFloat(price),
        CategoryID: categoryId,
        ImgUrl: imageUrl, 
      }),
    });

    if (res.status === 409) {
      setCreateError("Ce produit existe déjà.");
      return;
    }

    if (!res.ok) {
      throw new Error("Erreur lors de la création du produit");
    }

    onClose();
  } catch (err: any) {
    setCreateError(err.message || "Erreur lors de la création du produit");
  } finally {
    setCreating(false);
  }
};

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImgUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Reset form on close
  React.useEffect(() => {
    if (!open) {
      setName('');
      setDescription('');
      setPrice('');
      setImage(null);
      setImgUrl('/photo.png');
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 22, textAlign: 'center', pb: 1 }}>
        Nouveau produit
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        {/* Image upload section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: 2,
              overflow: 'hidden',
              border: '2px dashed #d1d5db',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#f9fafb',
            }}
          >
            <img src={imgUrl} alt="Produit" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="contained"
              component="label"
              sx={{ bgcolor: '#050EAD', color: '#fff', fontWeight: 600, borderRadius: 2, textTransform: 'none', px: 3 }}
            >
              Upload
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </Button>
          </Box>
        </Box>
        {/* Product form */}
        <TextField
          label="Nom"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          fullWidth
          required
          multiline
          minRows={2}
        />
        <TextField
          label="Prix"
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
          fullWidth
          required
          inputProps={{ min: 0, step: 0.01 }}
        />
      </DialogContent>
      <DialogActions sx={{ pb: 2, px: 3 }}>
        <Button onClick={onClose} variant="outlined" sx={{ color: '#050EAD', borderColor: '#050EAD', '&:hover': { borderColor: '#050EAD', bgcolor: '#f0f4ff' } }}>Annuler</Button>
        <Button onClick={handleCreateProduct} variant="contained" sx={{ bgcolor: '#050EAD', color: '#fff', '&:hover': { bgcolor: '#2936d1' } }}>Créer</Button>
      </DialogActions>
    </Dialog>
  );
}
