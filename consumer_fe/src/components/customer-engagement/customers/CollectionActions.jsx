import { Eye, Pencil, Trash2, UserPlus } from 'lucide-react';
import RowActionMenu from './RowActionMenu';

export function CollectionActions({
  collection,
  onDelete,
  onEdit,
  onView,
  onAddCustomer,
}) {
  return (
    <div className="flex justify-end">
      <RowActionMenu
        label={`Actions for ${collection.name}`}
        items={[
          onAddCustomer
            ? {
                key: 'add',
                label: 'Add customer',
                icon: UserPlus,
                onSelect: () => onAddCustomer(collection),
              }
            : null,
          onView
            ? {
                key: 'view',
                label: 'View',
                icon: Eye,
                onSelect: () => onView(collection),
              }
            : null,
          onEdit
            ? {
                key: 'edit',
                label: 'Edit',
                icon: Pencil,
                onSelect: () => onEdit(collection),
              }
            : null,
          {
            key: 'delete',
            label: 'Delete',
            icon: Trash2,
            tone: 'danger',
            onSelect: () => onDelete?.(collection),
          },
        ]}
      />
    </div>
  );
}
