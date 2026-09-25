import Images from '../../utils/Images';

export const DASHBOARD_GREETING = {
  title: 'What Do You Want to Do Today?',
  emoji: '👋',
};

export const PLATFORM_SERVICES = [
  {
    id: 'customer-management',
    title: 'Customer Management',
    description: 'Centralize customer records',
    imageKey: 'customer_engagement',
    path: '/customer-engagement/dashboard',
  },
  {
    id: 'campaigns',
    title: 'Campaigns',
    description: 'Run targeted outreach campaigns',
    imageKey: 'campaigns',
    path: '/campaigns',
  },
  {
    id: 'survey',
    title: 'Survey',
    description: 'Collect feedback across channels!',
    imageKey: 'surveys',
    path: '/product/survey',
  },
  {
    id: 'growth-center',
    title: 'Growth Center',
    description: 'Ads promotion & Talent Sourcing',
    imageKey: 'growth_center',
    path: '/ads-hub',
  },
  {
    id: 'front-desk',
    title: 'Front Desk Management',
    description: 'Digitize visitor management',
    imageKey: 'front_desk_management',
    path: '/product/front-desk-management',
  },
  {
    id: 'communication',
    title: 'Communication',
    description: 'Centralize official business calls',
    imageKey: 'communication',
    path: '/product/communication',
  },
  {
    id: 'appointment',
    title: 'Appointment & Schedule',
    description: 'Manage bookings and reminders',
    imageKey: 'appointment_and_schedule',
    path: '/product/appointment-schedule',
  },
  {
    id: 'mail-courier',
    title: 'Mail & Courier Management',
    description: 'Simple one-way cover for road travel',
    imageKey: 'mail_and_courier_management',
    path: '/product/mail-courier-management',
  },
  {
    id: 'task-management',
    title: 'Task Management',
    description: 'Track project, task, and timelines',
    imageKey: 'task_management',
    path: '/product/task-management',
  },
  {
    id: 'sales-management',
    title: 'Sales Management',
    description: 'Track deals, revenue, and pipelines',
    imageKey: 'sales_management',
    path: '/product/sales-management',
  },
  {
    id: 'leads-management',
    title: 'Leads Management',
    description: 'Capture, organize, and convert prospects',
    imageKey: 'leads_management',
    path: '/product/leads-management',
  },
  {
    id: 'document-management',
    title: 'Document Management',
    description: 'Store, organize, and manage files securely',
    imageKey: 'document_management',
    path: '/product/document-management',
  },
];

export function getServiceImage(imageKey) {
  return Images.platform_services[imageKey];
}
