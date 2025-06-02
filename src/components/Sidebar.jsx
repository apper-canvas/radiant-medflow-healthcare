import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const navigationItems = [
    {
      section: 'Core Features',
      items: [
        { name: 'Dashboard', path: '/', icon: 'Home' },
        { name: 'Patient Management', path: '/patient-management', icon: 'Users' },
        { name: 'Appointments', path: '/appointments', icon: 'Calendar' },
        { name: 'Billing & Invoices', path: '/billing', icon: 'CreditCard' }
      ]
    },
    {
      section: 'Medical Services',
      items: [
        { name: 'Emergency', path: '/emergency', icon: 'AlertCircle' },
        { name: 'Lab Results', path: '/lab-results', icon: 'FileText' },
        { name: 'Pharmacy', path: '/pharmacy', icon: 'Pill' }
      ]
    },
    {
      section: 'Analytics',
      items: [
        { name: 'Reports', path: '/reports', icon: 'BarChart3' }
      ]
    }
  ]

  const handleNavigation = (path, name) => {
    navigate(path)
    toast.success(`Navigating to ${name}`)
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 lg:relative lg:translate-x-0 lg:shadow-none lg:border-r lg:border-surface-200"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-surface-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
                <ApperIcon name="Stethoscope" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-surface-900">MedFlow</h2>
                <p className="text-xs text-surface-600">Healthcare Platform</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5 text-surface-600" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 overflow-y-auto h-full pb-20">
          {navigationItems.map((section, sectionIndex) => (
            <div key={section.section} className="mb-6">
              <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3 px-3">
                {section.section}
              </h3>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path, item.name)}
                      className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
                    >
                      <ApperIcon 
                        name={item.icon} 
                        className={`sidebar-icon ${isActive ? 'text-primary-600' : 'text-surface-600'}`} 
                      />
                      <span className={`sidebar-label ${isActive ? 'text-primary-900 font-medium' : 'text-surface-700'}`}>
                        {item.name}
                      </span>
                      {isActive && (
                        <div className="sidebar-indicator" />
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
{/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-surface-200 bg-surface-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-900 truncate">Admin User</p>
              <p className="text-xs text-surface-600 truncate">admin@medflow.com</p>
            </div>
            <button className="p-1 rounded-lg hover:bg-surface-200 transition-colors">
              <ApperIcon name="Settings" className="w-4 h-4 text-surface-600" />
            </button>
</div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;