import { useState } from 'react'
import Sidebar from './Sidebar'
import Breadcrumb from './Breadcrumb'
import ApperIcon from './ApperIcon'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useState(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-primary-50/30 to-secondary-50/30 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="layout-header">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Left side - Menu button and breadcrumb */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
              >
                <ApperIcon name="Menu" className="w-6 h-6 text-surface-700" />
              </button>
              
              {/* Desktop Breadcrumb */}
              <div className="hidden sm:block">
                <Breadcrumb />
              </div>
            </div>

            {/* Right side - Time and notifications */}
            <div className="flex items-center space-x-4">
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
              <button className="p-2 rounded-xl bg-surface-100 hover:bg-surface-200 transition-colors relative">
                <ApperIcon name="Bell" className="w-5 h-5 text-surface-700" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
            </div>
          </div>

          {/* Mobile Breadcrumb */}
          <div className="sm:hidden px-4 pb-3 border-t border-surface-100">
            <Breadcrumb />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout