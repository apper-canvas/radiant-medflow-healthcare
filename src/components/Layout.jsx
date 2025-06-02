import { useState } from 'react'
import Sidebar from './Sidebar'
import Breadcrumb from './Breadcrumb'
import ApperIcon from './ApperIcon'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
<div className="min-h-screen bg-surface-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:pl-80' : 'lg:pl-80'}`}>
        {/* Header */}
        <header className="layout-header">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
              >
                <ApperIcon name="Menu" className="w-6 h-6 text-surface-700" />
              </button>
              
              {/* Breadcrumb */}
              <Breadcrumb />
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-surface-100 transition-colors">
                <ApperIcon name="Bell" className="w-6 h-6 text-surface-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-medical-red rounded-full"></span>
              </button>
              
              {/* Search */}
              <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors">
                <ApperIcon name="Search" className="w-6 h-6 text-surface-700" />
              </button>
              
              {/* User Profile */}
              <div className="flex items-center space-x-2 ml-4">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">AD</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-surface-900">Admin User</p>
                  <p className="text-xs text-surface-600">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout