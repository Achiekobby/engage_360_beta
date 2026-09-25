import { useEffect, useState } from 'react';
import SlideDrawer from './SlideDrawer';

export default function CreateCustomerCategoryDrawer({ isOpen, onClose, onSubmit }) {
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    if (isOpen) setCategoryName('');
  }, [isOpen]);

  const handleClose = () => {
    setCategoryName('');
    onClose();
  };

  const handleSubmit = () => {
    const trimmed = categoryName.trim();
    if (!trimmed) return;

    onSubmit?.(trimmed);
    handleClose();
  };

  return (
    <SlideDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Customer Category"
      footer={
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!categoryName.trim()}
          className="w-full cursor-pointer rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-all hover:bg-[#320EB8] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Create
        </button>
      }
    >
      <div>
        <label htmlFor="categoryName" className="mb-1.5 block text-sm font-medium text-[#717171]">
          Category Name
        </label>
        <input
          id="categoryName"
          type="text"
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value)}
          placeholder="Enter Category Name"
          className="w-full rounded-sm border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#0B1354] outline-none transition-all placeholder:text-[#717171] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleSubmit();
          }}
        />
      </div>
    </SlideDrawer>
  );
}
