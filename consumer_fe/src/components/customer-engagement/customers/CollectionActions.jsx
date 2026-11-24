import { FileStack, Pencil, Trash2, UserPlus, Users } from 'lucide-react';
import RowActionMenu from './RowActionMenu';

export function CollectionActions({
  collection,
  onDelete,
  onEdit,
  onView,
  onViewContacts,
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
          onViewContacts
            ? {
                key: 'contacts',
                label: 'View contacts',
                icon: Users,
                onSelect: () => onViewContacts(collection),
              }
            : null,
          onView
            ? {
                key: 'view',
                label: 'View bulk uploads',
                icon: FileStack,
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
            label: 'Archive',
            icon: Trash2,
            tone: 'danger',
            onSelect: () => onDelete?.(collection),
          },
        ]}
      />
    </div>
  );
}
