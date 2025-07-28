import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

interface CategoryCardProps {
  id: number;
  name: string;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function CategoryCard({ id, name, onEdit, onDelete }: CategoryCardProps) {
const actionsId = `category-actions-${id}`;
  return (
    <Box sx={{ position: 'relative' }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel-content-${id}`}
          id={`panel-header-${id}`}
        >
          <Typography component="span" className="font-medium" sx={{ flexGrow: 1 }}>
            {name}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
        </AccordionDetails>
      </Accordion>
      {/* Action icons absolutely positioned to the right, outside the summary button */}
      <Box
        id={actionsId}
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
    </Box>
  );
}