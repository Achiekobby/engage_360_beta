import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useRecipient from '../../../hooks/useRecipient';
import { fetchRecipientGaps, isSessionExpired } from '../../../services/recipient';
import AnimateStep from '../../motion/AnimateStep';
import ModalShell from '../../ui/ModalShell';
import { FLOW_TITLE_ID, StepLoading } from './FlowChrome';
import DetailsStep from './steps/DetailsStep';
import DoneStep from './steps/DoneStep';
import LocationStep from './steps/LocationStep';
import OtpStep from './steps/OtpStep';
import PhoneStep from './steps/PhoneStep';
import WelcomeStep from './steps/WelcomeStep';

/** Which profile form to show next, or the final step when nothing is missing. */
const nextProfileStep = (gaps) => (gaps.needsLocation ? 'location' : gaps.needsDetails ? 'details' : 'done');

function FlowBody({ notice, onClose }) {
  const navigate = useNavigate();
  const { isVerified, phone: verifiedPhone, wallet } = useRecipient();

  const [step, setStep] = useState(isVerified ? 'checking' : 'phone');
  const [phone, setPhone] = useState(verifiedPhone);
  const [otp, setOtp] = useState(null);
  const [gaps, setGaps] = useState(null);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [returning, setReturning] = useState(false);
  const [phoneNotice, setPhoneNotice] = useState(notice);

  // Already verified: skip straight to whatever the profile is still missing.
  useEffect(() => {
    if (step !== 'checking') return undefined;
    let cancelled = false;

    fetchRecipientGaps(verifiedPhone)
      .then((found) => {
        if (cancelled) return;
        setGaps(found);
        setReturning(true);
        setStep(nextProfileStep(found));
      })
      .catch((error) => {
        if (cancelled) return;
        if (isSessionExpired(error)) setPhoneNotice(error.message);
        setStep('phone');
      });

    return () => {
      cancelled = true;
    };
  }, [step, verifiedPhone]);

  const handleCodeSent = useCallback((result) => {
    setPhone(result.phone);
    setOtp(result);
    setPhoneNotice('');
    setStep('otp');
  }, []);

  const handleVerified = useCallback((found) => {
    setGaps(found);
    if (found.count > 0) {
      setStep('welcome');
    } else {
      setReturning(true);
      setStep('done');
    }
  }, []);

  const handleSaved = useCallback((result) => {
    setPointsEarned((total) => total + result.pointsAwarded);
    setGaps(result.gaps);
    setStep(nextProfileStep(result.gaps));
  }, []);

  const handleViewRewards = () => {
    onClose();
    navigate('/rewards');
  };

  let content;
  switch (step) {
    case 'phone':
      content = (
        <PhoneStep notice={phoneNotice} initialValue="" onCodeSent={handleCodeSent} onClose={onClose} />
      );
      break;
    case 'otp':
      content = (
        <OtpStep
          phone={phone}
          cooldownSec={otp.cooldownSec}
          onVerified={handleVerified}
          onChangeNumber={() => setStep('phone')}
          onClose={onClose}
        />
      );
      break;
    case 'welcome':
      content = <WelcomeStep gaps={gaps} onContinue={() => setStep(nextProfileStep(gaps))} onClose={onClose} />;
      break;
    case 'location':
      content = <LocationStep phone={phone} onSaved={handleSaved} onClose={onClose} />;
      break;
    case 'details':
      content = <DetailsStep phone={phone} onSaved={handleSaved} onClose={onClose} />;
      break;
    case 'done':
      content = (
        <DoneStep
          pointsEarned={pointsEarned}
          balance={wallet.balance}
          returning={returning}
          onViewRewards={handleViewRewards}
          onClose={onClose}
        />
      );
      break;
    default:
      content = <StepLoading onClose={onClose} />;
  }

  return (
    <AnimateStep stepKey={step} className="flex min-h-0 flex-1 flex-col">
      {content}
    </AnimateStep>
  );
}

/**
 * Phone → OTP → verified → (location → details, only what's missing) → done.
 * The body mounts fresh every time the modal opens, so no state leaks between sessions.
 */
export default function RewardFlow({ open, onClose, notice = '' }) {
  return (
    <ModalShell open={open} onClose={onClose} labelledBy={FLOW_TITLE_ID} size="md">
      <FlowBody notice={notice} onClose={onClose} />
    </ModalShell>
  );
}
