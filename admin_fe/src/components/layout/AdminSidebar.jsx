import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { clsx } from 'clsx';
import { ADMIN_NAV } from './adminNavData';

const DROPDOWN_MS = 300;

function keepSectionInView(nav, section, duration = DROPDOWN_MS) {
  if (!nav || !section) return undefined;

  const align = () => {
    const navRect = nav.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    const pad = 12;
    const overflowBottom = sectionRect.bottom - (navRect.bottom - pad);
    if (overflowBottom > 1) nav.scrollTop += overflowBottom;
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    align();
    return undefined;
  }

  const start = performance.now();
  let frame = 0;
  const step = (now) => {
    align();
    if (now - start < duration) frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);
  return () => cancelAnimationFrame(frame);
}

function TreeElbow({ last, dashed = false }) {
  const dash = dashed ? { strokeDasharray: '3 2.5' } : undefined;
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[27px] w-5">
      <svg viewBox="0 0 20 40" className="h-full w-full overflow-visible" preserveAspectRatio="none">
        <path
          d="M1 0 V10 C1 20 10 20 20 20"
          fill="none"
          stroke="#9AA3B2"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          {...dash}
        />
        {last ? null : (
          <path
            d="M1 20 V40"
            fill="none"
            stroke="#9AA3B2"
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            {...dash}
          />
        )}
      </svg>
    </span>
  );
}

