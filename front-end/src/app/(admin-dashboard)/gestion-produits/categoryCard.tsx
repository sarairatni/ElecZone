import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { Button } from '@mui/material';
import Box from "@mui/material/Box";
import ProductTable from "./productTable";
import CreateProductPopUp from './createProductPopUp';

interface CategoryCardProps {
  id: number;
  name: string;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function CategoryCard({ id, name, onEdit, onDelete }: CategoryCardProps) {
  const actionsId = `category-actions-${id}`;
  const [openCreate, setOpenCreate] = React.useState(false);
  return (
    <Box sx={{ position: 'relative', fontFamily: 'Poppins, sans-serif'}}>
      <Accordion sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel-content-${id}`}
          id={`panel-header-${id}`}
        >
         <span className="font-medium text-base" style={{ flexGrow: 1 }}>
  {name}
</span>
        </AccordionSummary>
        <AccordionDetails>
          {/* New Product Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <button
              onClick={() => setOpenCreate(true)}
              style={{
                background: '#050EAD',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '6px 16px',
                fontWeight: 500,
                fontSize: 12,
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(5,14,173,0.08)',
                transition: 'background 0.2s',
              }}
            >
              Nouveau produit +
            </button>
          </Box>
          {/* Display the product table here */}
          <ProductTable categoryId={id} />
        </AccordionDetails>
      </Accordion>
      {/* Action icons absolutely positioned to the right, outside the summary button */}
      <Box
        id={actionsId}
        className="text-base" 
        sx={{
          position: 'absolute',
          top: 8,
          right: 48, 
          zIndex: 2,
          display: 'flex',
          gap: 0.5,
        }}
      >
        <IconButton
          size="small"
          aria-label="edit"
          onClick={e => {
            e.stopPropagation();
            onEdit && onEdit(id);
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          aria-label="delete"
          onClick={e => {
            e.stopPropagation();
            onDelete && onDelete(id);
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      {/* Create Product Popup */}
      <CreateProductPopUp open={openCreate} onClose={() => setOpenCreate(false)} categoryId={id} />
    </Box>
  );
}