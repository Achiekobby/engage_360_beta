import { Navigate, useParams } from 'react-router-dom';
import SiteFooter from '../components/layout/SiteFooter';
import {
  getPopularStories,
  getRelatedStories,
  getSuccessStory,
} from '../components/success-stories/successStoriesData';
import {
  SuccessStoryDetailBanner,
  SuccessStoryDetailContent,
  SuccessStoryDetailHeader,
  SuccessStoryPopularPosts,
  SuccessStoryRelated,
} from '../components/success-stories/SuccessStoryDetailSections';

export default function SuccessStoryDetailPage() {
  const { slug } = useParams();
  const story = getSuccessStory(slug);

  if (!story) {
    return <Navigate to="/success-stories" replace />;
  }

  const popularStories = getPopularStories(story.id);
  const relatedStories = getRelatedStories(story);

  return (
    <div className="min-h-screen w-full bg-white font-sans text-foreground">
      <main className="mx-auto w-full max-w-8xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <SuccessStoryDetailHeader story={story} />
        <SuccessStoryDetailBanner story={story} />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
          <SuccessStoryDetailContent story={story} />
          <SuccessStoryPopularPosts stories={popularStories} />
        </div>

        <SuccessStoryRelated stories={relatedStories} companyName={story.companyName} />
      </main>
      <SiteFooter />
    </div>
  );
}
