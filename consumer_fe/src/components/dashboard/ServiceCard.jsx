import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getServiceImage } from './platformServicesData';

export default function ServiceCard({ title, description, imageKey, path, index }) {
  const image = getServiceImage(imageKey);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={path}
        className="group flex h-full flex-col items-center rounded-[5px] border-2 border-[#EEF0F4] bg-white px-4 py-6 text-center shadow-[0_4px_20px_rgba(11,19,84,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_12px_36px_rgba(58,16,205,0.12)] sm:px-5 sm:py-7"
      >
        <div className="flex h-[7.5rem] w-full items-center justify-center sm:h-32">
          <img
            src={image}
            alt=""
            className="max-h-full max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <h3 className="mt-2 text-base font-bold text-[#0B1354] sm:text-lg">{title}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-[#717171] sm:text-sm">{description}</p>
      </Link>
    </motion.div>
  );
}
