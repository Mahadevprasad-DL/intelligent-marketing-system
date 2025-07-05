import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import { User, Mail, Phone, Building, MapPin, Edit, Save, X, Upload, Camera, Shield, Bell, Palette, Globe, Lock, Eye, EyeOff } from 'lucide-react';
import Notification from './Notification';

const UserProfile: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<any>({});
  const [profileImage, setProfileImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState('profile');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [notification, setNotification] = useState({
    isVisible: false,
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: ''
  });

  const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem('darkMode') === 'true';
});

useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('darkMode', String(darkMode));
}, [darkMode]);




  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setCurrentUser(user);
    setEditedUser(user);
    setProfileImage(user.profileImage || generateProfileImage(user.fullName));
  }, []);

  const generateProfileImage = (name: string) => {
    if (!name) return '';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=200`;
  };

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setNotification({
      isVisible: true,
      type,
      title,
      message
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleSave = () => {
    const updatedUser = { ...editedUser, profileImage };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: any) => 
      user.id === updatedUser.id ? updatedUser : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    setIsEditing(false);
    showNotification('success', 'Profile Updated', 'Your profile has been successfully updated.');
  };

  const handleCancel = () => {
    setEditedUser(currentUser);
    setProfileImage(currentUser.profileImage || generateProfileImage(currentUser.fullName));
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showNotification('error', 'Missing Information', 'Please fill in all password fields.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('error', 'Password Mismatch', 'New password and confirmation do not match.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showNotification('error', 'Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    // Verify current password
    if (passwordData.currentPassword !== currentUser.password) {
      showNotification('error', 'Incorrect Password', 'Current password is incorrect.');
      return;
    }
    
    // Update password in localStorage
    const updatedUser = { ...currentUser, password: passwordData.newPassword };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: any) => 
      user.id === updatedUser.id ? updatedUser : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Clear password fields
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    showNotification('success', 'Password Changed', 'Your password has been successfully updated.');
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      <Navigation />
      
      {/* Main Content with Left Sidebar Spacing */}
      <div className="lg:pl-80">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg border">
                {/* Profile Image */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-16 h-16 text-white" />
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                        <Camera className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mt-4">{currentUser.fullName}</h3>
                  <p className="text-gray-600">{currentUser.email}</p>
                  <div className="mt-4 flex items-center justify-center space-x-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {currentUser.userType || 'User'}
                    </span>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all ${
                          activeTab === tab.id
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-8 shadow-lg border">
                {/* Profile Information Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex space-x-3">
                          <button
                            onClick={handleSave}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </button>
                          <button
                            onClick={handleCancel}
                            className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedUser.fullName || ''}
                              onChange={(e) => setEditedUser({...editedUser, fullName: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                              <User className="w-5 h-5 text-gray-400 mr-3" />
                              <span>{currentUser.fullName}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                          {isEditing ? (
                            <input
                              type="email"
                              value={editedUser.email || ''}
                              onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                              <Mail className="w-5 h-5 text-gray-400 mr-3" />
                              <span>{currentUser.email}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={editedUser.phoneNumber || ''}
                              onChange={(e) => setEditedUser({...editedUser, phoneNumber: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                              <Phone className="w-5 h-5 text-gray-400 mr-3" />
                              <span>{currentUser.phoneNumber}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                          {isEditing ? (
                            <select
                              value={editedUser.industry || ''}
                              onChange={(e) => setEditedUser({...editedUser, industry: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select Industry</option>
                              <option value="Tech">Tech</option>
                              <option value="Finance">Finance</option>
                              <option value="Healthcare">Healthcare</option>
                              <option value="E-commerce">E-commerce</option>
                              <option value="Education">Education</option>
                              <option value="Others">Others</option>
                            </select>
                          ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                              <Building className="w-5 h-5 text-gray-400 mr-3" />
                              <span>{currentUser.industry}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Location & Business Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Business</h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedUser.country || ''}
                              onChange={(e) => setEditedUser({...editedUser, country: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                              <Globe className="w-5 h-5 text-gray-400 mr-3" />
                              <span>{currentUser.country}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedUser.state || ''}
                              onChange={(e) => setEditedUser({...editedUser, state: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                              <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                              <span>{currentUser.state}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedUser.city || ''}
                              onChange={(e) => setEditedUser({...editedUser, city: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                              <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                              <span>{currentUser.city}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
                          {isEditing ? (
                            <select
                              value={editedUser.userType || ''}
                              onChange={(e) => setEditedUser({...editedUser, userType: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select User Type</option>
                              <option value="New User">New User</option>
                              <option value="Lead">Lead</option>
                              <option value="MQL (Marketing Qualified Lead)">MQL (Marketing Qualified Lead)</option>
                              <option value="SQL (Sales Qualified Lead)">SQL (Sales Qualified Lead)</option>
                              <option value="Prospect">Prospect</option>
                              <option value="Customer">Customer</option>
                              <option value="Loyal Customer">Loyal Customer</option>
                              <option value="Advocate">Advocate</option>
                            </select>
                          ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                              <User className="w-5 h-5 text-gray-400 mr-3" />
                              <span>{currentUser.userType}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Customer Journey Information */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Journey Information</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">Lead Source</h4>
                          <p className="text-blue-700">{currentUser.leadSource}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-900 mb-2">Estimated Budget</h4>
                          <p className="text-green-700">{currentUser.estimatedBudget}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-medium text-purple-900 mb-2">Expected Time to Buy</h4>
                          <p className="text-purple-700">{currentUser.expectedTimeToBuy}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Preferences</h2>
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Display Preferences</h3>
        <div className="space-y-4">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(prev => !prev)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full
                          peer peer-checked:after:translate-x-full peer-checked:after:border-white 
                          after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                          after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                          after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Compact View - static for now */}
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Compact View</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full
                          peer peer-checked:after:translate-x-full peer-checked:after:border-white 
                          after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                          after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                          after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
)}


                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                            <div className="relative">
                              <input
                                type={showPasswords.current ? 'text' : 'password'}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter current password"
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('current')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <div className="relative">
                              <input
                                type={showPasswords.new ? 'text' : 'password'}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter new password"
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                            <div className="relative">
                              <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Confirm new password"
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                          
                          <button
                            onClick={handlePasswordChange}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                          >
                            <Lock className="w-4 h-4 mr-2" />
                            Update Password
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Enable 2FA</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h2>
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Campaign Updates</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Weekly Reports</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Security Alerts</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  );
};

export default UserProfile;