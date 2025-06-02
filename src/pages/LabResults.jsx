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
const [activeTab, setActiveTab] = useState('results')
  const [uploadedDocuments, setUploadedDocuments] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    patientId: '',
    testType: '',
    priority: 'routine',
    parameters: {},
    interpretation: '',
    comments: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [selectedPatients, setSelectedPatients] = useState([])
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

  // Mock patients data for form
  const mockPatients = [
    { id: 'P12345', name: 'John Smith', age: 45, gender: 'Male' },
    { id: 'P67890', name: 'Sarah Johnson', age: 32, gender: 'Female' },
    { id: 'P54321', name: 'Michael Brown', age: 58, gender: 'Male' },
    { id: 'P98765', name: 'Emily Davis', age: 28, gender: 'Female' },
    { id: 'P13579', name: 'Robert Wilson', age: 67, gender: 'Male' },
    { id: 'P24681', name: 'Lisa Anderson', age: 41, gender: 'Female' },
    { id: 'P35792', name: 'David Martinez', age: 36, gender: 'Male' }
  ]

  // Test type configurations with parameters and reference ranges
  const testConfigurations = {
    'Complete Blood Count (CBC)': {
      parameters: [
        { name: 'wbc', label: 'White Blood Cells', unit: 'K/uL', referenceRange: '4.0-11.0' },
        { name: 'rbc', label: 'Red Blood Cells', unit: 'M/uL', referenceRange: '4.2-5.4' },
        { name: 'hemoglobin', label: 'Hemoglobin', unit: 'g/dL', referenceRange: '12.0-16.0' },
        { name: 'hematocrit', label: 'Hematocrit', unit: '%', referenceRange: '36-46' },
        { name: 'platelets', label: 'Platelets', unit: 'K/uL', referenceRange: '150-450' }
      ]
    },
    'Lipid Panel': {
      parameters: [
        { name: 'totalCholesterol', label: 'Total Cholesterol', unit: 'mg/dL', referenceRange: '<200' },
        { name: 'ldl', label: 'LDL Cholesterol', unit: 'mg/dL', referenceRange: '<100' },
        { name: 'hdl', label: 'HDL Cholesterol', unit: 'mg/dL', referenceRange: '>40' },
        { name: 'triglycerides', label: 'Triglycerides', unit: 'mg/dL', referenceRange: '<150' }
      ]
    },
    'Thyroid Function Tests': {
      parameters: [
        { name: 'tsh', label: 'TSH', unit: 'mIU/L', referenceRange: '0.4-4.0' },
        { name: 't4', label: 'Free T4', unit: 'ug/dL', referenceRange: '0.8-1.8' },
        { name: 't3', label: 'Free T3', unit: 'ng/dL', referenceRange: '230-420' }
      ]
    },
    'Comprehensive Metabolic Panel': {
      parameters: [
        { name: 'glucose', label: 'Glucose', unit: 'mg/dL', referenceRange: '70-100' },
        { name: 'bun', label: 'BUN', unit: 'mg/dL', referenceRange: '7-20' },
        { name: 'creatinine', label: 'Creatinine', unit: 'mg/dL', referenceRange: '0.6-1.2' },
        { name: 'sodium', label: 'Sodium', unit: 'mEq/L', referenceRange: '136-145' },
        { name: 'potassium', label: 'Potassium', unit: 'mEq/L', referenceRange: '3.5-5.0' }
      ]
    },
    'Cardiac Enzymes': {
      parameters: [
{ name: 'troponin', label: 'Troponin I', unit: 'ng/mL', referenceRange: '<0.04' },
        { name: 'ckMb', label: 'CK-MB', unit: 'ng/mL', referenceRange: '0.0-6.3' },
        { name: 'ldh', label: 'LDH', unit: 'U/L', referenceRange: '140-280' }
      ]
    }
  }

  // Mock uploaded documents data
  const mockDocuments = [
    {
      id: 'DOC001',
      name: 'CBC_Report_JohnSmith.pdf',
      size: '2.3 MB',
      type: 'application/pdf',
      uploadDate: '2024-01-15',
      associatedTest: 'LR001',
      url: '#'
    },
    {
      id: 'DOC002',
      name: 'Thyroid_Scan_MichaelBrown.jpg',
      size: '1.8 MB',
      type: 'image/jpeg',
      uploadDate: '2024-01-15',
      associatedTest: 'LR003',
url: '#'
    }
  ]

  useEffect(() => {
    // Simulate loading lab results and documents
    const timer = setTimeout(() => {
      // Batch state updates to prevent render conflicts
      setResults(mockResults)
      setUploadedDocuments(mockDocuments)
      setSelectedPatients(mockPatients)
      
      // Use a separate timeout for loading state to ensure proper batching
      setTimeout(() => {
        setLoading(false)
        toast.success('Lab results loaded successfully')
      }, 100)
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

  // Form handling functions
  const handleInputChange = (field, value) => {
    // Batch state updates to prevent render conflicts
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing (batched separately)
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleParameterChange = (paramName, value) => {
    setFormData(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [paramName]: value
      }
    }))
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.patientId) {
      errors.patientId = 'Please select a patient'
    }
    
    if (!formData.testType) {
      errors.testType = 'Please select a test type'
    }
    
    if (formData.testType && testConfigurations[formData.testType]) {
      const config = testConfigurations[formData.testType]
      config.parameters.forEach(param => {
        if (!formData.parameters[param.name] || formData.parameters[param.name].trim() === '') {
          errors[param.name] = `${param.label} is required`
        }
      })
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }
const handleSubmitResult = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form')
      return
    }

    setSubmitting(true)
    const patient = selectedPatients.find(p => p.id === formData.patientId)
    const patient = selectedPatients.find(p => p.id === formData.patientId)
    const newResult = {
      id: `LR${String(results.length + 1).padStart(3, '0')}`,
      patientName: patient.name,
      patientId: patient.id,
      testType: formData.testType,
      status: 'completed',
      priority: formData.priority,
      orderDate: new Date().toISOString().split('T')[0],
      completedDate: new Date().toISOString().split('T')[0],
      results: formData.parameters,
      criticalFlags: false,
      doctorOrdered: 'Dr. Lab Tech',
      interpretation: formData.interpretation,
      comments: formData.comments
}

    // Batch all state updates to prevent render conflicts
    setResults(prev => [newResult, ...prev])
// Use setTimeout to ensure state updates are properly batched
    setTimeout(() => {
      resetForm()
      setSubmitting(false)
      toast.success(`Lab results entered successfully for ${patient.name}`)
      setActiveTab('results')
    }, 0)
  }

  const resetForm = () => {
  const resetForm = () => {
    setFormData({
      patientId: '',
      testType: '',
      priority: 'routine',
      parameters: {},
      interpretation: '',
      comments: ''
    })
    setFormErrors({})
  }

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
    const result = results.find(r => r.id === resultId)
    if (!result) {
      toast.error('Result not found')
      return
    }
    
    const newFlagState = !result.criticalFlags
    
    // Update the results state with the new critical flag
    setResults(prev => 
      prev.map(r => 
        r.id === resultId 
          ? { ...r, criticalFlags: newFlagState }
          : r
      )
    )
    
    // Show success message
    const message = newFlagState 
      ? `Flagged ${result.patientName}'s results as critical`
      : `Removed critical flag from ${result.patientName}'s results`
    
    toast.success(message)
  }

  // Document upload handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]
      
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File type not supported: ${file.name}`)
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File too large: ${file.name} (max 10MB)`)
        return
      }

