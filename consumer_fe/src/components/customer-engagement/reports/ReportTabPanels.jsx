import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Activity,
  Award,
  BarChart3,
  Database,
  Gift,
  MessageSquare,
  PieChart,
  Radio,
  RefreshCw,
  Users,
  Wallet,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Reveal, StaggerItem, StaggerReveal } from '../../motion';
import MetricCard from '../dashboard/MetricCard';
import AnniversaryInsightsSection from '../automations/AnniversaryInsightsSection';
import BirthdayInsightsSection from '../automations/BirthdayInsightsSection';
import HolidayInsightsSection from '../automations/HolidayInsightsSection';
import WelcomeInsightsSection from '../automations/WelcomeInsightsSection';
import ReportSectionHeader from './ReportSectionHeader';
import {
  ReportBarChart,
  ReportDonutChart,
  ReportGroupedBarChart,
  ReportPieChart,
  ReportRateDonut,
  ReportStatCard,
} from './ReportCharts';
import {
  AVERAGE_AGE_DONUT,
  BY_CATEGORY,
  BY_SEGMENT,
  BY_SUB_CATEGORY,
  CHURN_RATE,
  CHURN_STATUS,
  CONTACTABILITY_TOTAL,
  CUSTOMER_HEALTH_METRICS,
  DATA_QUALITY_DUPLICATES,
  DATA_QUALITY_INVALID_EMAIL,
  DATA_QUALITY_INVALID_PHONE,
  DATA_QUALITY_MISSING,
  DEMOGRAPHICS_BY_AGE,
  DEMOGRAPHICS_BY_GENDER,
  DEMOGRAPHICS_BY_LOCATION,
  DEMOGRAPHICS_BY_REGION,
  GENDER_SEMI_DONUT,
  INACTIVE_CUSTOMERS_TOTAL,
  MONTH_LABELS,
  RETENTION_RATE,
  SEGMENT_GROWTH_DATASETS,
  SEGMENT_GROWTH_YEARS,
  VALID_INVALID_EMAIL,
  VALID_INVALID_PHONE,
  scaleTrendData,
} from './reportsAnalyticsData';

const TAB_ICONS = {
  customer: Activity,
  demographics: PieChart,
  'category-segment': BarChart3,
  contactability: Radio,
  'data-quality': Database,
  distribution: Users,
  'churn-retention': RefreshCw,
  automations: Gift,
};

function CustomerReportTab() {
  const dominantAge = [...AVERAGE_AGE_DONUT].sort((a, b) => b.value - a.value)[0];

  return (
    <div className="space-y-6">
      <ReportSectionHeader
        icon={TAB_ICONS.customer}
        title="Overall Data Health"
        subtitle="High-level view of customer volume, activity, and growth trends"
      />

      <StaggerReveal
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
        stagger={0.05}
      >
        {CUSTOMER_HEALTH_METRICS.map((metric) => (
          <StaggerItem key={metric.id}>
            <MetricCard {...metric} />
          </StaggerItem>
        ))}
      </StaggerReveal>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ReportDonutChart
          title="Gender Distribution"
          items={GENDER_SEMI_DONUT}
          semi
          centerValue="70%"
          centerLabel="Male"
        />
        <ReportDonutChart
          title="Average Age"
          items={AVERAGE_AGE_DONUT}
          centerValue={dominantAge.label}
          centerLabel="Top Group"
        />
      </div>

      <ReportBarChart
        title="Customers Distribution Trends"
        labels={MONTH_LABELS}
        data={scaleTrendData()}
        description="Monthly customer distribution across your active collections"
      />
    </div>
  );
}

function DemographicsReportTab() {
  return (
    <div className="space-y-6">
      <ReportSectionHeader
        icon={TAB_ICONS.demographics}
        title="Demographic Overview"
        subtitle="Breakdown of customers by region, location, gender, and age"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ReportPieChart title="Customers by Region" items={DEMOGRAPHICS_BY_REGION} />
        <ReportPieChart title="Customers by Location (City/Town)" items={DEMOGRAPHICS_BY_LOCATION} />
        <ReportPieChart title="Customers by Gender" items={DEMOGRAPHICS_BY_GENDER} />
        <ReportPieChart title="Customers by Age Group" items={DEMOGRAPHICS_BY_AGE} />
      </div>
    </div>
  );
}

function CategorySegmentReportTab() {
  return (
    <div className="space-y-6">
      <ReportSectionHeader
        icon={TAB_ICONS['category-segment']}
        title="Category & Segment"
        subtitle="How customers are grouped by category, sub-category, and segment"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ReportPieChart title="Customers by Category" items={BY_CATEGORY} />
        <ReportPieChart title="Customers by Sub-Category" items={BY_SUB_CATEGORY} />
      </div>

      <ReportPieChart title="Customers by Customer Segment" items={BY_SEGMENT} />

      <ReportGroupedBarChart
        title="Segment Growth Over Time"
        labels={SEGMENT_GROWTH_YEARS}
        datasets={SEGMENT_GROWTH_DATASETS}
      />
    </div>
  );
}

function ContactabilityReportTab() {
  return (
    <div className="space-y-6">
      <ReportSectionHeader
        icon={TAB_ICONS.contactability}
        title="Contactability & Reachability"
        subtitle="Phone and email validity plus campaign readiness over time"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ReportDonutChart
          title="Customers with valid & invalid number"
          items={VALID_INVALID_PHONE}
          centerValue={CONTACTABILITY_TOTAL.toLocaleString()}
          centerLabel="Total"
          showCountLegend
        />
        <ReportDonutChart
          title="Customers with valid & invalid Email"
          items={VALID_INVALID_EMAIL}
          centerValue={CONTACTABILITY_TOTAL.toLocaleString()}
          centerLabel="Total"
          showCountLegend
        />
      </div>

      <ReportBarChart
        title="Customers Ready for Campaign"
        labels={MONTH_LABELS}
        data={scaleTrendData(0.9)}
        total={CONTACTABILITY_TOTAL}
      />
    </div>
  );
}

function DataQualityReportTab() {
  return (
    <div className="space-y-6">
      <ReportSectionHeader
        icon={TAB_ICONS['data-quality']}
        title="Data Quality"
        subtitle="Profile completeness, duplicates, and invalid contact details"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ReportDonutChart
          title="Profiles with Missing Fields"
          items={DATA_QUALITY_MISSING}
          centerValue="5,715"
          centerLabel="Total"
          showCountLegend
        />
        <ReportDonutChart
          title="Duplicate Customers Detected"
          items={DATA_QUALITY_DUPLICATES}
          centerValue="4,225"
          centerLabel="Total"
          showCountLegend
        />
        <ReportDonutChart
          title="Invalid Phone Numbers"
          items={DATA_QUALITY_INVALID_PHONE}
          centerValue="5,725"
          centerLabel="Total"
          showCountLegend
        />
        <ReportDonutChart
          title="Invalid Emails Address"
          items={DATA_QUALITY_INVALID_EMAIL}
          centerValue="5,225"
          centerLabel="Total"
          showCountLegend
        />
      </div>

      <ReportBarChart
        title="Profile Completion Rate"
        labels={MONTH_LABELS}
        data={scaleTrendData(0.75)}
        description="Average percentage of profile completion across customer records"
      />
    </div>
  );
}

function DistributionReportTab() {
  const charts = [
    { title: 'Region Growth Trends', multiplier: 1 },
    { title: 'Location Growth Trends', multiplier: 0.85 },
    { title: 'Age Group Growth Trends', multiplier: 0.7 },
    { title: 'Gender Growth Trends', multiplier: 0.95 },
  ];

  return (
    <div className="space-y-6">
      <ReportSectionHeader
        icon={TAB_ICONS.distribution}
        title="Customer Distribution"
        subtitle="Analysis of how customers are spread and growing across key dimensions"
      />

      <div className="space-y-4">
        {charts.map(({ title, multiplier }) => (
          <ReportBarChart
            key={title}
            title={title}
            labels={MONTH_LABELS}
            data={scaleTrendData(multiplier)}
          />
        ))}
      </div>
    </div>
  );
}

