import { motion, useReducedMotion } from 'framer-motion';
import Images from '../../utils/Images';
import { Reveal } from '../motion';
import { PRODUCT_HERO_CUSTOMER } from './productHeroData';

const ORBIT_ICONS = [
  {
    id: 'restaurant',
    src: Images.products.restaurant,
    position: 'left-[30%] top-[2%]',
    size: 'h-14 w-14 sm:h-16 sm:w-16',
    delay: 0,
  },
  {
    id: 'bank',
    src: Images.products.bank,
    position: 'right-[6%] top-[16%]',
    size: 'h-14 w-14 sm:h-[4.5rem] sm:w-[4.5rem]',
    delay: 0.15,
  },
  {
    id: 'building',
    src: Images.products.building,
    position: 'right-0 top-[62%]',
    size: 'h-16 w-16 sm:h-[4.75rem] sm:w-[4.75rem]',
    delay: 0.3,
  },
  {
    id: 'store',
    src: Images.products.store,
    position: 'left-[8%] top-[72%]',
    size: 'h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20',
    delay: 0.45,
  },
];

function FloatingIcon({ src, position, size, delay, reduceMotion }) {
  return (
    <div className={`absolute z-20 ${position}`}>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.82 }}
        animate={
          reduceMotion
            ? { opacity: 1, scale: 1 }
            : { opacity: 1, scale: 1, y: [0, -10, 0] }
        }
        transition={
          reduceMotion
            ? { duration: 0.45, delay: 0.2 + delay }
            : {
                opacity: { duration: 0.5, delay: 0.25 + delay },
                scale: { duration: 0.5, delay: 0.25 + delay, type: 'spring', stiffness: 260 },
                y: { duration: 3.2 + delay, repeat: Infinity, ease: 'easeInOut', delay: 0.8 + delay },
              }
        }
      >
        <img src={src} alt="" className={`${size} object-contain drop-shadow-[0_8px_24px_rgba(11,19,84,0.12)]`} />
      </motion.div>
    </div>
  );
}

function CustomerCard({ reduceMotion }) {
  return (
    <div className="absolute left-[2%] top-[48%] z-30 sm:left-[-2%]">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: -24, y: 12 }}
        animate={
          reduceMotion
            ? { opacity: 1, x: 0, y: 0 }
            : { opacity: 1, x: 0, y: [0, -8, 0] }
        }
        transition={
          reduceMotion
            ? { duration: 0.55, delay: 0.45 }
            : {
                opacity: { duration: 0.55, delay: 0.45 },
                x: { duration: 0.55, delay: 0.45 },
                y: { duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 1.1 },
              }
        }
      >
        <div className="w-[min(100%,220px)] rounded-lg border border-[#EEF0F4] bg-white px-4 py-3.5 shadow-[0_16px_40px_rgba(11,19,84,0.12)] sm:w-[240px] sm:px-5 sm:py-4">
          <div className="flex items-start gap-3">
            <img
              src={Images.products.display_pic}
              alt={PRODUCT_HERO_CUSTOMER.name}
              className="h-11 w-11 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#0B1354] sm:text-base">
                {PRODUCT_HERO_CUSTOMER.name}
              </p>
              <span className="mt-1 inline-flex rounded-full bg-[#E8F8EF] px-2.5 py-0.5 text-[10px] font-semibold text-[#1F9D55] sm:text-[11px]">
                {PRODUCT_HERO_CUSTOMER.status}
              </span>
              <p className="mt-1.5 text-[11px] text-[#717171] sm:text-xs">
                {PRODUCT_HERO_CUSTOMER.location}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProductHeroVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <Reveal when="load" variant="fadeRight" delay={0.12} duration={0.65} className="relative w-full">
      <div className="relative mx-auto aspect-square w-full max-w-[min(100%,480px)] lg:max-w-[480px]">
        <div
          className="pointer-events-none absolute inset-[10%] rounded-full border border-dashed border-[#D7DCE8]"
          aria-hidden="true"
        />
        <motion.div
          className="pointer-events-none absolute inset-[10%] rounded-full border border-dashed border-[#E8ECF8]"
          aria-hidden="true"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
        />

        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-[42%] rounded-full bg-[radial-gradient(circle,rgba(58,16,205,0.07)_0%,rgba(58,16,205,0)_72%)]"
          aria-hidden="true"
        />

        <div className="absolute bottom-0 left-1/2 z-10 h-[88%] -translate-x-1/2">
          <motion.img
            src={Images.products.product_hero_img}
            alt="Customer engagement professional"
            initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-auto max-w-none object-contain object-bottom drop-shadow-[0_20px_40px_rgba(11,19,84,0.12)]"
          />
        </div>

        {ORBIT_ICONS.map((icon) => (
          <FloatingIcon key={icon.id} {...icon} reduceMotion={reduceMotion} />
        ))}

        <CustomerCard reduceMotion={reduceMotion} />
      </div>
    </Reveal>
  );
}
