import { Link } from 'react-router-dom';

const LINKS = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Support', to: '/tickets' },
];

export default function AdminFooter() {
  return (
    <footer className="mt-auto border-t border-[#EEF0F4] bg-white">
      <div className="flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-xs text-[#717171]">© {new Date().getFullYear()} Engage360. All rights reserved.</p>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {LINKS.map((item) =>
            item.to ? (
              <Link
                key={item.label}
                to={item.to}
                className="text-xs font-medium text-[#52525B] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="text-xs font-medium text-[#52525B] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                {item.label}
              </a>
            ),
          )}
        </nav>
      </div>
    </footer>
  );
}
