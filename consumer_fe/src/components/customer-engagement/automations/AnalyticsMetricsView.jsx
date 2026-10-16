import AnalyticsMetricCard from './AnalyticsMetricCard';
import { ANALYTICS_METRIC_SECTIONS } from './analyticsData';

export default function AnalyticsMetricsView() {
  return (
    <div className="space-y-8 sm:space-y-10">
      {ANALYTICS_METRIC_SECTIONS.map((section) => (
        <section key={section.id}>
          <div>
            <h2 className="text-lg font-bold text-primary sm:text-xl">{section.title}</h2>
            <div className="mt-2 h-px w-full bg-[#5B5F3B]/35" aria-hidden="true" />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {section.metrics.map((metric) => (
              <AnalyticsMetricCard
                key={metric.id}
                label={metric.label}
                value={metric.value}
                tone={metric.tone}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
