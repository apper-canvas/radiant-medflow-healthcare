import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

const LabResults = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock lab results data
  const mockResults = [
    {
      id: 'LR001',
      patientName: 'John Smith',
      patientId: 'P12345',
      testType: 'Complete Blood Count (CBC)',
      status: 'completed',
      priority: 'routine',
      orderDate: '2024-01-15',
      completedDate: '2024-01-15',
      results: {
        wbc: '7.2 K/uL',
        rbc: '4.5 M/uL',
        hemoglobin: '14.2 g/dL',
        hematocrit: '42.1%'
      },
      criticalFlags: false,
      doctorOrdered: 'Dr. Wilson'
    },
    {
      id: 'LR002',
      patientName: 'Sarah Johnson',
      patientId: 'P67890',
      testType: 'Lipid Panel',
      status: 'pending',
      priority: 'urgent',
      orderDate: '2024-01-16',
      completedDate: null,
      results: null,
      criticalFlags: false,
      doctorOrdered: 'Dr. Martinez'
    },
    {
      id: 'LR003',
      patientName: 'Michael Brown',
      patientId: 'P54321',
      testType: 'Thyroid Function Tests',
      status: 'completed',
      priority: 'routine',
      orderDate: '2024-01-14',
      completedDate: '2024-01-15',
      results: {
        tsh: '2.1 mIU/L',
        t4: '8.5 ug/dL',
        t3: '145 ng/dL'
      },
      criticalFlags: true,
      doctorOrdered: 'Dr. Chen'
    },
    {
      id: 'LR004',
      patientName: 'Emily Davis',
      patientId: 'P98765',
      testType: 'Comprehensive Metabolic Panel',
      status: 'in-progress',
      priority: 'stat',
      orderDate: '2024-01-16',
      completedDate: null,
      results: null,
      criticalFlags: false,
      doctorOrdered: 'Dr. Thompson'
    },
    {
      id: 'LR005',
      patientName: 'Robert Wilson',
      patientId: 'P13579',
      testType: 'Cardiac Enzymes',
      status: 'completed',
      priority: 'urgent',
      orderDate: '2024-01-15',
      completedDate: '2024-01-15',
      results: {
        troponin: '0.03 ng/mL',
        ckMb: '2.1 ng/mL',
        ldh: '185 U/L'
      },
      criticalFlags: false,
      doctorOrdered: 'Dr. Anderson'
    }
  ]

  useEffect(() => {
    // Simulate loading lab results
    const timer = setTimeout(() => {
      setResults(mockResults)
      setLoading(false)
      toast.success('Lab results loaded successfully')
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Quick stats calculations
  const stats = {
    pending: results.filter(r => r.status === 'pending').length,
    completed: results.filter(r => r.status === 'completed').length,
    critical: results.filter(r => r.criticalFlags).length,
    avgTurnaround: '24 hrs'
  }

  // Filter results based on search and filters
  const filteredResults = results.filter(result => {
    const matchesSearch = 
      result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || result.status === statusFilter
    
    const matchesDate = dateFilter === 'all' || 
      (dateFilter === 'today' && result.orderDate === '2024-01-16') ||
      (dateFilter === 'week' && ['2024-01-15', '2024-01-16', '2024-01-14'].includes(result.orderDate))
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const handleViewResult = (resultId) => {
    const result = results.find(r => r.id === resultId)
    if (result && result.status === 'completed') {
      toast.success(`Opening detailed results for ${result.patientName}`)
      // In a real app, this would open a detailed results modal or navigate to detailed view
    } else {
      toast.warning('Results not yet available')
    }
  }

  const handleDownloadReport = (resultId) => {
    const result = results.find(r => r.id === resultId)
    if (result && result.status === 'completed') {
      toast.success(`Downloading report for ${result.patientName}`)
      // In a real app, this would trigger a PDF download
    } else {
      toast.error('Cannot download incomplete results')
    }
  }

  const handleFlagCritical = (resultId) => {
    setResults(prev => prev.map(result => 
      result.id === resultId 
        ? { ...result, criticalFlags: !result.criticalFlags }
        : result
    ))
    const result = results.find(r => r.id === resultId)
    toast.info(`Critical flag ${result.criticalFlags ? 'removed from' : 'added to'} ${result.patientName}'s results`)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'status-active'
      case 'pending':
        return 'status-pending'
      case 'in-progress':
        return 'status-urgent'
      default:
        return 'medical-badge bg-surface-100 text-surface-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'stat':
        return 'text-red-600 bg-red-100'
      case 'urgent':
        return 'text-orange-600 bg-orange-100'
      case 'routine':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-surface-600 bg-surface-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 via-primary-50/30 to-secondary-50/30 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-surface-600">Loading lab results...</p>
        </motion.div>
      </div>
    )
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
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-3 hover:bg-surface-100 rounded-lg p-2 transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
                  <ApperIcon name="Stethoscope" className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gradient">MedFlow</h1>
                  <p className="text-xs sm:text-sm text-surface-600 hidden sm:block">Lab Results Management</p>
                </div>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="medical-button-primary flex items-center space-x-2"
              >
                <ApperIcon name="ArrowLeft" className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-2">Lab Results</h2>
          <p className="text-surface-600">Manage and view laboratory test results</p>
        </motion.div>

        {/* Quick Stats */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="medical-grid">
            <div className="medical-card bg-yellow-50 border-yellow-200 border-2">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-yellow-100 border border-yellow-200">
                  <ApperIcon name="Clock" className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-surface-900 mb-1">{stats.pending}</h3>
              <p className="text-sm text-surface-600">Pending Results</p>
            </div>

            <div className="medical-card bg-green-50 border-green-200 border-2">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-green-100 border border-green-200">
                  <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-surface-900 mb-1">{stats.completed}</h3>
              <p className="text-sm text-surface-600">Completed Results</p>
            </div>

            <div className="medical-card bg-red-50 border-red-200 border-2">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-red-100 border border-red-200">
                  <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-surface-900 mb-1">{stats.critical}</h3>
              <p className="text-sm text-surface-600">Critical Results</p>
            </div>

            <div className="medical-card bg-blue-50 border-blue-200 border-2">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-blue-100 border border-blue-200">
                  <ApperIcon name="Timer" className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-surface-900 mb-1">{stats.avgTurnaround}</h3>
              <p className="text-sm text-surface-600">Avg Turnaround</p>
            </div>
          </div>
        </motion.section>

        {/* Search and Filters */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="medical-card mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search by patient name, ID, test type, or lab ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-surface-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="medical-select min-w-[140px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="medical-select min-w-[120px]"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </motion.section>

        {/* Results Table */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="medical-card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-surface-900">
              Lab Results ({filteredResults.length})
            </h3>
            <button
              onClick={() => toast.info('Refreshing lab results...')}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-primary-100 hover:bg-primary-200 text-primary-700 font-medium transition-colors"
            >
              <ApperIcon name="RefreshCw" className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="text-left py-3 px-4 font-semibold text-surface-900">Lab ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-surface-900">Patient</th>
                  <th className="text-left py-3 px-4 font-semibold text-surface-900">Test Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-surface-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-surface-900">Priority</th>
                  <th className="text-left py-3 px-4 font-semibold text-surface-900">Order Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-surface-900">Doctor</th>
                  <th className="text-left py-3 px-4 font-semibold text-surface-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result, index) => (
                  <motion.tr
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="border-b border-surface-100 hover:bg-surface-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-surface-900">{result.id}</span>
                        {result.criticalFlags && (
                          <ApperIcon name="AlertTriangle" className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-surface-900">{result.patientName}</p>
                        <p className="text-sm text-surface-600">{result.patientId}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-surface-900">{result.testType}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`${getStatusBadge(result.status)} capitalize`}>
                        {result.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`medical-badge ${getPriorityColor(result.priority)} capitalize`}>
                        {result.priority}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-surface-900">{result.orderDate}</p>
                        {result.completedDate && (
                          <p className="text-sm text-surface-600">Completed: {result.completedDate}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-surface-900">{result.doctorOrdered}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewResult(result.id)}
                          className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                          title="View Results"
                        >
                          <ApperIcon name="Eye" className="w-4 h-4" />
                        </button>
                        
                        {result.status === 'completed' && (
                          <button
                            onClick={() => handleDownloadReport(result.id)}
                            className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
                            title="Download Report"
                          >
                            <ApperIcon name="Download" className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleFlagCritical(result.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            result.criticalFlags 
                              ? 'bg-red-100 hover:bg-red-200 text-red-600' 
                              : 'bg-surface-100 hover:bg-surface-200 text-surface-600'
                          }`}
                          title={result.criticalFlags ? "Remove Critical Flag" : "Flag as Critical"}
                        >
                          <ApperIcon name="Flag" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {filteredResults.length === 0 && (
              <div className="text-center py-12">
                <ApperIcon name="FileX" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
                <p className="text-surface-600">No lab results found matching your criteria</p>
              </div>
)}
          </div>
        </motion.section>
      </main>
    </div>
  )
}

export default LabResults