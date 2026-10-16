import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { StaggerItem, StaggerReveal } from '../motion';
import AcademyCourseCard from './AcademyCourseCard';
import AcademySectionHeader from './AcademySectionHeader';
import { ACADEMY_COURSES_HEADER, getCoursesByPath } from './academyData';

export default function AcademyCoursesSection({ activePath }) {
  const reduceMotion = useReducedMotion();
  const courses = getCoursesByPath(activePath);

  return (
    <section>
      <AcademySectionHeader
        title={ACADEMY_COURSES_HEADER.title}
        subtitle={ACADEMY_COURSES_HEADER.subtitle}
      />

      <div className="mt-8 sm:mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePath}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {courses.length ? (
              <StaggerReveal
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8"
                stagger={0.08}
              >
                {courses.map((course) => (
                  <StaggerItem key={course.id}>
                    <AcademyCourseCard course={course} />
                  </StaggerItem>
                ))}
              </StaggerReveal>
            ) : (
              <div className="rounded-xl border border-[#E4E4E7] bg-white px-5 py-12 text-center">
                <p className="text-sm text-[#717171]">No courses found for this path yet.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
