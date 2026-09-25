import WebinarPlayButton from './WebinarPlayButton';

function WebinarTitleOverlay({ title, featured = false }) {
  return (
    <div
      className={
        featured
          ? 'absolute inset-x-4 top-4 z-[1] flex justify-center sm:inset-x-8 sm:top-6'
          : 'absolute inset-x-3 top-3 z-[1] flex justify-center sm:inset-x-4 sm:top-4'
      }
    >
      <div className="max-w-[92%] rounded-lg bg-black/75 px-4 py-2.5 text-center sm:px-5 sm:py-3">
        <p
          className={
            featured
              ? 'text-sm font-bold leading-snug text-white sm:text-base lg:text-lg'
              : 'text-xs font-bold leading-snug text-white sm:text-sm'
          }
        >
          {title}
        </p>
      </div>
    </div>
  );
}

export default function WebinarVideoCard({ webinar, featured = false, onClick }) {
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={
        featured
          ? 'group relative block w-full cursor-pointer overflow-hidden rounded-2xl text-left'
          : 'group relative block w-full cursor-pointer overflow-hidden rounded-xl text-left'
      }
    >
      <div className={featured ? 'relative aspect-[21/9] min-h-[220px] sm:min-h-[280px]' : 'relative aspect-[16/10]'}>
        <img
          src={webinar.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/35" />

        <WebinarTitleOverlay title={webinar.title} featured={featured} />

        <div className="absolute inset-0 flex items-center justify-center">
          <WebinarPlayButton size={featured ? 'lg' : 'md'} />
        </div>
      </div>
    </Tag>
  );
}
