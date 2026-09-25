import { Edit3, StickyNote } from 'lucide-react';
import SlideDrawer from './SlideDrawer';
import CustomerAvatar from './CustomerAvatar';
import SegmentBadge from './SegmentBadge';

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-[#717171]">{label}</p>
      <p className="mt-1 text-base font-semibold text-[#0B1354]">{value}</p>
    </div>
  );
}

export default function ViewCustomerDrawer({
  customer,
  isOpen,
  onClose,
  onWriteNote,
  onEdit,
}) {
  if (!customer) return null;

  return (
    <SlideDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Customer Profile"
      subtitle="Detailed view of customer information"
      maxWidth="max-w-xl"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="w-full cursor-pointer rounded-sm border border-primary/30 bg-white px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-[#F7F8FF]"
        >
          Close
        </button>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-4 border-b border-[#F0F2F7] pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <CustomerAvatar name={customer.fullName} imageUrl={customer.imageUrl} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-bold text-[#0B1354]">{customer.fullName}</h3>
                <SegmentBadge segment={customer.segment} />
              </div>
              <p className="mt-1 text-sm text-[#717171]">
                {customer.region} | {customer.location}
              </p>
              <p className="mt-0.5 text-sm font-medium text-[#717171]">{customer.gender}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onWriteNote(customer)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm bg-[#2E7DAD] px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#256892]"
                >
                  <StickyNote className="h-4 w-4" strokeWidth={2} />
                  Write Notes
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(customer)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-[#2E7DAD]/40 bg-white px-3.5 py-2 text-sm font-semibold text-[#2E7DAD] transition-colors hover:bg-[#E8F4FC]"
                >
                  <Edit3 className="h-4 w-4" strokeWidth={2} />
                  Edit Details
                </button>
              </div>
            </div>
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center self-start rounded-full bg-gradient-to-br from-primary to-[#6B4FE0] text-sm font-bold text-white shadow-[0_8px_24px_rgba(58,16,205,0.25)] sm:self-center">
            Elite
          </div>
        </div>

        <div className="rounded-sm border border-[#EEF0F4] bg-[#FAFBFC] p-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InfoItem label="Phone number" value={customer.phone} />
            <InfoItem label="Customer since" value={customer.customerSince} />
            <InfoItem label="Email Address" value={customer.email} />
            <InfoItem label="WhatsApp Number" value={customer.whatsapp} />
            <InfoItem label="Category" value={customer.category} />
            <InfoItem label="Sub-Category" value={customer.subCategory} />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-base font-bold text-[#0B1354]">Notes</h4>
          {customer.notes?.length ? (
            customer.notes.map((note) => (
              <article
                key={note.id}
                className="rounded-sm border border-[#EEF0F4] bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3 border-b border-[#F0F2F7] pb-3">
                  <span className="text-sm font-semibold text-[#0B1354]">{note.title}</span>
                  <span className="text-xs text-[#717171]">{note.date}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#717171]">{note.body}</p>
              </article>
            ))
          ) : (
            <p className="rounded-sm border border-dashed border-[#E4E4E7] bg-[#FAFBFC] px-4 py-6 text-center text-sm text-[#717171]">
              No notes yet. Use Write Notes to add the first one.
            </p>
          )}
        </div>
      </div>
    </SlideDrawer>
  );
}
