import { useLocation, Link } from 'react-router-dom'
import ApperIcon from './ApperIcon'

const Breadcrumb = () => {
  const location = useLocation()
  
  const pathMap = {
    '/': 'Dashboard',
    '/patient-management': 'Patient Management', 
    '/appointments': 'Appointments',
    '/billing': 'Billing & Invoices',
    '/emergency': 'Emergency',
    '/lab-results': 'Lab Results',
    '/pharmacy': 'Pharmacy',
    '/reports': 'Reports'
  }

  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment)
    const breadcrumbs = [{ name: 'Dashboard', path: '/' }]
    
    if (pathSegments.length > 0) {
      const currentPath = '/' + pathSegments.join('/')
      const currentName = pathMap[currentPath]
      
      if (currentName && currentPath !== '/') {
        breadcrumbs.push({ name: currentName, path: currentPath })
      }
    }
    
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <nav className="breadcrumb-container">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="flex items-center">
            {index > 0 && (
              <ApperIcon name="ChevronRight" className="w-4 h-4 text-surface-400 mx-2" />
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="breadcrumb-current">
                {breadcrumb.name}
              </span>
            ) : (
              <Link
                to={breadcrumb.path}
                className="breadcrumb-link"
              >
                {breadcrumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumb