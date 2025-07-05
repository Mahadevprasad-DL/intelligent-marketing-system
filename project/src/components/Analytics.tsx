import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import { BarChart3, TrendingUp, Users, DollarSign, Filter, Calendar } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const Analytics: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('7days');
  const [campaignFilter, setCampaignFilter] = useState('all');
  const [userData, setUserData] = useState<any[]>([]);
  const [selectedDataPoint, setSelectedDataPoint] = useState<any>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    conversionRate: 0,
    activeCampaigns: 0,
    customerLifetimeValue: 0
  });

  useEffect(() => {
    // Load user data from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    setUserData(users);
    
    // Calculate metrics based on user data
    calculateMetrics(users);
  }, [timeFilter, campaignFilter]);

  const calculateMetrics = (users: any[]) => {
    const filteredUsers = filterUsersByTime(users);
    
    // Calculate revenue based on budget ranges
    const revenue = filteredUsers.reduce((total, user) => {
      const budget = user.estimatedBudget || '₹10k–₹50k';
      const budgetValue = getBudgetValue(budget);
      return total + budgetValue;
    }, 0);

    // Calculate conversion rate
    const customers = filteredUsers.filter(u => 
      u.userType === 'Customer' || u.userType === 'Loyal Customer'
    ).length;
    const conversionRate = filteredUsers.length > 0 ? (customers / filteredUsers.length) * 100 : 0;

    // Count active campaigns
    const activeCampaigns = new Set(filteredUsers.map(u => u.campaign).filter(Boolean)).size;

    // Calculate CLV
    const clv = revenue > 0 ? revenue / Math.max(customers, 1) : 0;

    setMetrics({
      totalRevenue: revenue,
      conversionRate: Math.round(conversionRate * 10) / 10,
      activeCampaigns,
      customerLifetimeValue: Math.round(clv)
    });
  };

  const getBudgetValue = (budget: string) => {
    switch (budget) {
      case '< ₹10k': return 5000;
      case '₹10k-₹50k': return 30000;
      case '₹50k-₹1L': return 75000;
      case '₹1L-₹5L': return 300000;
      case '₹5L+': return 750000;
      default: return 30000;
    }
  };

  const filterUsersByTime = (users: any[]) => {
    const now = new Date();
    const timeRanges = {
      '7days': 7,
      '30days': 30,
      '90days': 90,
      '12months': 365
    };
    
    const days = timeRanges[timeFilter as keyof typeof timeRanges] || 7;
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return users.filter(user => {
      if (campaignFilter !== 'all' && user.campaign !== campaignFilter) {
        return false;
      }
      // For demo purposes, assume all users are within the time range
      return true;
    });
  };

  const getFilteredData = () => {
    return filterUsersByTime(userData);
  };

  const filteredData = getFilteredData();

  // Industry Performance Data based on actual user data
  const industryData = filteredData.reduce((acc, user) => {
    const industry = user.industry || 'Others';
    acc[industry] = (acc[industry] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const industryPerformanceData = {
    labels: Object.keys(industryData),
    datasets: [{
      label: 'User Count',
      data: Object.values(industryData),
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
      borderWidth: 2,
      borderColor: 'white'
    }]
  };

  // Lead Source ROI Data based on actual user data
  const leadSourceData = filteredData.reduce((acc, user) => {
    const source = user.leadSource || 'Website';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const leadSourceROIData = {
    labels: Object.keys(leadSourceData),
    datasets: [{
      label: 'Lead Count',
      data: Object.values(leadSourceData),
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
    }]
  };

  // Budget vs Performance based on actual user data
  const budgetData = filteredData.reduce((acc, user) => {
    const budget = user.estimatedBudget || '₹10k–₹50k';
    acc[budget] = (acc[budget] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const budgetPerformanceData = {
    labels: Object.keys(budgetData),
    datasets: [{
      label: 'User Count',
      data: Object.values(budgetData),
      backgroundColor: 'rgba(16, 185, 129, 0.6)',
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 2,
    }]
  };

  // User Type Distribution
  const userTypeData = filteredData.reduce((acc, user) => {
    const type = user.userType || 'New User';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const userTypeDistributionData = {
    labels: Object.keys(userTypeData),
    datasets: [{
      label: 'User Distribution',
      data: Object.values(userTypeData),
      backgroundColor: [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
        '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
      ],
      borderWidth: 2,
      borderColor: 'white'
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const dataIndex = elements[0].index;
        const chartData = event.chart.data;
        const label = chartData.labels[dataIndex];
        
        // Get users for this data point
        const usersForDataPoint = filteredData.filter(user => {
          return user.industry === label || user.leadSource === label || 
                 user.estimatedBudget === label || user.userType === label;
        });
        
        setSelectedDataPoint({
          label,
          users: usersForDataPoint
        });
        setShowUserDetails(true);
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const dataIndex = elements[0].index;
        const chartData = event.chart.data;
        const label = chartData.labels[dataIndex];
        
        // Get users for this data point
        const usersForDataPoint = filteredData.filter(user => {
          return user.industry === label || user.userType === label;
        });
        
        setSelectedDataPoint({
          label,
          users: usersForDataPoint
        });
        setShowUserDetails(true);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)}k`;
    }
    return `₹${amount}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Main Content with Left Sidebar Spacing */}
      <div className="lg:pl-80">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive insights based on your customer data and marketing performance</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border mb-8">
            <div className="flex items-center mb-4">
              <Filter className="w-5 h-5 mr-2 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Analytics Filters</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="12months">Last 12 Months</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Type</label>
                <select
                  value={campaignFilter}
                  onChange={(e) => setCampaignFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Campaigns</option>
                  <option value="Spring Collection">Spring Collection</option>
                  <option value="Back to School">Back to School</option>
                  <option value="Product Launch">Product Launch</option>
                  <option value="Holiday Promo">Holiday Promo</option>
                  <option value="Summer Sale 2024">Summer Sale 2024</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Export Report
                </button>
              </div>
            </div>
          </div>

          {/* Key Metrics - Live Data */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalRevenue)}</p>
              <p className="text-sm text-green-600">Based on user budgets</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Conversion Rate</h3>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{metrics.conversionRate}%</p>
              <p className="text-sm text-blue-600">Customer conversion</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Active Campaigns</h3>
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{metrics.activeCampaigns}</p>
              <p className="text-sm text-purple-600">Unique campaigns</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Customer Lifetime Value</h3>
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.customerLifetimeValue)}</p>
              <p className="text-sm text-orange-600">Average CLV</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Industry Performance */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Industry Distribution (Click to see users)</h3>
              <div className="h-80">
                <Doughnut data={industryPerformanceData} options={doughnutOptions} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Total Industries</p>
                  <p className="font-semibold text-blue-600">{Object.keys(industryData).length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Most Popular</p>
                  <p className="font-semibold text-green-600">
                    {Object.keys(industryData).reduce((a, b) => industryData[a] > industryData[b] ? a : b, 'N/A')}
                  </p>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p><strong>Insight:</strong> Industry distribution shows market penetration across different sectors. Focus marketing efforts on underrepresented industries for growth opportunities.</p>
              </div>
            </div>

            {/* Lead Source Performance */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Source Performance (Click to see users)</h3>
              <div className="h-80">
                <Line data={leadSourceROIData} options={chartOptions} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Top Source</p>
                  <p className="font-semibold text-green-600">
                    {Object.keys(leadSourceData).reduce((a, b) => leadSourceData[a] > leadSourceData[b] ? a : b, 'N/A')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Sources</p>
                  <p className="font-semibold text-blue-600">{Object.keys(leadSourceData).length}</p>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p><strong>Insight:</strong> Lead source analysis reveals which channels are most effective. Allocate more budget to high-performing sources and optimize underperforming ones.</p>
              </div>
            </div>
          </div>

          {/* User Type Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Journey Stage Analysis (Click to see users)</h3>
            <div className="h-80">
              <Bar data={userTypeDistributionData} options={chartOptions} />
            </div>
            <div className="mt-4 grid md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="font-semibold text-blue-600">{filteredData.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Customers</p>
                <p className="font-semibold text-green-600">
                  {filteredData.filter(u => u.userType?.includes('Customer')).length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Leads</p>
                <p className="font-semibold text-purple-600">
                  {filteredData.filter(u => u.userType?.includes('Lead')).length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Prospects</p>
                <p className="font-semibold text-orange-600">
                  {filteredData.filter(u => u.userType === 'Prospect').length}
                </p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Insight:</strong> Customer journey analysis shows the distribution of users across different stages. Focus on converting leads to customers and nurturing prospects through the funnel.</p>
            </div>
          </div>

          {/* Budget Analysis */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Segment Analysis (Click to see users)</h3>
            <div className="h-80">
              <Bar data={budgetPerformanceData} options={chartOptions} />
            </div>
            <div className="mt-4 grid md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-sm text-gray-600">Avg Budget</p>
                <p className="font-semibold text-green-600">{formatCurrency(metrics.totalRevenue / Math.max(filteredData.length, 1))}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">High Value</p>
                <p className="font-semibold text-blue-600">
                  {filteredData.filter(u => u.estimatedBudget === '₹1L–₹5L' || u.estimatedBudget === '₹5L+').length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Budget Segments</p>
                <p className="font-semibold text-purple-600">{Object.keys(budgetData).length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="font-semibold text-orange-600">{formatCurrency(metrics.totalRevenue)}</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Insight:</strong> Budget analysis reveals customer spending patterns. Target high-value segments with premium offerings while maintaining volume in mid-tier segments.</p>
            </div>
          </div>

          {/* User Details Modal */}
          {showUserDetails && selectedDataPoint && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Users in "{selectedDataPoint.label}"
                  </h3>
                  <button
                    onClick={() => setShowUserDetails(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid gap-4">
                  {selectedDataPoint.users.map((user: any, index: number) => (
                    <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=random&color=fff&size=40`}
                        alt={user.fullName}
                        className="w-12 h-12 rounded-full mr-4 border-2 border-gray-200"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{user.fullName}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {user.userType}
                          </span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {user.estimatedBudget}
                          </span>
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            {user.industry}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedDataPoint.users.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No users found for this data point.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Performance Summary */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Key Insights from Your Data</h3>
              <ul className="space-y-2 text-blue-100">
                <li>• {filteredData.length} total users in selected timeframe</li>
                <li>• {metrics.conversionRate}% conversion rate to customers</li>
                <li>• {Object.keys(industryData).length} different industries represented</li>
                <li>• {formatCurrency(metrics.customerLifetimeValue)} average customer lifetime value</li>
                <li>• {metrics.activeCampaigns} unique marketing campaigns active</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Data-Driven Recommendations</h3>
              <ul className="space-y-2 text-green-100">
                <li>• Focus on converting {filteredData.filter(u => u.userType?.includes('Lead')).length} leads to customers</li>
                <li>• Expand marketing in underrepresented industries</li>
                <li>• Optimize top-performing lead sources</li>
                <li>• Develop premium packages for high-budget segments</li>
                <li>• Implement retention strategies for existing customers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;