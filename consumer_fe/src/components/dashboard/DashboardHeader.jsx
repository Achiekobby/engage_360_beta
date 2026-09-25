import { Reveal } from '../motion';
import { DASHBOARD_GREETING } from './platformServicesData';

export default function DashboardHeader() {
  return (
    <Reveal variant="fadeUp" amount={0.2}>
      <div className="border-b-2 border-[#14B8A6] pb-5 sm:pb-6">
        <h1 className="text-2xl font-bold text-[#0B1354] sm:text-3xl lg:text-[2rem]">
          {DASHBOARD_GREETING.title}{' '}
          <span aria-hidden="true">{DASHBOARD_GREETING.emoji}</span>
        </h1>
      </div>
    </Reveal>
  );
}
