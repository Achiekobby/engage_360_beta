import { useEffect, useState } from 'react';
import SlideDrawer from './SlideDrawer';

export default function AddCollectionDrawer({ isOpen, onClose, onSubmit }) {
  const [collectionName, setCollectionName] = useState('');

  useEffect(() => {
    if (isOpen) setCollectionName('');
  }, [isOpen]);

  const handleClose = () => {
    setCollectionName('');
    onClose();
  };

  const handleSubmit = () => {
    const trimmed = collectionName.trim();
    if (!trimmed) return;

    onSubmit?.(trimmed);
    handleClose();
  };

  return (
    <SlideDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Collection"
      footer={
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!collectionName.trim()}
          className="w-full cursor-pointer rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-all hover:bg-[#320EB8] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save
        </button>
      }
    >
      <div>
        <label htmlFor="collectionName" className="mb-1.5 block text-sm font-medium text-[#717171]">
          Collection Name
        </label>
        <input
          id="collectionName"
          type="text"
          value={collectionName}
          onChange={(event) => setCollectionName(event.target.value)}
          placeholder="Enter Collection Name"
          className="w-full rounded-sm border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#0B1354] outline-none transition-all placeholder:text-[#717171] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleSubmit();
          }}
        />
      </div>
    </SlideDrawer>
  );
}
