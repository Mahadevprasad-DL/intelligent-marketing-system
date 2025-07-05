import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Megaphone, 
  MessageSquare, 
  Users, 
  BarChart3,  
  ShoppingBag,
  LogOut,
  Sparkles,
  User,
  TrendingUp,
  ChevronRight,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react';

interface UserType {
  campaign?: string;
  userType?: string;
  estimatedBudget?: string;
}

const Navigation: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuCollapsed, setIsDesktopMenuCollapsed] = useState(false);
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalUsers: 0,
    conversionRate: 0,
    revenueGrowth: 0,
  });

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'blue', description: 'Overview & Analytics' },
    { path: '/campaigns', icon: Megaphone, label: 'Campaigns', color: 'purple', description: 'AI Campaign Generator' },
    { path: '/ai-chat', icon: MessageSquare, label: 'AI Chat', color: 'green', description: 'Marketing Assistant' },
    { path: '/customer-journey', icon: Users, label: 'Customer Journey', color: 'orange', description: 'User Analytics' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', color: 'pink', description: 'Performance Insights' },
    { path: '/product-recommendation', icon: ShoppingBag, label: 'Products', color: 'teal', description: 'Recommendations' },
    { path: '/user-profile', icon: User, label: 'User Profile', color: 'cyan', description: 'Account Settings' },
    { path: '/trend-analyzer', icon: TrendingUp, label: 'Trend Analyzer', color: 'emerald', description: 'Market Trends' },
  ];

  const getBudgetValue = (budget: string): number => {
    switch (budget) {
      case '< ₹10k': return 5000;
      case '₹10k-₹50k': return 30000;
      case '₹50k-₹1L': return 75000;
      case '₹1L-₹5L': return 300000;
      case '₹5L+': return 750000;
      default: return 30000;
    }
  };

  useEffect(() => {
    try {
      const users: UserType[] = JSON.parse(localStorage.getItem('users') || '[]');
      // const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

      const campaigns = new Set(users.map((u) => u.campaign).filter(Boolean)).size;

      const customers = users.filter((u) =>
        u.userType === 'Customer' || u.userType === 'Loyal Customer'
      ).length;

      const conversionRate =
        users.length > 0 ? Math.round((customers / users.length) * 100) : 0;

      const totalRevenue = users.reduce((total, user) => {
        const budget = user.estimatedBudget || '₹10k-₹50k';
        return total + getBudgetValue(budget);
      }, 0);

      const revenueGrowth = Math.round((totalRevenue / 1_000_000) * 100) / 10;

      setStats({
        activeCampaigns: campaigns,
        totalUsers: users.length,
        conversionRate,
        revenueGrowth,
      });
    } catch (error) {
      console.error('Error parsing localStorage data', error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  };

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors: Record<string, string> = {
      blue: isActive ? 'bg-blue-100 text-blue-700 border-blue-200' : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50',
      purple: isActive ? 'bg-purple-100 text-purple-700 border-purple-200' : 'text-gray-600 hover:text-purple-700 hover:bg-purple-50',
      green: isActive ? 'bg-green-100 text-green-700 border-green-200' : 'text-gray-600 hover:text-green-700 hover:bg-green-50',
      orange: isActive ? 'bg-orange-100 text-orange-700 border-orange-200' : 'text-gray-600 hover:text-orange-700 hover:bg-orange-50',
      pink: isActive ? 'bg-pink-100 text-pink-700 border-pink-200' : 'text-gray-600 hover:text-pink-700 hover:bg-pink-50',
      indigo: isActive ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'text-gray-600 hover:text-indigo-700 hover:bg-indigo-50',
      teal: isActive ? 'bg-teal-100 text-teal-700 border-teal-200' : 'text-gray-600 hover:text-teal-700 hover:bg-teal-50',
      cyan: isActive ? 'bg-cyan-100 text-cyan-700 border-cyan-200' : 'text-gray-600 hover:text-cyan-700 hover:bg-cyan-50',
      emerald: isActive ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50',
    };
    return colors[color] || '';
  };

  return (
    <>
      {/* Top Navigation Bar - Mobile */}
      <nav className="lg:hidden bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Marketing AI
                </h1>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Left Sidebar - Desktop */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 lg:bg-white lg:shadow-xl lg:border-r lg:border-gray-200 transition-all duration-300 ${
        isDesktopMenuCollapsed ? 'lg:w-20' : 'lg:w-80'
      }`}>
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center justify-between">
              <div className={`flex items-center space-x-3 ${isDesktopMenuCollapsed ? 'justify-center' : ''}`}>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                {!isDesktopMenuCollapsed && (
                  <div>
                    <h2 className="text-xl font-bold text-white">Marketing AI</h2>
                    <p className="text-blue-100 text-sm">Transform Your Marketing</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsDesktopMenuCollapsed(!isDesktopMenuCollapsed)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isDesktopMenuCollapsed ? (
                  <ChevronRight className="w-5 h-5 text-white" />
                ) : (
                  <ChevronLeft className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 flex flex-col overflow-y-auto p-6">
            <div className="space-y-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center ${isDesktopMenuCollapsed ? 'justify-center' : 'justify-between'} px-4 py-4 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
                      isActive ? 'border-2 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 scale-105' : 'border-transparent hover:bg-gray-50 hover:scale-102'
                    } ${getColorClasses(item.color, isActive)}`}
                    title={isDesktopMenuCollapsed ? item.label : ''}
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDesktopMenuCollapsed ? '' : 'mr-3'} ${
                        isActive ? 'bg-white shadow-md' : 'bg-gray-100 group-hover:bg-white'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {!isDesktopMenuCollapsed && (
                        <div>
                          <div className="font-semibold">{item.label}</div>
                          <div className="text-xs opacity-75">{item.description}</div>
                        </div>
                      )}
                    </div>
                    {!isDesktopMenuCollapsed && (
                      <ChevronRight className={`w-5 h-5 transition-transform ${isActive ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Logout Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className={`w-full flex items-center ${isDesktopMenuCollapsed ? 'justify-center' : 'justify-between'} px-4 py-4 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-red-200 group`}
                title={isDesktopMenuCollapsed ? 'Logout' : ''}
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center ${isDesktopMenuCollapsed ? '' : 'mr-3'} group-hover:bg-red-200`}>
                    <LogOut className="w-5 h-5" />
                  </div>
                  {!isDesktopMenuCollapsed && (
                    <div>
                      <div className="font-semibold">Logout</div>
                      <div className="text-xs opacity-75">Sign out safely</div>
                    </div>
                  )}
                </div>
                {!isDesktopMenuCollapsed && (
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </div>

            {/* Quick Stats */}
            {!isDesktopMenuCollapsed && (
              <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Live Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-gray-600 text-sm">Active Campaigns</span>
                    <span className="font-bold text-blue-600 text-lg">{stats.activeCampaigns}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-gray-600 text-sm">Total Users</span>
                    <span className="font-bold text-green-600 text-lg">{stats.totalUsers}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-gray-600 text-sm">Conversion Rate</span>
                    <span className="font-bold text-purple-600 text-lg">{stats.conversionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-gray-600 text-sm">Revenue Growth</span>
                    <span className="font-bold text-orange-600 text-lg">+{stats.revenueGrowth}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* AI Features Highlight */}
            {!isDesktopMenuCollapsed && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl text-white text-center">
                <h4 className="font-bold mb-2">🚀 AI-Powered Marketing</h4>
                <p className="text-sm opacity-90">Transform your marketing strategy with artificial intelligence</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Marketing AI</h2>
                <p className="text-blue-100 text-sm">Navigation Menu</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 h-full overflow-y-auto">
          <div className="space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group flex items-center justify-between px-4 py-4 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
                    isActive ? 'border-2 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 scale-105' : 'border-transparent hover:bg-gray-50 hover:scale-102'
                  } ${getColorClasses(item.color, isActive)}`}
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      isActive ? 'bg-white shadow-md' : 'bg-gray-100 group-hover:bg-white'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold">{item.label}</div>
                      <div className="text-xs opacity-75">{item.description}</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform ${isActive ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;