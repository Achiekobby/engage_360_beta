import NotificationsSystem, {
  atalhoTheme,
  dismissNotification,
} from 'reapop';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export default function NotificationsHost() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications);

  return (
    <NotificationsSystem
      notifications={notifications}
      dismissNotification={(id) => dispatch(dismissNotification(id))}
      theme={atalhoTheme}
    />
  );
}
