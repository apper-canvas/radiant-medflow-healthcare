import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
const Home = () => {
const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'appointment', title: 'Upcoming Appointment', message: 'Dr. Smith appointment in 30 minutes', time: '2 min ago', read: false, priority: 'high' },
    { id: 2, type: 'lab', title: 'Lab Results Ready', message: 'Blood test results for Room 304', time: '5 min ago', read: false, priority: 'normal' },
    { id: 3, type: 'emergency', title: 'Emergency Alert', message: 'Code Blue resolved in ICU', time: '10 min ago', read: true, priority: 'urgent' },
    { id: 4, type: 'patient', title: 'Patient Admission', message: 'New patient John Doe admitted', time: '15 min ago', read: false, priority: 'normal' },
    { id: 5, type: 'pharmacy', title: 'Medication Alert', message: 'Low stock: Amoxicillin', time: '20 min ago', read: true, priority: 'normal' }
  ])

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
}, [])

// Handle quick action button clicks
  const handleQuickAction = (actionName) => {
    switch (actionName) {
      case 'Add Patient':
        navigate('/patient-management')
        toast.success('Navigating to Patient Management')
        break
      case 'Schedule':
        navigate('/appointments')
        toast.success('Navigating to Appointments')
        break
      case 'Emergency':
        navigate('/emergency')
        toast.warning('Opening Emergency Management System')
        break
      case 'Lab Results':
        navigate('/lab-results')
        toast.success('Navigating to Lab Results')
        break
      case 'Pharmacy':
        navigate('/pharmacy')
        toast.success('Navigating to Pharmacy Management')
        break
      case 'Reports':
        navigate('/reports')
        toast.success('Navigating to Reports & Analytics')
        break
      default:
        toast.warning('Feature coming soon!')
    }
  }

  // Handle notification click
  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    )
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'appointment':
        navigate('/appointments')
        toast.success('Navigating to Appointments')
        break
      case 'lab':
        navigate('/lab-results')
        toast.success('Navigating to Lab Results')
        break
      case 'emergency':
        navigate('/emergency')
        toast.warning('Navigating to Emergency Management')
        break
      case 'patient':
        navigate('/patient-management')
        toast.success('Navigating to Patient Management')
        break
      case 'pharmacy':
        navigate('/pharmacy')
        toast.success('Navigating to Pharmacy')
        break
      default:
        toast.info('Notification clicked')
    }
    
    setShowNotifications(false)
  }

  // Toggle notification dropdown
  const toggleNotificationDropdown = () => {
    setShowNotifications(!showNotifications)
  }

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
    toast.success('Notification marked as read')
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    toast.success('All notifications marked as read')
  }

  // Get unread notification count
  const unreadCount = notifications.filter(n => !n.read).length

