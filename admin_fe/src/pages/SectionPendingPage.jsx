import { PageHeading } from '../components/layout/PageBackLink';

export default function SectionPendingPage({ title }) {
  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <PageHeading
        title={title}
        description="This section is not set up yet. Business Management is ready to use."
      />
    </div>
  );
}
