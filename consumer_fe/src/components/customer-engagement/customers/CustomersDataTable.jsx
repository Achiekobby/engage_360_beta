import { ChevronDown, Layers } from 'lucide-react';
import CustomerActionMenu from './CustomerActionMenu';

const COLUMNS = [
  'Full Name',
  'Gender',
  'Age',
  'Phone Number',
  'Email Address',
  'Region',
  'Location',
  'Category',
  'Registration Date',
  'Action',
];

export default function CustomersDataTable({
  customers,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onView,
  onEdit,
  onSegmentChange,
  onDelete,
  onToggleActive,
  footer = null,
}) {
  const allSelected = customers.length > 0 && selectedIds.length === customers.length;

  return (
    <div className="overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.05)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] border-collapse">
          <thead>
            <tr className="border-b border-[#F0F2F7] bg-[#FAFBFC]">
              <th scope="col" className="w-10 px-3 py-3.5 first:pl-4 sm:pl-6">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  className="h-4 w-4 rounded border-[#D4D4D8] text-primary focus:ring-primary/30"
                  aria-label="Select all customers"
                />
              </th>
              {COLUMNS.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="whitespace-nowrap px-3 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[#717171] last:pr-4 sm:px-4 sm:last:pr-6"
                >
                  <span className="inline-flex items-center gap-1">
                    {column}
                    {column !== 'Action' ? (
                      <ChevronDown className="h-3 w-3 opacity-50" strokeWidth={2.5} />
                    ) : null}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => {
              const selected = selectedIds.includes(customer.id);

              return (
                <tr
                  key={customer.id}
                  className={`group border-b border-[#F0F2F7] transition-colors last:border-b-0 hover:bg-[#FAFBFF] ${selected ? 'bg-[#F7F8FF]/60' : ''}`}
                >
                  <td className="relative px-3 py-3.5 first:pl-4 sm:pl-6">
                    <span
                      className="absolute inset-y-0 left-0 w-0.5 scale-y-0 bg-primary transition-transform duration-200 group-hover:scale-y-100"
                      aria-hidden="true"
                    />
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => onToggleSelect(customer.id)}
                      className="h-4 w-4 rounded border-[#D4D4D8] text-primary focus:ring-primary/30"
                      aria-label={`Select ${customer.fullName}`}
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3.5 text-sm font-semibold text-[#0B1354] sm:px-4">
                    {customer.fullName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3.5 text-sm text-[#717171] sm:px-4">
                    {customer.gender}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3.5 text-sm text-[#717171] sm:px-4">
                    {customer.age}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3.5 text-sm text-[#0B1354] sm:px-4">
                    {customer.phone}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3.5 text-sm text-[#717171] sm:px-4">
                    {customer.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3.5 text-sm text-[#717171] sm:px-4">
                    {customer.region}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3.5 text-sm text-[#717171] sm:px-4">
                    {customer.location}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3.5 sm:px-4">
                    {customer.category ? (
                      <span className="inline-flex max-w-full items-center gap-1.5 rounded-sm bg-[#F7F8FF] px-2.5 py-1.5 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/15">
                        <Layers className="h-3 w-3 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                        <span className="truncate">{customer.category}</span>
                      </span>
                    ) : (
                      <span className="text-sm text-[#9AA0B0]">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3.5 text-sm text-[#717171] sm:px-4">
                    {customer.registeredAt}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3.5 last:pr-4 sm:px-4 sm:last:pr-6">
                    <CustomerActionMenu
                      customer={customer}
                      onView={onView}
                      onEdit={onEdit}
                      onSegmentChange={onSegmentChange}
                      onDelete={onDelete}
                      onToggleActive={onToggleActive}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {footer}
    </div>
  );
}
