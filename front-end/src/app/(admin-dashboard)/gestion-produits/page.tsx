"use client";
import { useEffect, useState } from "react";
import CategoryCard from "./categoryCard";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface Category {
  CategoryID: number;
  Name: string;
}

export default function GestionProduits() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Popup création
  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Popup suppression
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: number; name: string } | null>(null);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Popup édition
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<{ id: number; name: string } | null>(null);
  const [editInput, setEditInput] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      if (!res.ok) throw new Error("Erreur lors du chargement des catégories");
      const data = await res.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Création
  const handleOpen = () => {
    setNewCategory("");
    setCreateError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCreateError(null);
  };

  const handleCreate = async () => {
    setCreating(true);
    setCreateError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Name: newCategory }),
      });
      if (res.status === 409) {
        setCreateError("Cette catégorie existe déjà.");
        return;
      }
      if (!res.ok) throw new Error("Erreur lors de la création");
      handleClose();
      fetchCategories();
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  // Suppression
  const handleDeleteClick = (id: number, name: string) => {
    setCategoryToDelete({ id, name });
    setDeleteInput("");
    setDeleteError(null);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
    setDeleteInput("");
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    if (deleteInput.trim() !== categoryToDelete.name) {
      setDeleteError("Le nom ne correspond pas.");
      return;
    }
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      handleDeleteDialogClose();
      fetchCategories();
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // Edition
  const handleEditClick = (id: number, name: string) => {
    setCategoryToEdit({ id, name });
    setEditInput(name);
    setEditError(null);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setCategoryToEdit(null);
    setEditInput("");
    setEditError(null);
  };

  const handleConfirmEdit = async () => {
    if (!categoryToEdit) return;
    if (!editInput.trim()) {
      setEditError("Le nom ne peut pas être vide.");
      return;
    }
    setEditing(true);
    setEditError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryToEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Name: editInput }),
      });
      if (res.status === 409) {
        setEditError("Ce nom de catégorie existe déjà.");
        return;
      }
      if (!res.ok) throw new Error("Erreur lors de la modification");
      handleEditDialogClose();
      fetchCategories();
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setEditing(false);
    }
  };

  return (
    <div className="pb-4">
      <div className="p-5">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Produits</h1>
        <p className="text-gray-600 text-sm mt-2">
          Gérez vos produits, ajoutez de nouveaux articles et modifiez les existants.
        </p>
      </div>
      <div className="bg-gray-50 px-5 w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Liste des Catégories</h2>
          <button
            className="bg-[#FF6767] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#ff6767]/80 transition-colors flex items-center gap-1"
            onClick={handleOpen}
          >
            Ajouter une Catégorie
            <AddIcon fontSize="small" />
          </button>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Chargement des catégories...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Aucune catégorie trouvée.</div>
        ) : (
          <div className="space-y-4">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.CategoryID}
                id={cat.CategoryID}
                name={cat.Name}
                onDelete={() => handleDeleteClick(cat.CategoryID, cat.Name)}
                onEdit={() => handleEditClick(cat.CategoryID, cat.Name)}
              />
            ))}
          </div>
        )}

        {/* Popup création */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nom de la catégorie"
              fullWidth
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              size="small"
              error={!!createError}
              disabled={creating}
            />
            {createError && (
              <div className="text-xs text-red-500 mt-1">{createError}</div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="inherit" disabled={creating}>
              Annuler
            </Button>
            <Button
              onClick={handleCreate}
              color="primary"
              variant="contained"
              disabled={!newCategory.trim() || creating}
            >
              Créer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Popup suppression */}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
          <DialogTitle>Supprimer la catégorie</DialogTitle>
          <DialogContent>
            <p>
              Pour confirmer la suppression, tape le nom exact de la catégorie&nbsp;:
              <span className="font-bold text-[#FF6767]"> {categoryToDelete?.name}</span>
            </p>
            <TextField
              autoFocus
              margin="dense"
              label="Nom de la catégorie"
              fullWidth
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              size="small"
              error={!!deleteError}
              disabled={deleting}
            />
            {deleteError && (
              <div className="text-xs text-red-500 mt-1">{deleteError}</div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose} color="inherit" disabled={deleting}>
              Annuler
            </Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
              disabled={deleting || !deleteInput.trim()}
            >
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Popup édition */}
        <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
          <DialogTitle>Modifier la catégorie</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nom de la catégorie"
              fullWidth
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
              size="small"
              error={!!editError}
              disabled={editing}
            />
            {editError && (
              <div className="text-xs text-red-500 mt-1">{editError}</div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditDialogClose} color="inherit" disabled={editing}>
              Annuler
            </Button>
            <Button
              onClick={handleConfirmEdit}
              color="primary"
              variant="contained"
              disabled={editing || !editInput.trim()}
            >
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}