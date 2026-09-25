import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { StaggerItem, StaggerReveal } from '../motion';
import BlogCard from './BlogCard';

export default function BlogGrid({ posts }) {
  const reduceMotion = useReducedMotion();

  if (!posts.length) {
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-[#E4E4E7] bg-white px-5 py-12 text-center"
      >
        <p className="text-sm text-[#717171]">No blog posts found. Try a different search or category.</p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={posts.map((post) => post.id).join('-')}
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <StaggerReveal
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:gap-8"
          stagger={0.08}
        >
          {posts.map((post) => (
            <StaggerItem key={post.id}>
              <BlogCard post={post} />
            </StaggerItem>
          ))}
        </StaggerReveal>
      </motion.div>
    </AnimatePresence>
  );
}