function ChurnRetentionReportTab() {
  return (
    <div className="space-y-6">
      <ReportSectionHeader
        icon={TAB_ICONS['churn-retention']}
        title="Churn & Retention"
        subtitle="Active, at-risk, and churned customers with retention metrics"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ReportPieChart
          title="Active vs At-risk vs Churn Customers"
          items={CHURN_STATUS}
        />
        <ReportRateDonut title="Retention Rate" rate={20} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ReportRateDonut title="Churn Rate" rate={28} />
        <ReportStatCard
          title="Inactive Customers"
          value={INACTIVE_CUSTOMERS_TOTAL}
        />
      </div>
    </div>
  );
}

const AUTOMATION_REPORT_KINDS = [
  { id: 'birthday', label: 'Birthday', icon: Gift },
  { id: 'welcome', label: 'Welcome Message', icon: MessageSquare },
  { id: 'anniversary', label: 'Customer Anniversary', icon: Award },
  { id: 'holidays', label: 'Holiday & Festive Seasons', icon: Wallet },
];

const AUTOMATION_REPORT_COPY = {
  birthday: {
    title: 'Birthday Automation Reports',
    subtitle: 'Birthday automation overview and engagement & conversions performance',
  },
  welcome: {
    title: 'Welcome Message Reports',
    subtitle: 'Welcome message overview and engagement & conversions performance',
  },
  anniversary: {
    title: 'Customer Anniversary Reports',
    subtitle: 'Anniversary overview and engagement & conversions performance',
  },
  holidays: {
    title: 'Holiday & Festive Seasons Reports',
    subtitle: 'Holiday & festive season overview and engagement & conversions performance',
  },
};

const AUTOMATION_REPORT_PANELS = {
  birthday: BirthdayInsightsSection,
  welcome: WelcomeInsightsSection,
  anniversary: AnniversaryInsightsSection,
  holidays: HolidayInsightsSection,
};

function AutomationsReportTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const kindFromUrl = searchParams.get('kind');
  const [activeKind, setActiveKind] = useState(
    AUTOMATION_REPORT_PANELS[kindFromUrl] ? kindFromUrl : 'birthday',
  );

  useEffect(() => {
    if (AUTOMATION_REPORT_PANELS[kindFromUrl]) {
      setActiveKind(kindFromUrl);
    }
  }, [kindFromUrl]);

  const handleKindChange = (kindId) => {
    setActiveKind(kindId);
    const next = new URLSearchParams(searchParams);
    next.set('tab', 'automations');
    next.set('kind', kindId);
    next.delete('page');
    setSearchParams(next, { replace: true });
  };

  const copy = AUTOMATION_REPORT_COPY[activeKind] || AUTOMATION_REPORT_COPY.birthday;
  const KindIcon =
    AUTOMATION_REPORT_KINDS.find((kind) => kind.id === activeKind)?.icon || Gift;
  const InsightsPanel = AUTOMATION_REPORT_PANELS[activeKind] || BirthdayInsightsSection;

  return (
    <div className="space-y-6">
      <ReportSectionHeader
        icon={KindIcon}
        title={copy.title}
        subtitle={copy.subtitle}
      />

      <div className="flex flex-wrap gap-2">
        {AUTOMATION_REPORT_KINDS.map((kind) => {
          const active = activeKind === kind.id;
          const Icon = kind.icon;
          return (
            <button
              key={kind.id}
              type="button"
              onClick={() => handleKindChange(kind.id)}
              className={clsx(
                'inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                active
                  ? 'border-primary bg-primary text-white'
                  : 'border-[#E4E4E7] bg-white text-[#717171] hover:border-primary/30 hover:text-[#0B1354]',
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2.25} />
              {kind.label}
            </button>
          );
        })}
      </div>

      <InsightsPanel />
    </div>
  );
}

const TAB_PANELS = {
  customer: CustomerReportTab,
  demographics: DemographicsReportTab,
  'category-segment': CategorySegmentReportTab,
  contactability: ContactabilityReportTab,
  'data-quality': DataQualityReportTab,
  distribution: DistributionReportTab,
  'churn-retention': ChurnRetentionReportTab,
  automations: AutomationsReportTab,
};

export default function ReportTabPanels({ activeTab }) {
  const Panel = TAB_PANELS[activeTab] || CustomerReportTab;

  return (
    <Reveal variant="fadeUp" amount={0.12} key={activeTab}>
      <Panel />
    </Reveal>
  );
}
