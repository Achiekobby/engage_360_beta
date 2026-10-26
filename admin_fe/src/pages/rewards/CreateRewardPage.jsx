import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Coins, ImagePlus, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { PageHeading } from '../../components/layout/PageBackLink';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addReward } from '../../store/slices/rewardsSlice';
import { publishReward } from '../../services/publishedRewards';
import {
  POINTS_PER_CEDI,
  TELCO_NETWORKS,
  amountFromHeadline,
  buildReward,
  networkById,
  networkFromTitle,
  pointsFromInput,
} from '../../constants/rewards';

const CATEGORIES = [{ id: 'airtime', label: 'Airtime' }];
const MAX_IMAGE_BYTES = 1_000_000;

const fieldClass =
  'h-11 w-full rounded-xl border border-[#E4E4E7] bg-white px-3.5 text-sm text-[#0B1354] outline-none transition-colors placeholder:text-[#A1A1AA] focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20';

function FieldError({ id, active, message }) {
  if (!active) return null;
  return (
    <p id={id} className="mt-1.5 text-xs font-medium text-[#B91C1C]">
      {message}
    </p>
  );
}

export default function CreateRewardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const rewards = useAppSelector((state) => state.rewards.items);
  const existingIds = useMemo(() => new Set(rewards.map((reward) => reward.id)), [rewards]);
  const summaryRef = useRef(null);

  const [title, setTitle] = useState('');
  const [headline, setHeadline] = useState('');
  const [category, setCategory] = useState('airtime');
  const [points, setPoints] = useState('');
  const [pointsTouched, setPointsTouched] = useState(false);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState(null);
  const [publishing, setPublishing] = useState(false);

  const network = networkFromTitle(title);
  const amount = amountFromHeadline(headline);
  const telco = networkById(network);
  const preview = uploaded ? image : image || telco?.image || '';
  const parsedPoints = pointsFromInput(points);
  const showPoints = Number.isInteger(parsedPoints) && parsedPoints > 0;

  const suggestedPoints = useMemo(() => {
    if (!Number.isFinite(amount) || amount <= 0) return '';
    return String(Math.round(amount * POINTS_PER_CEDI));
  }, [amount]);

  useEffect(() => {
    if (error) summaryRef.current?.focus();
  }, [error]);

  const fail = (field, message) => {
    setError({ field, message });
  };

  const clearField = (field) => {
    setError((current) => (current?.field === field ? null : current));
  };

  const onTitle = (value) => {
    clearField('title');
    setTitle(value);
    if (uploaded) return;
    setImage(networkById(networkFromTitle(value))?.image || '');
  };

  const onHeadline = (value) => {
    clearField('headline');
    setHeadline(value);
    if (pointsTouched) return;
    const nextAmount = amountFromHeadline(value);
    setPoints(Number.isFinite(nextAmount) && nextAmount > 0 ? String(Math.round(nextAmount * POINTS_PER_CEDI)) : '');
  };

  const onImage = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      fail('image', 'Upload a PNG, JPG, or WebP image.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      fail('image', 'Use an image under 1 MB so it can be shown on the recipient shop.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUploaded(true);
      setImage(String(reader.result || ''));
      clearField('image');
    };
    reader.readAsDataURL(file);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (publishing) return;

    if (!title.trim()) {
      fail('title', 'Enter the first title, including the network, for example MTN Airtime.');
      return;
    }
    if (!network) {
      fail('title', 'Name the network in the first title: MTN, Telecel, or AT.');
      return;
    }
    if (!headline.trim() || !Number.isFinite(amount) || amount <= 0 || amount > 500) {
      fail('headline', 'Enter the airtime value in the second title, for example GHS 15 Airtime.');
      return;
    }
    if (category !== 'airtime') {
      fail('category', 'Only airtime can be claimed on the recipient shop right now.');
      return;
    }
    if (!Number.isInteger(parsedPoints) || parsedPoints <= 0) {
      fail('points', 'Enter the points as a whole number, for example 750.');
      return;
    }
    if (!description.trim()) {
      fail('description', 'Add a short description recipients will see on the card.');
      return;
    }
    if (!preview) {
      fail('image', 'Upload an image for this reward.');
      return;
    }

    const reward = buildReward({
      network,
      amountGhs: amount,
      points: parsedPoints,
      description,
      title,
      headline,
      image: preview,
      category,
      published: true,
      createdAt: new Date().toISOString(),
    });

    if (existingIds.has(reward.id)) {
      fail('headline', `${reward.networkLabel} ${reward.headline} is already in the catalog.`);
      return;
    }

    setPublishing(true);
    try {
      await publishReward(reward);
      dispatch(addReward(reward));
      navigate('/rewards');
    } catch (publishError) {
      fail('form', publishError.message || 'The recipient shop could not be updated.');
      setPublishing(false);
    }
  };

  const invalid = (field) => error?.field === field;

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <PageHeading
        title="New reward"
        description="Publish airtime recipients can claim from their rewards shop."
        backTo="/rewards"
        backLabel="Rewards"
      />

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20.5rem]">
        <form onSubmit={submit} className="admin-card overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white" noValidate>
          {error ? (
            <div
              ref={summaryRef}
              tabIndex={-1}
              role="alert"
              className="mx-5 mt-5 flex gap-3 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C] outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C]/30 sm:mx-8"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.25} aria-hidden="true" />
              <p>{error.message}</p>
            </div>
          ) : null}

          <div className="grid gap-x-6 gap-y-5 px-5 py-6 sm:px-8 sm:py-8 sm:grid-cols-2">
            <div>
              <label htmlFor="reward-title" className="mb-2 block text-sm font-semibold text-[#0B1354]">
                1st Title
              </label>
              <input
                id="reward-title"
                value={title}
                onChange={(event) => onTitle(event.target.value)}
                placeholder="MTN Airtime"
                aria-invalid={invalid('title')}
                aria-describedby={invalid('title') ? 'reward-title-error' : 'reward-title-hint'}
                className={clsx(fieldClass, invalid('title') && 'border-[#FECACA] focus-visible:border-[#B91C1C] focus-visible:ring-[#B91C1C]/20')}
                autoComplete="off"
              />
              <FieldError id="reward-title-error" active={invalid('title')} message={error?.message} />
              {invalid('title') ? null : (
                <p id="reward-title-hint" className="mt-1.5 text-xs text-[#717171]">
                  Include the network: MTN, Telecel, or AT.
                </p>
              )}
              <div className="mt-2.5 flex flex-wrap gap-1.5" aria-hidden="true">
                {TELCO_NETWORKS.map((item) => {
                  const selected = item.id === network;
                  return (
                    <span
                      key={item.id}
                      className={clsx(
                        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors',
                        selected ? 'bg-primary text-white' : 'bg-[#F4F6FA] text-[#717171]',
                      )}
                    >
                      {item.label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="reward-headline" className="mb-2 block text-sm font-semibold text-[#0B1354]">
                2nd Title
              </label>
              <input
                id="reward-headline"
                value={headline}
                onChange={(event) => onHeadline(event.target.value)}
                placeholder="GHS 10 Airtime"
                aria-invalid={invalid('headline')}
                aria-describedby={invalid('headline') ? 'reward-headline-error' : 'reward-headline-hint'}
                className={clsx(fieldClass, invalid('headline') && 'border-[#FECACA] focus-visible:border-[#B91C1C] focus-visible:ring-[#B91C1C]/20')}
                autoComplete="off"
              />
              <FieldError id="reward-headline-error" active={invalid('headline')} message={error?.message} />
              {invalid('headline') ? null : (
                <p id="reward-headline-hint" className="mt-1.5 text-xs text-[#717171]">
                  Include the cedis amount, for example GHS 10 Airtime.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="reward-category" className="mb-2 block text-sm font-semibold text-[#0B1354]">
                Category
              </label>
              <select
                id="reward-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                aria-invalid={invalid('category')}
                className={fieldClass}
              >
                {CATEGORIES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="reward-points" className="mb-2 block text-sm font-semibold text-[#0B1354]">
                Approximate Point
              </label>
              <div className="relative">
                <input
                  id="reward-points"
                  inputMode="numeric"
                  value={points}
                  onChange={(event) => {
                    setPointsTouched(true);
                    clearField('points');
                    setPoints(event.target.value.replace(/[^\d]/g, ''));
                  }}
                  placeholder={suggestedPoints || '500'}
                  aria-invalid={invalid('points')}
                  aria-describedby={invalid('points') ? 'reward-points-error' : 'reward-points-hint'}
                  className={clsx(
                    fieldClass,
                    'pr-12 tabular-nums',
                    invalid('points') && 'border-[#FECACA] focus-visible:border-[#B91C1C] focus-visible:ring-[#B91C1C]/20',
                  )}
                />
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-[#A1A1AA]">
                  pts
                </span>
              </div>
              <FieldError id="reward-points-error" active={invalid('points')} message={error?.message} />
              {invalid('points') ? null : (
                <p id="reward-points-hint" className="mt-1.5 text-xs text-[#717171]">
                  Suggested at {POINTS_PER_CEDI} points per cedi. You can change it.
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="reward-description" className="mb-2 block text-sm font-semibold text-[#0B1354]">
                Brief description
              </label>
              <textarea
                id="reward-description"
                value={description}
                onChange={(event) => {
                  clearField('description');
                  setDescription(event.target.value);
                }}
                placeholder="Top up your mobile balance"
                rows={3}
                aria-invalid={invalid('description')}
                aria-describedby={invalid('description') ? 'reward-description-error' : undefined}
                className={clsx(
                  fieldClass,
                  'h-auto resize-y py-3 leading-relaxed',
                  invalid('description') && 'border-[#FECACA] focus-visible:border-[#B91C1C] focus-visible:ring-[#B91C1C]/20',
                )}
              />
              <FieldError id="reward-description-error" active={invalid('description')} message={error?.message} />
            </div>
          </div>

          <div className="border-t border-[#F4F5F8] px-5 py-6 sm:px-8">
            <p className="text-sm font-semibold text-[#0B1354]">Upload image</p>
            <p id="reward-image-hint" className="mt-1 text-xs text-[#717171]">
              PNG, JPG, or WebP, under 1 MB. A known network uses its logo until you upload artwork.
            </p>
            <label
              htmlFor="reward-image"
              className="group mt-4 block max-w-sm cursor-pointer rounded-2xl focus-within:outline-none"
            >
              {preview ? (
                <span className="relative block overflow-hidden rounded-2xl border border-[#E6E8F0] bg-[#F4F5F8]">
                  <img
                    src={preview}
                    alt={telco ? `${telco.label} artwork` : 'Reward artwork'}
                    className="h-44 w-full object-cover motion-safe:transition motion-safe:duration-300 motion-safe:group-hover:scale-[1.02]"
                  />
                  <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-[#0B1354]/70 to-transparent px-3.5 pb-3 pt-10 text-xs font-semibold text-white">
                    <span>{uploaded ? 'Custom artwork' : `${telco?.label || 'Network'} logo`}</span>
                    <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur-sm">Change image</span>
                  </span>
                </span>
              ) : (
                <span className="flex h-44 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#D4D4D8] bg-[#FAFBFD] text-sm text-[#717171] transition-colors group-hover:border-primary/40 group-hover:bg-[#F8FAFF]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-[0_1px_2px_rgba(11,19,84,0.06)]">
                    <ImagePlus className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  Choose an image
                </span>
              )}
              <input
                id="reward-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                aria-describedby={invalid('image') ? 'reward-image-error' : 'reward-image-hint'}
                className="sr-only"
                onChange={onImage}
              />
            </label>
            <FieldError id="reward-image-error" active={invalid('image')} message={error?.message} />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[#F4F5F8] bg-[#FAFBFD] px-5 py-5 sm:flex-row sm:items-center sm:justify-end sm:px-8">
            <Link
              to="/rewards"
              className="inline-flex h-11 min-w-32 cursor-pointer items-center justify-center rounded-xl border border-[#E4E4E7] bg-white px-6 text-sm font-semibold text-[#0B1354] transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              Back
            </Link>
            <button
              type="submit"
              disabled={publishing}
              className="inline-flex h-11 min-w-36 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(37,99,235,0.22)] transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-wait disabled:opacity-70"
            >
              {publishing ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              {publishing ? 'Publishing…' : 'Publish'}
            </button>
          </div>
        </form>

        <aside className="admin-card overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white lg:sticky lg:top-6">
          <div className="border-b border-[#F4F5F8] px-5 py-4">
            <p className="text-sm font-semibold text-[#0B1354]">Shop preview</p>
            <p className="mt-0.5 text-xs text-[#717171]">This is the card recipients will claim.</p>
          </div>
          <div className="p-4">
            <article className="overflow-hidden rounded-2xl border border-[#E6E8F0] bg-white">
              <div className="relative aspect-[16/10] bg-[#F4F5F8]">
                {preview ? (
                  <img src={preview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[#A1A1AA]">Artwork</div>
                )}
                {Number.isFinite(amount) && amount > 0 ? (
                  <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#0B1354] shadow-[0_4px_12px_rgba(11,19,84,0.12)]">
                    GHS {amount}
                  </span>
                ) : null}
              </div>
              <div className="bg-[#F4F6FA] px-4 py-3.5">
                <h2 className="text-sm font-semibold text-[#0B1354]">{title.trim() || '1st title'}</h2>
                <p className="mt-1 text-sm font-bold text-[#0B1354]">{headline.trim() || '2nd title'}</p>
                <p className="mt-0.5 text-sm text-[#717171]">{description.trim() || 'Brief description'}</p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-base font-bold text-[#0B1354]">
                  <Coins className="h-4 w-4 text-primary" strokeWidth={2.25} aria-hidden="true" />
                  {showPoints ? `${parsedPoints.toLocaleString()} pts` : 'Points'}
                </p>
              </div>
            </article>
          </div>
        </aside>
      </div>
    </div>
  );
}
