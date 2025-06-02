import { useLocation, Link } from 'react-router-dom'
import ApperIcon from './ApperIcon'

const Breadcrumb = () => {
  const location = useLocation()
  
  const routeNames = {
    '/': 'Dashboard',
    '/patient-management': 'Patient Management',
    '/appointments': 'Appointments',
    '/billing': 'Billing & Invoices',
    '/emergency': 'Emergency',
    '/lab-results': 'Lab Results',
    '/pharmacy': 'Pharmacy',
    '/reports': 'Reports'
  }

  const pathSegments = location.pathname.split('/').filter(segment => segment !== '')
  
  // Always include home
  const breadcrumbItems = [
    { name: 'Dashboard', path: '/', isActive: location.pathname === '/' }
  ]

  // Add current page if not home
  if (location.pathname !== '/') {
    const currentRoute = routeNames[location.pathname]
    if (currentRoute) {
      breadcrumbItems.push({
        name: currentRoute,
        path: location.pathname,
        isActive: true
      })
    }
  }

  return (
    <nav className="breadcrumb-container">
      <div className="flex items-center space-x-2">
        <ApperIcon name="Home" className="w-4 h-4 text-surface-500" />
        {breadcrumbItems.map((item, index) => (
          <div key={item.path} className="flex items-center space-x-2">
            {index > 0 && (
              <ApperIcon name="ChevronRight" className="w-4 h-4 text-surface-400" />
            )}
            {item.isActive && index === breadcrumbItems.length - 1 ? (
              <span className="breadcrumb-current">
                {item.name}
              </span>
            ) : (
              <Link
                to={item.path}
                className="breadcrumb-link"
              >
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}

export default Breadcrumb