const [recentActivities, setRecentActivities] = useState([])

  // Load real-time data on component mount
  useEffect(() => {
    // Load notifications and activities from actual services
    // This can be implemented to fetch from multiple services
    loadNotifications()
    loadRecentActivities()
  }, [])

  const loadNotifications = async () => {
    // This would fetch from notification service or aggregate from multiple sources
    // For now, keeping empty to remove hardcoded data
    setNotifications([])
  }

  const loadRecentActivities = async () => {
    // This would aggregate recent activities from various services
    // For now, keeping empty to remove hardcoded data
    setRecentActivities([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-primary-50/30 to-secondary-50/30">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-surface-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
                <ApperIcon name="Stethoscope" className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gradient">MedFlow</h1>
                <p className="text-xs sm:text-sm text-surface-600 hidden sm:block">Healthcare Management Platform</p>
              </div>
</div>
{/* Navigation Buttons */}
            {/* Reorganized Tab Navigation */}
            <nav className="hidden lg:flex nav-container">
              {/* Home */}
              <div 
                onClick={() => navigate('/')}
                className={`nav-item ${window.location.pathname === '/' ? 'nav-item-active' : ''}`}
              >
                <ApperIcon name="Home" className="nav-icon" />
                <span className="nav-label">Home</span>
              </div>
              
              {/* Clinical Dropdown */}
              <div className="nav-dropdown">
                <div className={`nav-item ${['/patient-management', '/appointments', '/lab-results'].includes(window.location.pathname) ? 'nav-item-active' : ''}`}>
                  <ApperIcon name="Stethoscope" className="nav-icon" />
                  <span className="nav-label">Clinical</span>
                  <ApperIcon name="ChevronDown" className="w-3 h-3 ml-1" />
                </div>
                <div className="nav-dropdown-menu">
                  <div 
                    onClick={() => navigate('/patient-management')}
                    className="nav-dropdown-item"
                  >
                    <ApperIcon name="Users" className="w-4 h-4" />
                    <span>Patient Management</span>
                  </div>
                  <div 
                    onClick={() => navigate('/appointments')}
                    className="nav-dropdown-item"
                  >
                    <ApperIcon name="Calendar" className="w-4 h-4" />
                    <span>Appointments</span>
                  </div>
                  <div 
                    onClick={() => navigate('/lab-results')}
                    className="nav-dropdown-item"
                  >
                    <ApperIcon name="FileText" className="w-4 h-4" />
                    <span>Lab Results</span>
                  </div>
                </div>
              </div>
              
              {/* Administrative Dropdown */}
              <div className="nav-dropdown">
                <div className={`nav-item ${['/billing', '/pharmacy', '/reports'].includes(window.location.pathname) ? 'nav-item-active' : ''}`}>
                  <ApperIcon name="Building2" className="nav-icon" />
                  <span className="nav-label">Administrative</span>
                  <ApperIcon name="ChevronDown" className="w-3 h-3 ml-1" />
                </div>
                <div className="nav-dropdown-menu">
                  <div 
                    onClick={() => navigate('/billing')}
                    className="nav-dropdown-item"
                  >
                    <ApperIcon name="CreditCard" className="w-4 h-4" />
                    <span>Billing & Payments</span>
                  </div>
                  <div 
                    onClick={() => navigate('/pharmacy')}
                    className="nav-dropdown-item"
                  >
                    <ApperIcon name="Pill" className="w-4 h-4" />
                    <span>Pharmacy</span>
                  </div>
                  <div 
                    onClick={() => navigate('/reports')}
                    className="nav-dropdown-item"
                  >
                    <ApperIcon name="BarChart3" className="w-4 h-4" />
                    <span>Reports & Analytics</span>
                  </div>
                </div>
              </div>
              
              {/* Emergency - Standalone */}
              <div 
                onClick={() => navigate('/emergency')}
                className={`nav-item nav-item-emergency ${window.location.pathname === '/emergency' ? 'nav-item-active' : ''}`}
              >
                <ApperIcon name="AlertCircle" className="nav-icon" />
                <span className="nav-label">Emergency</span>
              </div>
            </nav>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-surface-900">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-sm text-surface-600">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
{/* Notification Bell with Dropdown */}
              <div className="relative">
                <button 
                  onClick={toggleNotificationDropdown}
                  className="relative p-2 sm:p-3 rounded-xl bg-surface-100 hover:bg-surface-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <ApperIcon name="Bell" className="w-5 h-5 sm:w-6 sm:h-6 text-surface-700" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-surface-200 z-50 max-h-96 overflow-y-auto"
                  >
                    {/* Dropdown Header */}
                    <div className="flex items-center justify-between p-4 border-b border-surface-200">
                      <h3 className="font-semibold text-surface-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* Notification List */}
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-surface-500">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            whileHover={{ backgroundColor: '#f8fafc' }}
                            onClick={() => handleNotificationClick(notification)}
                            className={`p-4 border-b border-surface-100 cursor-pointer transition-colors ${
                              !notification.read ? 'bg-primary-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${
                                notification.priority === 'urgent' ? 'bg-red-100 text-red-600' :
                                notification.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                                'bg-primary-100 text-primary-600'
                              }`}>
                                <ApperIcon 
                                  name={
                                    notification.type === 'appointment' ? 'Calendar' :
                                    notification.type === 'lab' ? 'FileText' :
                                    notification.type === 'emergency' ? 'AlertTriangle' :
                                    notification.type === 'patient' ? 'Users' :
                                    'Pill'
                                  } 
                                  className="w-4 h-4" 
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-sm text-surface-900 truncate">
                                    {notification.title}
                                  </p>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-primary-500 rounded-full ml-2"></div>
                                  )}
                                </div>
                                <p className="text-sm text-surface-600 truncate mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-surface-500 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>

                    {/* Dropdown Footer */}
                    <div className="p-3 border-t border-surface-200">
                      <button 
                        onClick={() => {
                          setShowNotifications(false)
                          toast.info('View all notifications functionality coming soon')
                        }}
                        className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Click outside to close */}
                {showNotifications && (
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowNotifications(false)}
                  ></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.header>

{/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Main Feature and Activities Grid */}
        <div className="medical-grid-2 gap-6 sm:gap-8">
          {/* Main Feature */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MainFeature />
          </motion.section>

          {/* Recent Activities */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="medical-card"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-surface-900">Recent Activities</h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start space-x-3 p-3 sm:p-4 rounded-xl bg-surface-50 hover:bg-surface-100 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${
                    activity.priority === 'urgent' 
                      ? 'bg-medical-red/20 text-medical-red' 
                      : 'bg-primary-100 text-primary-600'
                  }`}>
                    <ApperIcon 
                      name={
                        activity.type === 'appointment' ? 'Calendar' :
                        activity.type === 'emergency' ? 'AlertTriangle' :
                        activity.type === 'discharge' ? 'UserCheck' : 'FileText'
                      } 
                      className="w-4 h-4" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900 mb-1">
                      {activity.message}
                    </p>
                    <p className="text-xs text-surface-600">{activity.time}</p>
                  </div>
                  {activity.priority === 'urgent' && (
                    <span className="status-urgent">Urgent</span>
                  )}
                </motion.div>
              ))}
</div>
          </motion.section>
        </div>
      </main>
    </div>
  )
}

export default Home