// Simulate upload progress
      const fileId = Date.now() + Math.random()
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))
      
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[fileId] || 0
          if (currentProgress >= 100) {
            clearInterval(uploadInterval)
            
            // Create new document object
            const newDoc = {
              id: `DOC${Date.now()}`,
              name: file.name,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              type: file.type,
              uploadDate: new Date().toISOString().split('T')[0],
              associatedTest: '',
              url: URL.createObjectURL(file)
            }
            
            // Batch state updates to prevent render conflicts
            setTimeout(() => {
              setUploadedDocuments(prev => [...prev, newDoc])
              toast.success(`${file.name} uploaded successfully`)
            }, 0)
            
            return { ...prev, [fileId]: undefined }
          }
          return { ...prev, [fileId]: currentProgress + 10 }
        })
      }, 200)
    })
  }

  const handleDeleteDocument = (docId) => {
    const doc = uploadedDocuments.find(d => d.id === docId)
    if (window.confirm(`Are you sure you want to delete ${doc.name}?`)) {
      setUploadedDocuments(prev => prev.filter(d => d.id !== docId))
      toast.success('Document deleted successfully')
    }
  }

  const handleDownloadDocument = (doc) => {
    toast.success(`Downloading ${doc.name}`)
    // In a real app, this would trigger the actual download
  }

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return 'FileText'
    if (type.includes('image')) return 'Image'
    if (type.includes('word')) return 'FileText'
    if (type.includes('excel') || type.includes('sheet')) return 'FileSpreadsheet'
    return 'File'
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

        {/* Tabbed Interface */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="medical-card"
        >
          <div className="border-b border-surface-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('results')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'results'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <ApperIcon name="FileText" className="w-4 h-4" />
<span>View Results ({filteredResults.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('enter')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'enter'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Plus" className="w-4 h-4" />
                  <span>Enter Results</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'upload'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Upload" className="w-4 h-4" />
                  <span>Upload Documents ({uploadedDocuments.length})</span>
                </div>
              </button>
            </nav>
          </div>

          {activeTab === 'results' ? (
            <>
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
            </>
          ) : activeTab === 'enter' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-surface-900">Enter Lab Results</h3>
                <button
                  onClick={resetForm}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-surface-100 hover:bg-surface-200 text-surface-700 font-medium transition-colors"
                >
                  <ApperIcon name="RotateCcw" className="w-4 h-4" />
                  <span>Reset Form</span>
                </button>
              </div>

              <form onSubmit={handleSubmitResult} className="space-y-6">
                {/* Patient Selection */}
                <div className="medical-grid-2">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Select Patient *
                    </label>
                    <select
                      value={formData.patientId}
                      onChange={(e) => handleInputChange('patientId', e.target.value)}
                      className={`medical-select ${formErrors.patientId ? 'border-red-300 focus:border-red-400' : ''}`}
                    >
                      <option value="">Choose a patient...</option>
                      {selectedPatients.map(patient => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} - {patient.id} ({patient.age}yr, {patient.gender})
                        </option>
                      ))}
                    </select>
                    {formErrors.patientId && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.patientId}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Test Type *
                    </label>
                    <select
                      value={formData.testType}
                      onChange={(e) => {
                        handleInputChange('testType', e.target.value)
                        setFormData(prev => ({ ...prev, parameters: {} }))
                      }}
                      className={`medical-select ${formErrors.testType ? 'border-red-300 focus:border-red-400' : ''}`}
                    >
                      <option value="">Select test type...</option>
                      {Object.keys(testConfigurations).map(testType => (
                        <option key={testType} value={testType}>{testType}</option>
                      ))}
                    </select>
                    {formErrors.testType && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.testType}</p>
                    )}
                  </div>
                </div>

                {/* Priority Selection */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="medical-select max-w-xs"
                  >
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="stat">STAT</option>
                  </select>
                </div>

                {/* Dynamic Test Parameters */}
                {formData.testType && testConfigurations[formData.testType] && (
                  <div>
                    <h4 className="text-lg font-semibold text-surface-900 mb-4">Test Parameters</h4>
                    <div className="medical-grid-2 gap-6">
                      {testConfigurations[formData.testType].parameters.map(param => (
                        <div key={param.name} className="space-y-2">
                          <label className="block text-sm font-medium text-surface-700">
                            {param.label} ({param.unit}) *
                          </label>
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={formData.parameters[param.name] || ''}
                              onChange={(e) => handleParameterChange(param.name, e.target.value)}
                              placeholder={`Enter ${param.label.toLowerCase()}`}
                              className={`medical-input ${formErrors[param.name] ? 'border-red-300 focus:border-red-400' : ''}`}
                            />
                            <p className="text-xs text-surface-500">
                              Reference Range: {param.referenceRange} {param.unit}
                            </p>
                            {formErrors[param.name] && (
                              <p className="text-red-500 text-sm">{formErrors[param.name]}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Result Interpretation */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Clinical Interpretation
                  </label>
                  <select
                    value={formData.interpretation}
                    onChange={(e) => handleInputChange('interpretation', e.target.value)}
                    className="medical-select max-w-md"
                  >
                    <option value="">Select interpretation...</option>
                    <option value="normal">Normal</option>
                    <option value="abnormal">Abnormal</option>
                    <option value="borderline">Borderline</option>
                    <option value="critical">Critical</option>
                    <option value="pending-review">Pending Review</option>
                  </select>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Additional Comments
                  </label>
                  <textarea
                    value={formData.comments}
                    onChange={(e) => handleInputChange('comments', e.target.value)}
                    placeholder="Enter any additional notes or observations..."
                    rows={4}
                    className="medical-input resize-none"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-surface-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center space-x-2 px-6 py-3 rounded-xl border border-surface-300 hover:bg-surface-50 text-surface-700 font-medium transition-colors"
                  >
                    <ApperIcon name="RotateCcw" className="w-4 h-4" />
                    <span>Reset Form</span>
                  </button>
                  
<button
                    type="submit"
                    disabled={submitting}
                    className="medical-button-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ApperIcon name="Save" className="w-4 h-4" />
                    )}
                    <span>{submitting ? 'Submitting...' : 'Submit Results'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Upload Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActive 
                    ? 'border-primary-400 bg-primary-50' 
                    : 'border-surface-300 hover:border-primary-300 hover:bg-surface-50'
                }`}
              >
                <input
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 rounded-full bg-primary-100">
                      <ApperIcon name="Upload" className="w-8 h-8 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-surface-900 mb-2">
                        Drop files here or click to upload
                      </p>
                      <p className="text-sm text-surface-600">
                        Supports: PDF, Images (JPG, PNG, GIF), Word, Excel files
                      </p>
                      <p className="text-xs text-surface-500 mt-1">
                        Maximum file size: 10MB
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Upload Progress */}
              {Object.keys(uploadProgress).length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-surface-900">Uploading Files</h4>
                  {Object.entries(uploadProgress).map(([fileId, progress]) => (
                    progress !== undefined && (
                      <div key={fileId} className="bg-surface-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-surface-700">Uploading...</span>
                          <span className="text-sm font-medium text-surface-900">{progress}%</span>
                        </div>
                        <div className="w-full bg-surface-200 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}

              {/* Document Library */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-surface-900">
                    Uploaded Documents ({uploadedDocuments.length})
                  </h4>
                  <button
                    onClick={() => toast.info('Refreshing document library...')}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-surface-100 hover:bg-surface-200 text-surface-700 text-sm font-medium transition-colors"
                  >
                    <ApperIcon name="RefreshCw" className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                </div>

                {uploadedDocuments.length === 0 ? (
                  <div className="text-center py-8">
                    <ApperIcon name="FileX" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
                    <p className="text-surface-600">No documents uploaded yet</p>
                    <p className="text-sm text-surface-500 mt-1">Upload your first document using the area above</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {uploadedDocuments.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-surface-50 rounded-xl p-4 border border-surface-200 hover:border-primary-300 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg bg-white border border-surface-200">
                            <ApperIcon name={getFileIcon(doc.type)} className="w-6 h-6 text-surface-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-surface-900 truncate">{doc.name}</h5>
                            <p className="text-sm text-surface-600">{doc.size}</p>
                            <p className="text-xs text-surface-500">Uploaded: {doc.uploadDate}</p>
                            {doc.associatedTest && (
                              <p className="text-xs text-primary-600 mt-1">
                                Associated with: {doc.associatedTest}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <select
onChange={(e) => {
                              const testId = e.target.value
                              // Batch state updates to prevent render conflicts
                              setUploadedDocuments(prev => 
                                prev.map(d => 
                                  d.id === doc.id 
                                    ? { ...d, associatedTest: testId }
                                    : d
                                )
                              )
                              // Show toast after state update
                              if (testId) {
                                setTimeout(() => {
                                  toast.success(`Document associated with test ${testId}`)
                                }, 0)
}
                            }}
                            className="text-xs border border-surface-200 rounded-lg px-2 py-1 bg-white"
                          >
                            <option value="">No test selected</option>
                            {results.map(result => (
                              <option key={result.id} value={result.id}>
                                {result.id} - {result.patientName}
                              </option>
                            ))}
                          </select>
                          
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleDownloadDocument(doc)}
                              className="p-1 rounded hover:bg-white transition-colors"
                              title="Download"
                            >
                              <ApperIcon name="Download" className="w-4 h-4 text-surface-600" />
                            </button>
                            <button
                              onClick={() => toast.info(`Viewing ${doc.name}`)}
                              className="p-1 rounded hover:bg-white transition-colors"
                              title="View"
                            >
                              <ApperIcon name="Eye" className="w-4 h-4 text-surface-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="p-1 rounded hover:bg-white transition-colors"
                              title="Delete"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.section>
      </main>
    </div>
  )
}

export default LabResults