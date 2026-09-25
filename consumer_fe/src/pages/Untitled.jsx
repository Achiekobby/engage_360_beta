import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// --- HELPER SUB-COMPONENTS ---

const FilterDropdown = ({
  isOpen,
  onClose,
  title,
  options,
  selectedOption,
  onSelect,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-56 rounded-lg bg-card border border-border shadow-lg z-50 py-1 text-sm text-foreground"
    >
      <div className="px-3 py-2 border-b border-border font-semibold text-xs text-muted-foreground uppercase tracking-wider">
        Select {title}
      </div>
      <div className="max-h-60 overflow-y-auto">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => {
              onSelect(option);
              onClose();
            }}
            className={`w-full text-left px-4 py-2 hover:bg-accent transition-colors flex items-center justify-between ${
              selectedOption === option ? 'font-semibold text-primary' : ''
            }`}
          >
            {option}
            {selectedOption === option && (
              <Icon icon="lucide:check" className="w-4 h-4 text-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const TrendChartCard = ({
  title,
  description,
  labels,
  data,
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: '#1D53E6',
        borderRadius: 0,
        barPercentage: 0.72,
        categoryPercentage: 0.8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#111111',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 10,
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#555555',
          font: {
            size: 12,
            family: 'Onest, sans-serif',
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 250,
        ticks: {
          stepSize: 50,
          color: '#555555',
          font: {
            size: 12,
            family: 'Onest, sans-serif',
          },
        },
        grid: {
          color: 'rgba(17,17,17,0.08)',
          borderDash: [3, 4],
        },
      },
    },
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm overflow-hidden">
      <div className="mb-4">
        <h2 className="text-[2rem] leading-tight font-heading font-semibold text-foreground">
          {title}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="h-72 overflow-hidden relative">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const Untitled = () => {
  // State Variables
  const [activeTab, setActiveTab] = useState('Customer Distribution');
  const [selectedDateFilter, setSelectedDateFilter] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Dropdown Open States
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isCollectionDropdownOpen, setIsCollectionDropdownOpen] = useState(false);

  // Mock Data for Charts
  const chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct'];
  
  // Base chart data
  const baseData = [230, 130, 95, 80, 100, 150, 82, 180, 148, 230];

  // Dynamic data generation based on filters to simulate interactivity
  const getFilteredData = (multiplier) => {
    let factor = 1;
    if (selectedDateFilter === 'Last 30 Days') factor = 0.6;
    if (selectedDateFilter === 'Last 6 Months') factor = 0.8;
    if (selectedCategory === 'Enterprise') factor *= 1.2;
    if (selectedCategory === 'SMB') factor *= 0.7;
    if (selectedCollection === 'Winter 2024') factor *= 0.9;

    return baseData.map((val) => Math.min(250, Math.max(10, Math.round(val * factor * multiplier))));
  };

  // Filter Options
  const dateOptions = ['All Time', 'Last 30 Days', 'Last 6 Months', 'This Year'];
  const categoryOptions = ['All Categories', 'Enterprise', 'SMB', 'Individual', 'Partner'];
  const collectionOptions = ['All Collections', 'Spring 2024', 'Summer 2024', 'Winter 2024'];

  // Notification Mock Data
  const notifications = [
    { id: 1, text: 'New customer spike detected in Region East', time: '5m ago' },
    { id: 2, text: 'Monthly distribution report is ready', time: '2h ago' },
    { id: 3, text: 'Database sync completed successfully', time: '1d ago' },
  ];

  return (
    <div className="min-h-screen w-full bg-background flex flex-col relative font-sans text-foreground">
      
      {/* HEADER */}
      <header className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-7 h-7 rounded-md bg-card flex items-center justify-center">
              <div className="w-4 h-4 rounded-sm bg-primary flex items-center justify-center">
                <Icon icon="lucide:swirl" className="text-xs text-primary-foreground" />
              </div>
            </div>
          </div>
          <nav className="flex items-center gap-8 text-sm">
            <a href="#home" className="opacity-90 hover:opacity-100 transition-opacity">Home</a>
            <a href="#dashboard" className="opacity-90 hover:opacity-100 transition-opacity">Dashboard</a>
            <a href="#customers" className="opacity-90 hover:opacity-100 transition-opacity">Customers</a>
            <a href="#report" className="font-semibold">Report</a>
          </nav>
          <div className="flex items-center gap-5 text-lg relative">
            {/* Notification Trigger */}
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative focus:outline-none hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Icon icon="lucide:bell" className="text-base" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-400"></span>
            </button>

            {/* Notification Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-6 top-8 w-80 bg-card border border-border rounded-lg shadow-lg z-50 py-2 text-foreground text-sm">
                <div className="px-4 py-2 border-b border-border font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Notifications
                </div>
                <div className="divide-y divide-border">
                  {notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 hover:bg-accent transition-colors">
                      <p className="text-xs font-medium">{n.text}</p>
                      <span className="text-[10px] text-muted-foreground mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Icon icon="lucide:user" className="text-base cursor-pointer hover:opacity-80 transition-opacity" />
          </div>
        </div>
      </header>

      {/* SUB-HEADER */}
      <div className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-12 flex items-center gap-7 text-xs text-muted-foreground whitespace-nowrap overflow-x-auto scrollbar-none">
            {[
              'Customers',
              'Demographic',
              'Category & Segment',
              'Contactability & Reachability',
              'Data Quality',
              'Customer Distribution',
              'Churn & Retention',
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`transition-colors focus:outline-none cursor-pointer ${
                  activeTab === tab
                    ? 'text-sky-500 font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-5 py-6">
          
          {/* TITLE & FILTER BAR */}
          <section className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                  <Icon icon="lucide:pie-chart" className="text-sm text-primary" />
                </div>
                <h1 className="text-2xl font-heading font-bold text-foreground">
                  {activeTab}
                </h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Analysis of how customers are spread and growing across key dimensions
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-3 pt-1 relative flex-wrap">
              
              {/* Date Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsDateDropdownOpen(!isDateDropdownOpen);
                    setIsCategoryDropdownOpen(false);
                    setIsCollectionDropdownOpen(false);
                  }}
                  className={`h-11 px-5 rounded-lg border text-sm bg-card shadow-sm flex items-center gap-2 transition-all cursor-pointer ${
                    selectedDateFilter ? 'border-sky-500 text-sky-600 font-medium' : 'border-sky-400 text-foreground'
                  }`}
                >
                  <span>{selectedDateFilter || 'Date Filter'}</span>
                  <Icon icon="lucide:chevron-down" className="w-4 h-4" />
                </button>
                <FilterDropdown
                  isOpen={isDateDropdownOpen}
                  onClose={() => setIsDateDropdownOpen(false)}
                  title="Date Range"
                  options={dateOptions}
                  selectedOption={selectedDateFilter}
                  onSelect={(val) => setSelectedDateFilter(val === 'All Time' ? null : val)}
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                    setIsDateDropdownOpen(false);
                    setIsCollectionDropdownOpen(false);
                  }}
                  className={`h-11 px-5 rounded-lg border text-sm bg-card flex items-center gap-2 transition-all cursor-pointer ${
                    selectedCategory ? 'border-primary text-primary font-medium' : 'border-border text-foreground'
                  }`}
                >
                  <span>{selectedCategory || 'Category'}</span>
                  <Icon icon="lucide:chevron-down" className="w-4 h-4" />
                </button>
                <FilterDropdown
                  isOpen={isCategoryDropdownOpen}
                  onClose={() => setIsCategoryDropdownOpen(false)}
                  title="Category"
                  options={categoryOptions}
                  selectedOption={selectedCategory}
                  onSelect={(val) => setSelectedCategory(val === 'All Categories' ? null : val)}
                />
              </div>

              {/* Collection Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsCollectionDropdownOpen(!isCollectionDropdownOpen);
                    setIsDateDropdownOpen(false);
                    setIsCategoryDropdownOpen(false);
                  }}
                  className={`h-11 px-5 rounded-lg border text-sm bg-card flex items-center gap-2 transition-all cursor-pointer ${
                    selectedCollection ? 'border-primary text-primary font-medium' : 'border-border text-foreground'
                  }`}
                >
                  <span>{selectedCollection || 'Collection'}</span>
                  <Icon icon="lucide:chevron-down" className="w-4 h-4" />
                </button>
                <FilterDropdown
                  isOpen={isCollectionDropdownOpen}
                  onClose={() => setIsCollectionDropdownOpen(false)}
                  title="Collection"
                  options={collectionOptions}
                  selectedOption={selectedCollection}
                  onSelect={(val) => setSelectedCollection(val === 'All Collections' ? null : val)}
                />
              </div>

              {/* Clear Filters Button */}
              {(selectedDateFilter || selectedCategory || selectedCollection) && (
                <button
                  onClick={() => {
                    setSelectedDateFilter(null);
                    setSelectedCategory(null);
                    setSelectedCollection(null);
                  }}
                  className="h-11 px-4 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Icon icon="lucide:x" className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </section>

          {/* CHARTS SECTION */}
          <section className="space-y-8">
            <TrendChartCard
              title="Region Growth Trends"
              description="Customer growth patterns across regions over time"
              labels={chartLabels}
              data={getFilteredData(1.0)}
            />
            <TrendChartCard
              title="Location Growth Trends"
              description="Expansion trends across cities and towns"
              labels={chartLabels}
              data={getFilteredData(0.85)}
            />
            <TrendChartCard
              title="Age Group Growth Trends"
              description="Changes in customer age distribution over time"
              labels={chartLabels}
              data={getFilteredData(0.7)}
            />
            <TrendChartCard
              title="Gender Growth Trends"
              description="Trends in gender composition over time"
              labels={chartLabels}
              data={getFilteredData(0.95)}
            />
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-10 bg-background relative overflow-hidden border-t border-border">
        <div className="max-w-7xl mx-auto px-8 pt-16 pb-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-lg bg-accent border border-border flex items-center justify-center">
                <div className="w-8 h-8 rounded-md bg-tertiary flex items-center justify-center">
                  <Icon icon="lucide:swirl" className="text-lg text-primary-foreground" />
                </div>
              </div>
              <div className="text-sm font-semibold text-tertiary">ENGAGE 360</div>
              <p className="text-foreground leading-7 max-w-[180px]">
                Everything You Need<br />to Engage and Grow
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-heading font-semibold mb-4">Support</h3>
              <div className="space-y-3 text-foreground">
                <p className="hover:text-primary cursor-pointer transition-colors">Help Center</p>
                <p className="hover:text-primary cursor-pointer transition-colors">Privacy &amp; Policy</p>
                <p className="hover:text-primary cursor-pointer transition-colors">Terms of Service</p>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-heading font-semibold mb-4">Company</h3>
              <div className="space-y-3 text-foreground">
                <p className="hover:text-primary cursor-pointer transition-colors">About Us</p>
                <p className="hover:text-primary cursor-pointer transition-colors">Product</p>
                <p className="hover:text-primary cursor-pointer transition-colors">Resources</p>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-heading font-semibold mb-4">Contact</h3>
              <div className="space-y-3 text-foreground">
                <p className="hover:text-primary cursor-pointer transition-colors">Get in touch</p>
                <p className="hover:text-primary cursor-pointer transition-colors">Contact sales</p>
                <p className="hover:text-primary cursor-pointer transition-colors">Become an Agent</p>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-heading font-semibold mb-4 text-primary">Social</h3>
              <div className="flex items-center gap-5 text-xl">
                <Icon icon="lucide:facebook" className="text-foreground hover:text-primary cursor-pointer transition-colors" />
                <Icon icon="lucide:linkedin" className="text-foreground hover:text-primary cursor-pointer transition-colors" />
                <Icon icon="lucide:instagram" className="text-foreground hover:text-primary cursor-pointer transition-colors" />
                <Icon icon="lucide:music-2" className="text-foreground hover:text-primary cursor-pointer transition-colors" />
                <Icon icon="lucide:youtube" className="text-foreground hover:text-primary cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
          <div className="pt-16 text-lg text-foreground">
            @ 2025 Trip Secure. All Right Reserved
          </div>
          <div className="absolute -bottom-36 left-1/2 -translate-x-1/2 w-[420px] h-[210px] rounded-t-full border-[56px] border-primary/10 border-b-0 pointer-events-none"></div>
        </div>
      </footer>
    </div>
  );
};

export default Untitled;
