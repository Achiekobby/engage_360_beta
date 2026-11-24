import { Eye, Pencil, Trash2 } from 'lucide-react';
import RowActionMenu from './RowActionMenu';

export default function CategoryActions({ category, onOpen, onEdit, onDelete }) {
  return (
    <div className="flex justify-end">
      <RowActionMenu
        label={`Actions for ${category.name}`}
        items={[
          {
            key: 'open',
            label: 'Open',
            icon: Eye,
            onSelect: () => onOpen?.(category),
          },
          {
            key: 'edit',
            label: 'Edit',
            icon: Pencil,
            onSelect: () => onEdit?.(category),
          },
          {
            key: 'delete',
            label: 'Archive',
            icon: Trash2,
            tone: 'danger',
            onSelect: () => onDelete?.(category),
          },
        ]}
      />
    </div>
  );
}
