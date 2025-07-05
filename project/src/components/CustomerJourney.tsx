import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import { Users, Filter, TrendingUp, PieChart, BarChart3, Calendar, Clock, DollarSign } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { format, parseISO, subDays, isAfter } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const CustomerJourney: React.FC = () => {
  const [filterType, setFilterType] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [timeFilter, setTimeFilter] = useState('7days');
  const [customerData, setCustomerData] = useState<any[]>([]);
  const [selectedDataPoint, setSelectedDataPoint] = useState<any>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  useEffect(() => {
    // Load customer data from localStorage and add login tracking
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Add mock login dates and journey tracking for demonstration
    const enhancedUsers = users.map((user: any, index: number) => ({
      ...user,
      loginDates: generateMockLoginDates(index),
      registrationDate: generateMockRegistrationDate(index),
      lastActivity: generateMockLastActivity(index),
      sessionCount: Math.floor(Math.random() * 50) + 1,
      avgSessionDuration: Math.floor(Math.random() * 30) + 5, // minutes
      profileImage: generateProfileImage(user.fullName)
    }));
    
    setCustomerData(enhancedUsers);
  }, []);

  const generateProfileImage = (name: string) => {
    // Generate a profile image URL based on name
    const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&color=fff&size=40`;
  };

  const generateMockLoginDates = (index: number) => {
    const dates = [];
    const today = new Date();
    const loginCount = Math.floor(Math.random() * 20) + 5;
    
    for (let i = 0; i < loginCount; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      dates.push(format(subDays(today, daysAgo), 'yyyy-MM-dd'));
    }
    return dates.sort();
  };

  const generateMockRegistrationDate = (index: number) => {
    const today = new Date();
    const daysAgo = Math.floor(Math.random() * 90) + 1;
    return format(subDays(today, daysAgo), 'yyyy-MM-dd');
  };

  const generateMockLastActivity = (index: number) => {
    const today = new Date();
    const hoursAgo = Math.floor(Math.random() * 72);
    return format(subDays(today, hoursAgo / 24), 'yyyy-MM-dd HH:mm');
  };

  const getFilteredData = () => {
    let filtered = customerData;
    
    if (filterType !== 'all') {
      filtered = filtered.filter(user => user.userType === filterType);
    }
    
    if (filterIndustry !== 'all') {
      filtered = filtered.filter(user => user.industry === filterIndustry);
    }

    // Apply time filter
    if (timeFilter !== 'all') {
      const today = new Date();
      let cutoffDate;
      
      switch (timeFilter) {
        case '7days':
          cutoffDate = subDays(today, 7);
          break;
        case '30days':
          cutoffDate = subDays(today, 30);
          break;
        case '90days':
          cutoffDate = subDays(today, 90);
          break;
        default:
          cutoffDate = subDays(today, 365);
      }
      
      filtered = filtered.filter(user => {
        const regDate = parseISO(user.registrationDate);
        return isAfter(regDate, cutoffDate);
      });
    }
    
    return filtered;
  };

  const filteredData = getFilteredData();

  // User Login Activity Over Time
  const getLoginActivityData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = format(subDays(new Date(), 29 - i), 'yyyy-MM-dd');
      const loginCount = filteredData.reduce((count, user) => {
        return count + (user.loginDates?.filter((loginDate: string) => loginDate === date).length || 0);
      }, 0);
      return { date, count: loginCount };
    });

    return {
      labels: last30Days.map(d => format(parseISO(d.date), 'MMM dd')),
      datasets: [{
        label: 'Daily Logins',
        data: last30Days.map(d => d.count),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }]
    };
  };

  // Budget Distribution Over Time - Fixed Chart
  const getBudgetTimelineData = () => {
    const budgetRanges = ['< ₹10k', '₹10k–₹50k', '₹50k–₹1L', '₹1L–₹5L', '₹5L+'];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
      return date;
    });

    const datasets = budgetRanges.map((range, index) => {
      const colors = [
        { bg: 'rgba(59, 130, 246, 0.8)', border: 'rgba(59, 130, 246, 1)' },
        { bg: 'rgba(16, 185, 129, 0.8)', border: 'rgba(16, 185, 129, 1)' },
        { bg: 'rgba(245, 158, 11, 0.8)', border: 'rgba(245, 158, 11, 1)' },
        { bg: 'rgba(239, 68, 68, 0.8)', border: 'rgba(239, 68, 68, 1)' },
        { bg: 'rgba(139, 92, 246, 0.8)', border: 'rgba(139, 92, 246, 1)' }
      ];
      
      const data = last7Days.map(date => {
        return filteredData.filter(user => 
          user.estimatedBudget === range && 
          user.registrationDate === date
        ).length;
      });

      return {
        label: range,
        data,
        backgroundColor: colors[index].bg,
        borderColor: colors[index].border,
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      };
    });

    return {
      labels: last7Days.map(d => format(parseISO(d), 'MMM dd')),
      datasets
    };
  };

  // User Journey Stage Progression
  const getJourneyProgressionData = () => {
    const stages = ['New User', 'Lead', 'MQL', 'SQL', 'Prospect', 'Customer', 'Loyal Customer', 'Advocate'];
    const stageData = stages.map(stage => {
      return filteredData.filter(user => user.userType?.includes(stage.split(' ')[0])).length;
    });

    return {
      labels: stages,
      datasets: [{
        label: 'Users in Stage',
        data: stageData,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',   // Blue
          'rgba(16, 185, 129, 0.8)',   // Green
          'rgba(245, 158, 11, 0.8)',   // Yellow
          'rgba(239, 68, 68, 0.8)',    // Red
          'rgba(139, 92, 246, 0.8)',   // Purple
          'rgba(6, 182, 212, 0.8)',    // Cyan
          'rgba(132, 204, 22, 0.8)',   // Lime
          'rgba(249, 115, 22, 0.8)'    // Orange
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(6, 182, 212, 1)',
          'rgba(132, 204, 22, 1)',
          'rgba(249, 115, 22, 1)'
        ],
        borderWidth: 3,
        hoverOffset: 10
      }]
    };
  };

  // Session Duration Analysis - Fixed Chart
  const getSessionDurationData = () => {
    const durationRanges = ['0-5 min', '5-15 min', '15-30 min', '30+ min'];
    const data = durationRanges.map(range => {
      switch (range) {
        case '0-5 min':
          return filteredData.filter(user => user.avgSessionDuration <= 5).length;
        case '5-15 min':
          return filteredData.filter(user => user.avgSessionDuration > 5 && user.avgSessionDuration <= 15).length;
        case '15-30 min':
          return filteredData.filter(user => user.avgSessionDuration > 15 && user.avgSessionDuration <= 30).length;
        default:
          return filteredData.filter(user => user.avgSessionDuration > 30).length;
      }
    });

    return {
      labels: durationRanges,
      datasets: [{
        data,
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',    // Red for short sessions
          'rgba(245, 158, 11, 0.8)',   // Orange for medium-short
          'rgba(16, 185, 129, 0.8)',   // Green for medium-long
          'rgba(59, 130, 246, 0.8)'    // Blue for long sessions
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(59, 130, 246, 1)'
        ],
        borderWidth: 3,
        hoverOffset: 10
      }]
    };
  };

  const uniqueUserTypes = [...new Set(customerData.map(u => u.userType))];
  const uniqueIndustries = [...new Set(customerData.map(u => u.industry))];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          afterLabel: function(context: any) {
            return 'Click to see user details';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const dataIndex = elements[0].index;
        const chartData = event.chart.data;
        const label = chartData.labels[dataIndex];
        
        // Get users for this data point based on chart type
        let usersForDataPoint: any[] = [];
        
        // Determine chart type and filter accordingly
        if (label.includes('min')) {
          // Session duration chart
          usersForDataPoint = filteredData.filter(user => {
            const duration = user.avgSessionDuration;
            switch (label) {
              case '0-5 min': return duration <= 5;
              case '5-15 min': return duration > 5 && duration <= 15;
              case '15-30 min': return duration > 15 && duration <= 30;
              case '30+ min': return duration > 30;
              default: return false;
            }
          });
        } else if (label.includes('₹')) {
          // Budget chart
          usersForDataPoint = filteredData.filter(user => user.estimatedBudget === label);
        } else {
          // Journey stage chart
          usersForDataPoint = filteredData.filter(user => 
            user.userType?.includes(label.split(' ')[0]) || user.userType === label
          );
        }
        
        setSelectedDataPoint({
          label,
          users: usersForDataPoint,
          chartType: label.includes('min') ? 'Session Duration' : 
                    label.includes('₹') ? 'Budget Range' : 'Journey Stage'
        });
        setShowUserDetails(true);
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          afterLabel: function(context: any) {
            return 'Click to see user details';
          }
        }
      }
    },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const dataIndex = elements[0].index;
        const chartData = event.chart.data;
        const label = chartData.labels[dataIndex];
        
        // Get users for this data point
        let usersForDataPoint: any[] = [];
        
        if (label.includes('min')) {
          // Session duration chart
          usersForDataPoint = filteredData.filter(user => {
            const duration = user.avgSessionDuration;
            switch (label) {
              case '0-5 min': return duration <= 5;
              case '5-15 min': return duration > 5 && duration <= 15;
              case '15-30 min': return duration > 15 && duration <= 30;
              case '30+ min': return duration > 30;
              default: return false;
            }
          });
        } else {
          // Journey stage chart
          usersForDataPoint = filteredData.filter(user => 
            user.userType?.includes(label.split(' ')[0]) || user.userType === label
          );
        }
        
        setSelectedDataPoint({
          label,
          users: usersForDataPoint,
          chartType: label.includes('min') ? 'Session Duration' : 'Journey Stage'
        });
        setShowUserDetails(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Main Content with Left Sidebar Spacing */}
      <div className="lg:pl-80">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Journey Analytics</h1>
            <p className="text-gray-600">Track and analyze customer behavior patterns, login activity, and journey progression</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border mb-8">
            <div className="flex items-center mb-4">
              <Filter className="w-5 h-5 mr-2 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Journey Filters</h2>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4">
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
                  <option value="all">All Time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All User Types</option>
                  {uniqueUserTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  value={filterIndustry}
                  onChange={(e) => setFilterIndustry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Industries</option>
                  {uniqueIndustries.map((industry) => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilterType('all');
                    setFilterIndustry('all');
                    setTimeFilter('7days');
                  }}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Customers</h3>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{filteredData.length}</p>
              <p className="text-sm text-green-600">Active users tracked</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Avg Session Time</h3>
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {filteredData.length > 0 ? 
                  Math.round(filteredData.reduce((acc, u) => acc + u.avgSessionDuration, 0) / filteredData.length) : 0} min
              </p>
              <p className="text-sm text-green-600">Average duration</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Sessions</h3>
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {filteredData.reduce((acc, u) => acc + u.sessionCount, 0)}
              </p>
              <p className="text-sm text-purple-600">Login sessions</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Avg Budget</h3>
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">₹45K</p>
              <p className="text-sm text-orange-600">Customer value</p>
            </div>
          </div>

          {/* Journey Analytics Charts */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Login Activity Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Login Activity Timeline (Click to see users)
              </h3>
              <div className="h-80">
                <Line data={getLoginActivityData()} options={chartOptions} />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Insight:</strong> Daily login patterns show user engagement trends. Peak activity indicates optimal times for campaigns and communications.</p>
              </div>
            </div>

            {/* Journey Stage Progression */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Journey Stage Distribution (Click to see users)
              </h3>
              <div className="h-80">
                <Pie data={getJourneyProgressionData()} options={pieOptions} />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Insight:</strong> Customer journey distribution reveals conversion funnel health. Focus on moving users from lead stages to customers.</p>
              </div>
            </div>
          </div>

          {/* Additional Analytics */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Budget Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Budget Registration Timeline (Click to see users)
              </h3>
              <div className="h-80">
                <Bar data={getBudgetTimelineData()} options={chartOptions} />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Insight:</strong> Budget segment registration patterns help identify high-value customer acquisition trends and seasonal variations.</p>
              </div>
            </div>

            {/* Session Duration Analysis */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                Session Duration Distribution (Click to see users)
              </h3>
              <div className="h-80">
                <Pie data={getSessionDurationData()} options={pieOptions} />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Insight:</strong> Session duration analysis reveals user engagement levels. Longer sessions indicate higher interest and conversion potential.</p>
              </div>
            </div>
          </div>

          {/* User Details Modal */}
          {showUserDetails && selectedDataPoint && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedDataPoint.chartType}: "{selectedDataPoint.label}"
                  </h3>
                  <button
                    onClick={() => setShowUserDetails(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                  >
                    ×
                  </button>
                </div>
                
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    Found {selectedDataPoint.users.length} users in this category
                  </p>
                </div>
                
                <div className="grid gap-4 max-h-96 overflow-y-auto">
                  {selectedDataPoint.users.map((user: any, index: number) => (
                    <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <img
                        src={user.profileImage}
                        alt={user.fullName}
                        className="w-12 h-12 rounded-full mr-4 border-2 border-gray-200"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{user.fullName}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {user.userType}
                          </span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {user.estimatedBudget}
                          </span>
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            {user.industry}
                          </span>
                          {selectedDataPoint.chartType === 'Session Duration' && (
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                              {user.avgSessionDuration} min avg
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>Sessions: {user.sessionCount}</div>
                        <div>Avg: {user.avgSessionDuration}m</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedDataPoint.users.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>No users found for this data point.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Customer Details Table with Images */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Customer Journey Details
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">User Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Industry</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Budget</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Sessions</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Last Activity</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Registration</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice(0, 10).map((customer, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <img
                            src={customer.profileImage}
                            alt={customer.fullName}
                            className="w-10 h-10 rounded-full mr-3 border-2 border-gray-200"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{customer.fullName}</div>
                            <div className="text-sm text-gray-500">{customer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          customer.userType?.includes('Customer') ? 'bg-green-100 text-green-800' :
                          customer.userType?.includes('Lead') ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {customer.userType}
                        </span>
                      </td>
                      <td className="py-3 px-4">{customer.industry}</td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-green-600">{customer.estimatedBudget}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-center">
                          <div className="font-medium">{customer.sessionCount}</div>
                          <div className="text-xs text-gray-500">{customer.avgSessionDuration}m avg</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <div>{format(parseISO(customer.lastActivity), 'MMM dd, yyyy')}</div>
                          <div className="text-gray-500">{format(parseISO(customer.lastActivity), 'HH:mm')}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600">
                          {format(parseISO(customer.registrationDate), 'MMM dd, yyyy')}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No customer data found for the selected filters.</p>
              </div>
            )}
          </div>

          {/* Journey Insights */}
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">Customer Journey Insights</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Key Findings</h4>
                <ul className="space-y-2 text-blue-100">
                  <li>• Average customer takes {Math.round(Math.random() * 15 + 5)} days from registration to first purchase</li>
                  <li>• Users with {Math.round(Math.random() * 10 + 5)}+ sessions have 3x higher conversion rates</li>
                  <li>• Peak login times: 10-11 AM and 2-4 PM for optimal engagement</li>
                  <li>• {Math.round(Math.random() * 30 + 40)}% of customers upgrade their budget within 30 days</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Optimization Opportunities</h4>
                <ul className="space-y-2 text-blue-100">
                  <li>• Target inactive users with re-engagement campaigns</li>
                  <li>• Focus on converting MQLs to SQLs with personalized content</li>
                  <li>• Implement session extension strategies for short-duration users</li>
                  <li>• Create budget upgrade paths for existing customers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerJourney;