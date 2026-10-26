import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Filter, Plus, RefreshCw, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setRewardStatus } from '../../store/slices/rewardsSlice';
import { publishReward } from '../../services/publishedRewards';
import RewardCard from '../../components/rewards/RewardCard';
import RewardStatusModal from '../../components/rewards/RewardStatusModal';
import RewardsFilterDrawer, {
  REWARD_FILTER_DEFAULTS,
  countActiveRewardFilters,
} from '../../components/rewards/RewardsFilterDrawer';

export default function RewardsPage() {
  const dispatch = useAppDispatch();
  const rewards = useAppSelector((state) => state.rewards.items);
  const redemptions = useAppSelector((state) => state.rewards.redemptions || []);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(REWARD_FILTER_DEFAULTS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pendingDeactivate, setPendingDeactivate] = useState(null);
  const [notice, setNotice] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const redemptionCounts = useMemo(() => {
    const counts = {};
    redemptions.forEach((row) => {
      counts[row.rewardId] = (counts[row.rewardId] || 0) + 1;
    });
    return counts;
  }, [redemptions]);
  const activeFilters = countActiveRewardFilters(filters);
  const hasSearchOrFilters = Boolean(query.trim()) || activeFilters > 0;

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rewards.filter((reward) => {
      if (filters.networks.length && !filters.networks.includes(reward.network)) return false;
      if (filters.statuses.length && !filters.statuses.includes(reward.status)) return false;
      if (filters.amounts.length && !filters.amounts.includes(String(reward.amountGhs))) return false;
      if (!needle) return true;
      return [reward.title, reward.headline, reward.networkLabel, reward.description, String(reward.points)]
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [filters, query, rewards]);

  const resetView = () => {
    setQuery('');
    setFilters(REWARD_FILTER_DEFAULTS);
  };

  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 500);
    resetView();
  };

  const syncPublished = async (reward, status) => {
    if (!reward.published) return true;
    try {
      await publishReward({ ...reward, status });
      setNotice('');
      return true;
    } catch (syncError) {
      setNotice(syncError.message || 'The recipient shop could not be updated.');
      return false;
    }
  };

  const toggleStatus = async (reward) => {
    if (reward.status === 'active') {
      setPendingDeactivate(reward);
      return;
    }
    if (await syncPublished(reward, 'active')) {
      dispatch(setRewardStatus({ id: reward.id, status: 'active' }));
    }
  };

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-medium text-[#717171]">Manage all rewards created</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/rewards/activity"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-primary bg-white px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-[#EFF6FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <Activity className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
            Activity
          </Link>
          <Link
            to="/rewards/new"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(37,99,235,0.22)] transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <Plus className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
            Create Reward
          </Link>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#EEF0F4] bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <div className="relative w-full sm:max-w-md">
          <label htmlFor="reward-search" className="sr-only">
            Search rewards
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]" />
          <input
            id="reward-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="w-full rounded-lg border border-[#E4E4E7] bg-white py-2.5 pl-10 pr-3 text-sm text-[#0B1354] outline-none transition-colors placeholder:text-[#A1A1AA] focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <div className="flex shrink-0 items-center justify-end gap-1">
          <button
            type="button"
            onClick={refresh}
            aria-label="Refresh rewards"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#52525B] transition-colors hover:bg-[#EFF6FF] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <RefreshCw className={clsx('h-4 w-4', refreshing && 'animate-spin')} />
          </button>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-[#52525B] transition-colors hover:bg-[#EFF6FF] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFilters > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-white">
                {activeFilters}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {notice ? (
        <p role="alert" className="mt-4 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
          {notice}
        </p>
      ) : null}

      <div className="mt-5">
        {visible.length ? (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((reward) => (
              <li key={reward.id}>
                <RewardCard
                  reward={reward}
                  redemptions={redemptionCounts[reward.id] || 0}
                  onToggleStatus={toggleStatus}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E4E4E7] bg-white px-6 py-16 text-center">
            <h2 className="text-base font-semibold text-[#0B1354]">No matching rewards</h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-[#717171]">
              Nothing matches the current search or filters. Try a network name, such as MTN, or an amount such as GHS 10.
            </p>
            {hasSearchOrFilters ? (
              <button
                type="button"
                onClick={resetView}
                className="mt-5 cursor-pointer text-sm font-semibold text-primary hover:text-primary/80"
              >
                Clear search and filters
              </button>
            ) : null}
          </div>
        )}
      </div>

      <RewardsFilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onApply={setFilters}
      />
      <RewardStatusModal
        reward={pendingDeactivate}
        onClose={() => setPendingDeactivate(null)}
        onConfirm={async () => {
          const reward = pendingDeactivate;
          setPendingDeactivate(null);
          if (await syncPublished(reward, 'inactive')) {
            dispatch(setRewardStatus({ id: reward.id, status: 'inactive' }));
          }
        }}
      />
    </div>
  );
}
