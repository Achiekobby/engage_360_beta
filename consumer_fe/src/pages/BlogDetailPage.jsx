import { Navigate, useParams } from 'react-router-dom';
import SiteFooter from '../components/layout/SiteFooter';
import {
  getBlogPost,
  getPopularPosts,
  getRelatedPosts,
} from '../components/blogs/blogData';
import {
  BlogDetailContent,
  BlogDetailHeader,
  BlogDetailHeroImage,
  BlogPopularPosts,
  BlogRelatedArticles,
} from '../components/blogs/BlogDetailSections';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const post = getBlogPost(slug);

  if (!post) {
    return <Navigate to="/blogs" replace />;
  }

  const popularPosts = getPopularPosts(post.id);
  const relatedPosts = getRelatedPosts(post);

  return (
    <div className="min-h-screen w-full bg-white font-sans text-foreground">
      <main className="mx-auto w-full max-w-8xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <BlogDetailHeader post={post} />
        <BlogDetailHeroImage post={post} />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
          <BlogDetailContent post={post} />
          <BlogPopularPosts posts={popularPosts} />
        </div>

        <BlogRelatedArticles posts={relatedPosts} />
      </main>
      <SiteFooter />
    </div>
  );
}