function ChildList({ id, label, items, dashed, open, childIsActive, onNavigate }) {
  return (
    <ul id={id} className="relative mt-1" aria-label={`${label} sections`} aria-hidden={!open}>
      {items.map((child, index) => {
        const ChildIcon = child.icon;
        const active = childIsActive(child);
        const last = index === items.length - 1;
        return (
          <li key={child.tab ?? child.category ?? child.to} className="relative py-1.5">
            <TreeElbow last={last} dashed={dashed} />
            <Link
              to={child.to}
              title={child.comingSoon ? `${child.label} (Coming soon)` : child.label}
              aria-current={active ? 'page' : undefined}
              tabIndex={open ? undefined : -1}
              onClick={onNavigate}
              className={clsx(
                'relative z-10 ml-12 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                active
                  ? 'bg-[#E8F3FF] font-semibold text-[#0B1354]'
                  : 'font-medium text-[#3F3F46] hover:bg-[#F4F7FB] hover:text-primary',
              )}
            >
              <ChildIcon
                className={clsx('h-4 w-4 shrink-0', active ? 'text-primary' : 'text-[#717171]')}
                strokeWidth={1.75}
              />
              <span className="min-w-0 truncate">{child.label}</span>
              {child.comingSoon ? (
                <span className="shrink-0 rounded-md bg-[#FFF6E5] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#B45309]">
                  Coming soon
                </span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function BranchStub({ dashed = false }) {
  if (dashed) {
    return (
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-[27px] top-full z-0 h-2.5 w-px overflow-visible"
        viewBox="0 0 2 10"
        preserveAspectRatio="none"
      >
        <path
          d="M1 0 V10"
          fill="none"
          stroke="#9AA3B2"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="3 2.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  }

  return <span aria-hidden="true" className="absolute left-[28px] top-full z-0 h-2.5 w-px bg-[#9AA3B2]" />;
}

export default function AdminSidebar({ collapsed = false, onToggleCollapse, onNavigate, className = '' }) {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const [manualOpen, setManualOpen] = useState({});
  const navRef = useRef(null);
  const sectionRefs = useRef({});
  const openMenusRef = useRef('');

  useEffect(() => {
    setManualOpen({});
  }, [pathname]);

  const campaignCategory =
    pathname === '/campaigns' || pathname === '/campaigns/analytics' ? searchParams.get('category') : null;
  const settingsTab = pathname === '/settings' ? searchParams.get('tab') || 'overview' : null;

  const childIsActive = (child) => {
    if (child.category) return campaignCategory === child.category;
    if (child.tab) return settingsTab === child.tab;
    if (child.end) return pathname === child.to;
    return pathname === child.to || pathname.startsWith(`${child.to}/`);
  };

  const sectionIsActive = (to) => pathname === to || pathname.startsWith(`${to}/`);

  const childrenOpen = (item) => {
    if (!item.dropdown) return true;
    if (manualOpen[item.to] != null) return manualOpen[item.to];
    return sectionIsActive(item.to);
  };

  const openMenuKey = ADMIN_NAV.filter((item) => item.dropdown && childrenOpen(item))
    .map((item) => item.to)
    .join('|');

  useEffect(() => {
    const previous = new Set(openMenusRef.current.split('|').filter(Boolean));
    const opened = ADMIN_NAV.filter((item) => item.dropdown && childrenOpen(item) && !previous.has(item.to));
    openMenusRef.current = openMenuKey;
    if (collapsed || !opened.length) return undefined;

    const cancels = opened.map((item) => keepSectionInView(navRef.current, sectionRefs.current[item.to]));
    return () => cancels.forEach((cancel) => cancel?.());
  }, [collapsed, openMenuKey]);

  const toggleDropdown = (to, next) => {
    setManualOpen((current) => ({ ...current, [to]: next }));
  };

  return (
    <div className={clsx('flex h-full min-h-0 flex-col bg-white', className)}>
      <nav
        ref={navRef}
        aria-label="Admin"
        className={clsx(
          'scrollbar-thin min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4 pt-4',
          collapsed ? 'px-2' : 'px-3',
        )}
      >
        <p
          className={clsx(
            'px-3 pb-2 text-[11px] font-semibold tracking-[0.16em] text-[#A1A1AA]',
            collapsed && 'sr-only',
          )}
        >
          MANAGE
        </p>
        <ul className="space-y-1">
          {ADMIN_NAV.map((item) => {
            const { label, to, icon: Icon, end, children, dropdown } = item;
            const hasChildren = Boolean(children?.length);
            const open = hasChildren && !collapsed && childrenOpen(item);
            const dashed = Boolean(dropdown);
            const childListId = `${to.replace(/\W+/g, '-')}-sections`;

            return (
              <li
                key={to}
                ref={(node) => {
                  if (dropdown) sectionRefs.current[to] = node;
                }}
              >
                <div className="relative">
                  <NavLink
                    to={to}
                    end={end}
                    title={label}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      clsx(
                        'group relative z-10 flex items-center rounded-xl py-2.5 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                        collapsed ? 'justify-center px-2' : 'gap-3 px-3',
                        dropdown && !collapsed && 'pr-10',
                        isActive
                          ? 'bg-primary font-semibold text-white shadow-[0_8px_18px_rgba(37,99,235,0.22)]'
                          : 'font-medium text-[#3F3F46] hover:bg-[#EFF6FF] hover:text-primary',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={clsx(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                            isActive
                              ? 'bg-white/15 text-white'
                              : 'bg-[#F6F7FB] text-[#717171] group-hover:bg-white group-hover:text-primary',
                          )}
                        >
                          <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                        </span>
                        <span className={clsx('truncate', collapsed && 'sr-only')}>{label}</span>
                      </>
                    )}
                  </NavLink>
                  {dropdown && hasChildren && !collapsed ? (
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={childListId}
                      aria-label={`${open ? 'Collapse' : 'Expand'} ${label}`}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        toggleDropdown(to, !open);
                      }}
                      className={clsx(
                        'absolute right-1.5 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                        sectionIsActive(to)
                          ? 'text-white hover:bg-white/15'
                          : 'text-[#717171] hover:bg-[#EFF6FF] hover:text-primary',
                      )}
                    >
                      <ChevronDown
                        className={clsx(
                          'h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                          open && 'rotate-180',
                        )}
                        strokeWidth={2}
                      />
                    </button>
                  ) : null}
                  {open ? <BranchStub dashed={dashed} /> : null}
                </div>
                {hasChildren && !collapsed ? (
                  dropdown ? (
                    <div
                      className={clsx(
                        'grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                      )}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <ChildList
                          id={childListId}
                          label={label}
                          items={children}
                          dashed={dashed}
                          open={open}
                          childIsActive={childIsActive}
                          onNavigate={onNavigate}
                        />
                      </div>
                    </div>
                  ) : (
                    <ChildList
                      id={childListId}
                      label={label}
                      items={children}
                      dashed={dashed}
                      open
                      childIsActive={childIsActive}
                      onNavigate={onNavigate}
                    />
                  )
                ) : null}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={clsx('shrink-0 border-t border-[#F0F2F7]', collapsed ? 'p-2' : 'px-3 py-3')}>
        {!collapsed ? (
          <p className="px-1 pb-3 text-xs leading-relaxed text-[#717171]">
            Manage businesses and platform access.
          </p>
        ) : null}
        {onToggleCollapse ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={clsx(
              'flex w-full cursor-pointer items-center rounded-xl py-2.5 text-sm font-medium text-[#3F3F46] transition-colors hover:bg-[#EFF6FF] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
              collapsed ? 'justify-center px-2' : 'gap-3 px-3',
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-[18px] w-[18px]" strokeWidth={1.75} />
            ) : (
              <PanelLeftClose className="h-[18px] w-[18px]" strokeWidth={1.75} />
            )}
            <span className={clsx(collapsed && 'sr-only')}>{collapsed ? 'Expand' : 'Collapse'}</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
