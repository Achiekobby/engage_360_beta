import { Navigate } from 'react-router-dom';
import { CAMPAIGNS_BASE } from '../../components/campaigns-module/campaignsData';

/** Legacy route — template selection now lives under create flow. */
export default function CampaignTemplatesPage() {
  return <Navigate to={`${CAMPAIGNS_BASE}/create/templates`} replace />;
}
