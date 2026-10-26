import { useMemo, useState } from 'react';
import ActivityHero from '../../components/rewards/activity/ActivityHero';
import ActivityStatCards from '../../components/rewards/activity/ActivityStatCards';
import ActivityTable from '../../components/rewards/activity/ActivityTable';
import TrendChart from '../../components/rewards/activity/TrendChart';
import useRecipient from '../../hooks/useRecipient';
import { getEarningRows, getMonthlySeries, getRedemptionRows } from '../../services/recipient';

const EARNED_COLORS = ['#3A10CD', '#B9A8F5'];
const REDEEMED_COLORS = ['#17A36B', '#A8E3C8'];

export default function RewardsActivityPage() {
  const { recipient, wallet, now } = useRecipient();
  const currentYear = new Date(now).getFullYear();
  const [earnedYear, setEarnedYear] = useState(currentYear);
  const [redeemedYear, setRedeemedYear] = useState(currentYear);
  const years = useMemo(() => [currentYear, currentYear - 1], [currentYear]);

  const earningRows = useMemo(() => getEarningRows(recipient, now), [recipient, now]);
  const redemptionRows = useMemo(() => getRedemptionRows(recipient, now), [recipient, now]);

  const earnedSeries = useMemo(
    () => ({
      current: getMonthlySeries(recipient, earnedYear, now).earned,
      previous: getMonthlySeries(recipient, earnedYear - 1, now).earned,
    }),
    [recipient, earnedYear, now],
  );
  const redeemedSeries = useMemo(
    () => ({
      current: getMonthlySeries(recipient, redeemedYear, now).redeemed,
      previous: getMonthlySeries(recipient, redeemedYear - 1, now).redeemed,
    }),
    [recipient, redeemedYear, now],
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <ActivityHero />
      <ActivityStatCards wallet={wallet} />

      <div className="grid gap-5 lg:grid-cols-2">
        <ActivityTable
          id="earning-activity"
          title="Points Earning Activity"
          dateLabel="Completed"
          rows={earningRows}
          statuses={['Earned', 'Pending']}
          pointsPrefix="+"
          emptyMessage="No points earned yet. Engage with a campaign to start earning."
        />
        <ActivityTable
          id="redeemed-activity"
          title="Points Redeemed Activity"
          dateLabel="Redeemed"
          rows={redemptionRows}
          statuses={['Completed', 'Processing']}
          pointsPrefix="−"
          emptyMessage="Nothing redeemed yet. Head to the Rewards Shop to use your points."
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <TrendChart
          id="earned-trend"
          title="Points earned trend"
          subtitle="Points earned each month, year over year"
          year={earnedYear}
          years={years}
          onYearChange={setEarnedYear}
          current={earnedSeries.current}
          previous={earnedSeries.previous}
          colors={EARNED_COLORS}
        />
        <TrendChart
          id="redeemed-trend"
          title="Points redeemed trend"
          subtitle="Points redeemed each month, year over year"
          year={redeemedYear}
          years={years}
          onYearChange={setRedeemedYear}
          current={redeemedSeries.current}
          previous={redeemedSeries.previous}
          colors={REDEEMED_COLORS}
        />
      </div>
    </div>
  );
}
