import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { businessInitials, formatOnboardedDate } from '../../constants/businesses';
import BusinessActionsMenu, { BusinessActionsButton } from './BusinessActionsMenu';
import StatusBadge from './StatusBadge';

function Mark({ business, size = 'md' }) {
  const dimension = size === 'sm' ? 'h-9 w-9 text-xs' : 'h-11 w-11 text-sm';
  if (business.logoDataUrl) {
    return (
      <img
        src={business.logoDataUrl}
        alt=""
        className={`${dimension} rounded-lg object-cover`}
      />
    );
  }

  return (
    <span
      className={`${dimension} inline-flex items-center justify-center rounded-lg bg-[#EFF6FF] font-semibold text-primary`}
      aria-hidden="true"
    >
      {businessInitials(business.companyName)}
    </span>
  );
}

function SelectBox({ checked, indeterminate = false, onChange, label }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={label}
      className="h-4 w-4 cursor-pointer rounded border-[#D4D4D8] accent-primary"
    />
  );
}

export default function BusinessesTable({ businesses, selectedIds, onToggle, onTogglePage, onEdit, onCredit }) {
  const [menu, setMenu] = useState(null);
  const closeMenu = useCallback(() => setMenu(null), []);
  const openMenu = useCallback((business, anchor) => {
    setMenu((current) => (current?.business.id === business.id ? null : { business, anchor }));
  }, []);

  if (!businesses.length) return null;

  const selectedOnPage = businesses.filter((business) => selectedIds.has(business.id)).length;
  const allOnPage = selectedOnPage === businesses.length;

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.04)] md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="border-b border-[#F0F2F7] bg-[#FAFBFC]">
                <th scope="col" className="w-12 py-3.5 pl-5 pr-2">
                  <SelectBox
                    checked={allOnPage}
                    indeterminate={selectedOnPage > 0 && !allOnPage}
                    onChange={() => onTogglePage(businesses.map((business) => business.id), !allOnPage)}
                    label="Select businesses on this page"
                  />
                </th>
                {['Business', 'Contact', 'Email', 'Phone', 'Onboarded', 'Status'].map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#717171]"
                  >
                    {column}
                  </th>
                ))}
                <th scope="col" className="px-4 py-3.5 pr-5 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {businesses.map((business) => (
                <tr
                  key={business.id}
                  className="group border-b border-[#F0F2F7] transition-colors last:border-b-0 hover:bg-[#FAFBFF]"
                >
                  <td className="py-3.5 pl-5 pr-2">
                    <SelectBox
                      checked={selectedIds.has(business.id)}
                      onChange={() => onToggle(business.id)}
                      label={`Select ${business.companyName}`}
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <Link
                      to={`/businesses/${business.id}`}
                      className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    >
                      <Mark business={business} />
                      <span className="text-sm font-semibold text-[#0B1354] group-hover:text-primary">
                        {business.companyName}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-[#0B1354]">{business.contactPersonName}</td>
                  <td className="px-4 py-3.5 text-sm text-[#717171]">{business.companyEmail}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#717171]">
                    {business.companyPhone}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#717171]">
                    {formatOnboardedDate(business.onboardedAt)}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={business.status} />
                  </td>
                  <td className="px-4 py-3.5 pr-5 text-right">
                    <BusinessActionsButton
                      business={business}
                      pressed={menu?.business.id === business.id}
                      onOpen={openMenu}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ul className="space-y-3 md:hidden">
        {businesses.map((business) => (
          <li
            key={business.id}
            className="flex items-center gap-3 rounded-xl border border-[#EEF0F4] bg-white p-4 shadow-[0_4px_20px_rgba(11,19,84,0.04)]"
          >
            <SelectBox
              checked={selectedIds.has(business.id)}
              onChange={() => onToggle(business.id)}
              label={`Select ${business.companyName}`}
            />
            <Link
              to={`/businesses/${business.id}`}
              className="flex min-w-0 flex-1 items-center gap-3"
            >
              <Mark business={business} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-[#0B1354]">
                  {business.companyName}
                </span>
                <span className="mt-0.5 block truncate text-xs text-[#717171]">{business.companyEmail}</span>
                <span className="mt-2 inline-flex">
                  <StatusBadge status={business.status} />
                </span>
              </span>
            </Link>
            <BusinessActionsButton
              business={business}
              pressed={menu?.business.id === business.id}
              onOpen={openMenu}
            />
          </li>
        ))}
      </ul>
      <BusinessActionsMenu
        business={menu ? businesses.find((item) => item.id === menu.business.id) ?? menu.business : null}
        anchor={menu?.anchor ?? null}
        onClose={closeMenu}
        onEdit={onEdit}
        onCredit={onCredit}
      />
    </>
  );
}
