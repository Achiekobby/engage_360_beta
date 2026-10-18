import { useEffect, useId, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Ban, BarChart3, Eye, MoreHorizontal, PauseCircle, Pencil, PlayCircle, Wallet } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { updateBusiness } from '../../store/slices/businessesSlice';

const GAP = 8;
const VIEWPORT_PAD = 8;

export function BusinessActionsButton({ business, pressed, onOpen, variant = 'default' }) {
  const classes =
    variant === 'on-primary'
      ? `text-white/80 hover:bg-white/15 hover:text-white focus-visible:ring-white/30 ${pressed ? 'bg-white/15 text-white' : ''}`
      : `text-[#717171] hover:bg-[#EFF6FF] hover:text-primary focus-visible:ring-primary/30 ${pressed ? 'bg-[#EFF6FF] text-primary' : ''}`;

  return (
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={pressed}
      aria-label={`Actions for ${business.companyName}`}
      onClick={(event) => onOpen(business, event.currentTarget)}
      className={`inline-flex cursor-pointer items-center justify-center rounded-lg p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 ${classes}`}
    >
      <MoreHorizontal className="h-5 w-5" />
    </button>
  );
}

function menuItemClass(tone = 'default') {
  if (tone === 'danger') {
    return 'flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm font-medium text-[#DC2626] transition-colors hover:bg-[#FEF2F2] focus-visible:bg-[#FEF2F2] focus-visible:outline-none';
  }
  return 'flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm font-medium text-[#3F3F46] transition-colors hover:bg-[#F4F7FB] hover:text-[#0B1354] focus-visible:bg-[#F4F7FB] focus-visible:text-[#0B1354] focus-visible:outline-none';
}

function MenuItem({ item, onClose }) {
  const Icon = item.icon;
  const className = menuItemClass(item.tone);
  const iconWell =
    item.tone === 'danger'
      ? 'bg-[#FEF2F2] text-[#DC2626]'
      : 'bg-[#F4F7FB] text-[#52525B]';
  const content = (
    <>
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${iconWell}`}>
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      {item.label}
    </>
  );

  if (item.to) {
    return (
      <Link to={item.to} role="menuitem" className={className} onClick={onClose}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" role="menuitem" className={className} onClick={item.onSelect}>
      {content}
    </button>
  );
}

function placeMenu(trigger, menu) {
  const rect = trigger.getBoundingClientRect();
  const menuHeight = menu.offsetHeight;
  const menuWidth = menu.offsetWidth;
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  const fitsBelow = spaceBelow >= menuHeight + GAP;
  const fitsAbove = spaceAbove >= menuHeight + GAP;
  const placement = !fitsBelow && (fitsAbove || spaceAbove > spaceBelow) ? 'up' : 'down';

  let top = placement === 'up' ? rect.top - GAP - menuHeight : rect.bottom + GAP;
  top = Math.max(VIEWPORT_PAD, Math.min(top, window.innerHeight - menuHeight - VIEWPORT_PAD));

  let left = rect.right - menuWidth;
  left = Math.max(VIEWPORT_PAD, Math.min(left, window.innerWidth - menuWidth - VIEWPORT_PAD));

  return { top, left, placement };
}

function anchorIsOnScreen(anchor) {
  if (!anchor || anchor.getClientRects().length === 0) return false;
  const rect = anchor.getBoundingClientRect();
  const scroller = document.querySelector('[data-admin-scroll]');
  const bounds = scroller ? scroller.getBoundingClientRect() : { top: 0, bottom: window.innerHeight };
  return rect.bottom > bounds.top && rect.top < bounds.bottom;
}

export default function BusinessActionsMenu({
  business,
  anchor,
  onClose,
  onEdit,
  onCredit,
  includeView = true,
}) {
  const dispatch = useAppDispatch();
  const menuId = useId();
  const [position, setPosition] = useState(null);
  const [menuNode, setMenuNode] = useState(null);

  useLayoutEffect(() => {
    if (!business || !anchor || !menuNode) return undefined;

    const update = () => {
      if (!anchorIsOnScreen(anchor)) {
        onClose();
        return;
      }
      setPosition(placeMenu(anchor, menuNode));
    };

    update();
    document.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      document.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [business, anchor, menuNode, onClose]);

  useEffect(() => {
    if (!business || !menuNode) return undefined;
    const onPointer = (event) => {
      if (anchor?.contains(event.target) || menuNode.contains(event.target)) return;
      onClose();
    };
    const onKey = (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      onClose();
      anchor?.focus();
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    menuNode.querySelector('[role="menuitem"]')?.focus();
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [business, anchor, menuNode, onClose]);

  if (!business) return null;

  const onMenuKeyDown = (event) => {
    const items = [...(menuNode?.querySelectorAll('[role="menuitem"]') ?? [])];
    if (!items.length) return;
    const index = items.indexOf(document.activeElement);
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      items[(index + 1) % items.length]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      items[(index - 1 + items.length) % items.length]?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      items[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      items.at(-1)?.focus();
    }
  };

  const setStatus = (status) => {
    dispatch(updateBusiness({ id: business.id, changes: { status } }));
    onClose();
    anchor?.focus();
  };

  const suspended = business.status === 'suspended';
  const deactivated = business.status === 'deactivated';
  const items = [
    ...(includeView
      ? [{ key: 'view', label: 'View profile', icon: Eye, to: `/businesses/${business.id}` }]
      : []),
    {
      key: 'analytics',
      label: 'View data analytics',
      icon: BarChart3,
      to: `/businesses/${business.id}/analytics`,
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: Pencil,
      onSelect: () => {
        onEdit(business);
        onClose();
      },
    },
    {
      key: 'credit',
      label: 'Credit top-up',
      icon: Wallet,
      onSelect: () => {
        onCredit(business);
        onClose();
      },
    },
    {
      key: 'suspend',
      label: suspended ? 'Reinstate' : 'Suspend',
      icon: suspended ? PlayCircle : PauseCircle,
      onSelect: () => setStatus(suspended ? 'active' : 'suspended'),
    },
  ];
  const footer = {
    key: 'deactivate',
    label: deactivated ? 'Activate' : 'Deactivate',
    icon: deactivated ? PlayCircle : Ban,
    tone: deactivated ? 'default' : 'danger',
    onSelect: () => setStatus(deactivated ? 'active' : 'deactivated'),
  };

  return createPortal(
    <div
      ref={setMenuNode}
      id={menuId}
      role="menu"
      aria-label={`${business.companyName} actions`}
      onKeyDown={onMenuKeyDown}
      style={{
        position: 'fixed',
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        visibility: position ? 'visible' : 'hidden',
      }}
      className={`z-[80] w-[236px] admin-card overflow-hidden rounded-xl border border-[#EEF0F4] bg-white shadow-[0_12px_32px_rgba(11,19,84,0.14)] ${
        position?.placement === 'up' ? 'origin-bottom' : 'origin-top'
      }`}
    >
      <div className="p-1.5">
        {items.map((item) => (
          <MenuItem key={item.key} item={item} onClose={onClose} />
        ))}
      </div>
      <div className="border-t border-[#F0F2F7] bg-[#FAFBFC] p-1.5">
        <MenuItem item={footer} onClose={onClose} />
      </div>
    </div>,
    document.body,
  );
}
