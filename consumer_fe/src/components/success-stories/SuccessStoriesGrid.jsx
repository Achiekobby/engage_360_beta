import { StaggerItem, StaggerReveal } from '../motion';
import SuccessStoryCard from './SuccessStoryCard';

export default function SuccessStoriesGrid({ stories }) {
  return (
    <StaggerReveal
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:gap-8"
      stagger={0.08}
    >
      {stories.map((story) => (
        <StaggerItem key={story.id}>
          <SuccessStoryCard story={story} />
        </StaggerItem>
      ))}
    </StaggerReveal>
  );
}
