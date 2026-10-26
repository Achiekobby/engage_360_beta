import { Navigate, Outlet } from 'react-router-dom';
import useRecipient from '../../hooks/useRecipient';

/**
 * Rewards are only for a verified recipient. Without a live session (never verified,
 * switched number, or idle timeout) we send them to the offer page, which reopens
 * the verification flow.
 */
export default function RecipientGuard() {
  const { isVerified } = useRecipient();

  if (!isVerified) {
    return (
      <Navigate
        to="/offer"
        replace
        state={{ openRewards: true, notice: 'Verify your number to view your rewards.' }}
      />
    );
  }

  return <Outlet />;
}
