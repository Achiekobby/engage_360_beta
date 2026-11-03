import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CircleUser, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';

export default function NavbarAccountActions() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    navigate('/signin', { replace: true });
  };

  return (
    <div className="flex shrink-0 items-center gap-3 sm:gap-4">
      <button
        type="button"
        className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10"
        aria-label="Notifications, 1 unread"
      >
        <Bell className="h-[1.35rem] w-[1.35rem] text-[#F5C842]" strokeWidth={2} fill="#F5C842" />
        <span className="absolute right-1 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E53935] px-1 text-[10px] font-bold text-white">
          1
        </span>
      </button>

      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
          aria-label="Account menu"
          aria-expanded={open}
        >
          <CircleUser className="h-6 w-6" strokeWidth={1.75} />
        </button>

        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[#E4E4E7] bg-white shadow-[0_12px_40px_rgba(11,19,84,0.12)]"
            >
              <div className="border-b border-[#EEF0F4] px-4 py-3">
                <p className="truncate text-sm font-semibold text-[#0B1354]">{user?.name ?? 'User'}</p>
                <p className="truncate text-xs text-[#717171]">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium text-[#0B1354] transition-colors hover:bg-[#F7F8FF]"
              >
                <LogOut className="h-4 w-4" strokeWidth={2} />
                Sign out
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
