import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
const Home = () => {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const quickStats = [
    {
      title: 'Active Patients',
      value: '1,247',
      change: '+12%',
      icon: 'Users',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200'
    },
    {
      title: 'Today\'s Appointments',
      value: '89',
      change: '+5%',
      icon: 'Calendar',
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
      borderColor: 'border-secondary-200'
    },
    {
      title: 'Available Beds',
      value: '156',
      change: '-3%',
      icon: 'Bed',
      color: 'text-accent',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      title: 'Staff on Duty',
      value: '342',
      change: '+1%',
      icon: 'UserCheck',
      color: 'text-medical-purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
]

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

  const recentActivities = [
    {
      id: 1,
      type: 'appointment',
      message: 'New appointment scheduled with Dr. Smith',
      time: '2 minutes ago',
      priority: 'normal'
    },
    {
      id: 2,
      type: 'emergency',
      message: 'Emergency patient admitted to ICU',
      time: '5 minutes ago',
      priority: 'urgent'
    },
    {
      id: 3,
      type: 'discharge',
      message: 'Patient John Doe discharged successfully',
      time: '10 minutes ago',
      priority: 'normal'
    },
    {
      id: 4,
      type: 'lab',
      message: 'Lab results ready for Room 304',
      time: '15 minutes ago',
      priority: 'normal'
    }
  ]

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
{/* Tab Navigation */}
            <nav className="hidden lg:flex tab-navigation">
              <div 
                onClick={() => navigate('/patient-management')}
                className={`tab-item ${window.location.pathname === '/patient-management' ? 'tab-item-active' : ''}`}
              >
                <ApperIcon name="Users" className="tab-icon" />
                <span className="tab-label">Patients</span>
              </div>
              
              <div 
                onClick={() => navigate('/appointments')}
                className={`tab-item ${window.location.pathname === '/appointments' ? 'tab-item-active' : ''}`}
              >
                <ApperIcon name="Calendar" className="tab-icon" />
                <span className="tab-label">Appointments</span>
              </div>
              
              <div 
                onClick={() => navigate('/billing')}
                className={`tab-item ${window.location.pathname === '/billing' ? 'tab-item-active' : ''}`}
              >
                <ApperIcon name="CreditCard" className="tab-icon" />
                <span className="tab-label">Billing</span>
              </div>
              
              <div 
                onClick={() => navigate('/emergency')}
                className={`tab-item ${window.location.pathname === '/emergency' ? 'tab-item-active' : ''}`}
              >
                <ApperIcon name="AlertCircle" className="tab-icon" />
                <span className="tab-label">Emergency</span>
              </div>
              
              <div 
                onClick={() => navigate('/lab-results')}
                className={`tab-item ${window.location.pathname === '/lab-results' ? 'tab-item-active' : ''}`}
              >
                <ApperIcon name="FileText" className="tab-icon" />
                <span className="tab-label">Lab Results</span>
              </div>
              
              <div 
                onClick={() => navigate('/pharmacy')}
                className={`tab-item ${window.location.pathname === '/pharmacy' ? 'tab-item-active' : ''}`}
              >
                <ApperIcon name="Pill" className="tab-icon" />
                <span className="tab-label">Pharmacy</span>
              </div>
              
              <div 
                onClick={() => navigate('/reports')}
                className={`tab-item ${window.location.pathname === '/reports' ? 'tab-item-active' : ''}`}
              >
                <ApperIcon name="BarChart3" className="tab-icon" />
                <span className="tab-label">Reports</span>
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
              <button className="p-2 sm:p-3 rounded-xl bg-surface-100 hover:bg-surface-200 transition-colors">
                <ApperIcon name="Bell" className="w-5 h-5 sm:w-6 sm:h-6 text-surface-700" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Quick Stats */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-surface-900 mb-4 sm:mb-6">Dashboard Overview</h2>
          <div className="medical-grid">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className={`medical-card ${stat.bgColor} ${stat.borderColor} border-2 hover:scale-105 transform transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 sm:p-3 rounded-xl ${stat.bgColor} ${stat.borderColor} border`}>
                    <ApperIcon name={stat.icon} className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${stat.change.startsWith('+') ? 'text-secondary-600' : 'text-medical-red'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-surface-600">{stat.title}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

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

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 medical-card"
        >
          <h3 className="text-lg sm:text-xl font-bold text-surface-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              { name: 'Add Patient', icon: 'UserPlus', color: 'primary' },
              { name: 'Schedule', icon: 'CalendarPlus', color: 'secondary' },
              { name: 'Emergency', icon: 'AlertCircle', color: 'red' },
              { name: 'Lab Results', icon: 'FileText', color: 'purple' },
              { name: 'Pharmacy', icon: 'Pill', color: 'orange' },
              { name: 'Reports', icon: 'BarChart3', color: 'blue' }
].map((action, index) => (
              <motion.button
                key={action.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickAction(action.name)}
                className="flex flex-col items-center p-3 sm:p-4 rounded-xl bg-surface-50 hover:bg-surface-100 transition-all duration-200 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
              >
                <div className={`p-2 sm:p-3 rounded-xl mb-2 transition-colors group-hover:scale-110 ${
                  action.color === 'primary' ? 'bg-primary-100 text-primary-600 group-hover:bg-primary-200' :
                  action.color === 'secondary' ? 'bg-secondary-100 text-secondary-600 group-hover:bg-secondary-200' :
                  action.color === 'red' ? 'bg-red-100 text-red-600 group-hover:bg-red-200' :
                  action.color === 'purple' ? 'bg-purple-100 text-purple-600 group-hover:bg-purple-200' :
                  action.color === 'orange' ? 'bg-orange-100 text-orange-600 group-hover:bg-orange-200' :
                  'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
                }`}>
                  <ApperIcon name={action.icon} className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-surface-700 text-center">
                  {action.name}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  )
}

export default Home