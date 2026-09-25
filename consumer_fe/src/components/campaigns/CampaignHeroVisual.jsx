import { motion, useReducedMotion } from 'framer-motion';
import Images from '../../utils/Images';
import { Reveal } from '../motion';
import { CAMPAIGN_NOTIFICATIONS, CAMPAIGN_PETCOM } from './campaignHeroData';

function FloatingAsset({ src, alt, className, delay = 0, reduceMotion, size, rotate = 0 }) {
  return (
    <div className={`absolute z-20 ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.85, y: 16, rotate }}
        animate={
          reduceMotion
            ? { opacity: 1, scale: 1, y: 0, rotate }
            : { opacity: 1, scale: 1, y: [0, -12, 0], rotate }
        }
        transition={
          reduceMotion
            ? { duration: 0.55, delay: 0.2 + delay }
            : {
                opacity: { duration: 0.55, delay: 0.2 + delay },
                scale: { duration: 0.55, delay: 0.2 + delay, type: 'spring', stiffness: 240 },
                y: {
                  duration: 3.4 + delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.9 + delay,
                },
              }
        }
        className={`h-auto object-contain drop-shadow-[0_16px_32px_rgba(11,19,84,0.18)] ${size}`}
      />
    </div>
  );
}

function CampaignListCard({ reduceMotion }) {
  return (
    <div className="absolute bottom-[8%] left-[4%] z-30 w-[38%] min-w-[190px] max-w-[260px]">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: -20, y: 12 }}
        animate={
          reduceMotion
            ? { opacity: 1, x: 0, y: 0 }
            : { opacity: 1, x: 0, y: [0, -8, 0] }
        }
        transition={
          reduceMotion
            ? { duration: 0.55, delay: 0.35 }
            : {
                opacity: { duration: 0.55, delay: 0.35 },
                x: { duration: 0.55, delay: 0.35 },
                y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 },
              }
        }
        className="w-full rounded-lg border border-[#EEF0F4] bg-white p-3 shadow-[0_16px_40px_rgba(11,19,84,0.14)] sm:p-4"
      >
        <div className="space-y-3">
          {CAMPAIGN_NOTIFICATIONS.map(({ id, name, message, avatarImageKey }) => (
            <div key={id} className="flex items-start gap-2.5">
              <img
                src={Images.hero[avatarImageKey]}
                alt={name}
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-[#0B1354] sm:text-[13px]">{name}</p>
                <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-[#717171] sm:text-[11px]">
                  {message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function PetcomCard({ reduceMotion }) {
  return (
    <div className="absolute right-[2%] top-[39%] z-30 w-[34%] min-w-[170px] max-w-[230px]">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: 20, y: 8 }}
        animate={
          reduceMotion
            ? { opacity: 1, x: 0, y: 0 }
            : { opacity: 1, x: 0, y: [0, -10, 0] }
        }
        transition={
          reduceMotion
            ? { duration: 0.55, delay: 0.45 }
            : {
                opacity: { duration: 0.55, delay: 0.45 },
                x: { duration: 0.55, delay: 0.45 },
                y: { duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.3 },
              }
        }
        className="w-full rounded-lg border border-[#EEF0F4] bg-white p-3 shadow-[0_16px_40px_rgba(11,19,84,0.14)]"
      >
        <div className="flex items-start gap-2.5">
          <img
            src={Images.campaigns.petcom}
            alt=""
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-[#0B1354] sm:text-[13px]">
              {CAMPAIGN_PETCOM.name}
            </p>
            <p className="mt-0.5 text-[10px] leading-snug text-[#717171] sm:text-[11px]">
              {CAMPAIGN_PETCOM.message}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function CampaignHeroVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <Reveal when="load" variant="fadeRight" delay={0.12} duration={0.65} className="relative w-full">
      <div className="relative mx-auto aspect-[817/642] w-full max-w-[min(100%,600px)] lg:max-w-none">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-[20%] top-[5%] h-[73%] w-[60%] rounded-full bg-[#1E4FD9] shadow-[0_24px_60px_rgba(30,79,217,0.35)]"
          aria-hidden="true"
        />

        <div className="absolute bottom-0 left-1/2 z-10 h-[97%] -translate-x-1/2">
          <motion.img
            src={Images.campaigns.person}
            alt="Campaign manager ready to launch multi-channel outreach"
            initial={reduceMotion ? false : { opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-auto max-w-none object-contain object-bottom drop-shadow-[0_20px_40px_rgba(11,19,84,0.2)]"
          />
        </div>

        <FloatingAsset
          src={Images.campaigns.envelope}
          alt=""
          className="left-[2%] top-[2%]"
          size="w-[34%]"
          delay={0}
          rotate={-10}
          reduceMotion={reduceMotion}
        />

        <FloatingAsset
          src={Images.campaigns.bullhorn}
          alt=""
          className="bottom-[-16%] left-[36%]"
          size="w-[42%]"
          delay={0.2}
          rotate={0}
          reduceMotion={reduceMotion}
        />

        <CampaignListCard reduceMotion={reduceMotion} />
        <PetcomCard reduceMotion={reduceMotion} />
      </div>
    </Reveal>
  );
}
