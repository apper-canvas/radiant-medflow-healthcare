import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import patientService from '../services/patientService'

const TreatmentTracking = () => {
  const navigate = useNavigate()
const [activeTab, setActiveTab] = useState('records')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showProgressModal, setShowProgressModal] = useState(false)
  // Data states
  const [patients, setPatients] = useState([])
  const [treatmentRecords, setTreatmentRecords] = useState([])
  const [loading, setLoading] = useState(false)
  // Load data on component mount
  useEffect(() => {
    loadPatients()
    loadTreatmentRecords()
  }, [])

  const loadPatients = async () => {
    setLoading(true)
    try {
      const data = await patientService.fetchPatients()
      // Format patient data for treatment tracking
      const formattedPatients = data.map(patient => ({
        id: patient.Id,
        name: `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || patient.Name,
        age: patient.date_of_birth ? new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear() : 'Unknown',
        gender: patient.gender || 'Unknown',
        bloodType: patient.blood_type || 'Unknown',
        phone: patient.phone || '',
        email: patient.email || ''
      }))
      setPatients(formattedPatients)
    } catch (error) {
      console.error('Error loading patients:', error)
      toast.error('Failed to load patients')
    } finally {
      setLoading(false)
    }
  }

  const loadTreatmentRecords = async () => {
    // Treatment records would come from a separate treatment service
    // For now, keeping empty to remove hardcoded data
    setTreatmentRecords([])
  }

  // Form states
  const [diagnosisForm, setDiagnosisForm] = useState({
    patientId: '',
    diagnosis: '',
    icdCode: '',
    severity: '',
    treatingPhysician: '',
    department: '',
    notes: ''
  })

  const [treatmentForm, setTreatmentForm] = useState({
    recordId: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
    procedures: '',
    followUpDate: '',
    notes: ''
  })

  const [progressForm, setProgressForm] = useState({
    recordId: '',
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: '',
      height: ''
    },
    symptoms: '',
    response: '',
    notes: '',
    nextVisit: ''
  })

  const departments = [
    'Cardiology', 'Endocrinology', 'Neurology', 'Orthopedics',
    'Dermatology', 'Gastroenterology', 'Pulmonology', 'Oncology'
  ]

  const severityLevels = ['Mild', 'Moderate', 'Severe', 'Critical']

  // Utility functions
  const filteredRecords = treatmentRecords.filter(record =>
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.icdCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-secondary-100 text-secondary-800'
      case 'Resolved': return 'bg-green-100 text-green-800'
      case 'Monitoring': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-surface-100 text-surface-800'
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Mild': return 'bg-green-100 text-green-800'
      case 'Moderate': return 'bg-yellow-100 text-yellow-800'
      case 'Severe': return 'bg-orange-100 text-orange-800'
      case 'Critical': return 'bg-red-100 text-red-800'
      default: return 'bg-surface-100 text-surface-800'
    }
  }

  // Form handlers
  const handleDiagnosisSubmit = (e) => {
    e.preventDefault()
    
    if (!diagnosisForm.patientId || !diagnosisForm.diagnosis) {
      toast.error('Please fill in all required fields')
      return
    }

    const selectedPatientData = patients.find(p => p.id === diagnosisForm.patientId)
    const newRecord = {
      id: `TR${String(treatmentRecords.length + 1).padStart(3, '0')}`,
      patientId: diagnosisForm.patientId,
      patientName: selectedPatientData?.name || '',
      diagnosis: diagnosisForm.diagnosis,
      icdCode: diagnosisForm.icdCode,
      diagnosisDate: new Date().toISOString().split('T')[0],
      severity: diagnosisForm.severity,
      status: 'Active',
      treatingPhysician: diagnosisForm.treatingPhysician,
      department: diagnosisForm.department,
      lastUpdated: new Date().toISOString().split('T')[0],
      medications: [],
      progressNotes: [{
        date: new Date().toISOString().split('T')[0],
        note: diagnosisForm.notes || 'Initial diagnosis recorded',
        physician: diagnosisForm.treatingPhysician
      }]
    }

    setTreatmentRecords(prev => [...prev, newRecord])
    toast.success('Diagnosis recorded successfully!')
    
    // Reset form
    setDiagnosisForm({
      patientId: '',
      diagnosis: '',
      icdCode: '',
      severity: '',
      treatingPhysician: '',
      department: '',
      notes: ''
    })
  }

  const handleTreatmentSubmit = (e) => {
    e.preventDefault()
    
    if (!treatmentForm.recordId) {
      toast.error('Please select a treatment record')
      return
    }

    // Update the treatment record with new medications
    setTreatmentRecords(prev => prev.map(record => {
      if (record.id === treatmentForm.recordId) {
        const validMedications = treatmentForm.medications.filter(med => med.name && med.dosage)
        return {
          ...record,
          medications: [...record.medications, ...validMedications.map(med => ({
            ...med,
            startDate: new Date().toISOString().split('T')[0]
          }))],
          lastUpdated: new Date().toISOString().split('T')[0]
        }
      }
      return record
    }))

    toast.success('Treatment plan updated successfully!')
    
    // Reset form
    setTreatmentForm({
      recordId: '',
      medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
      procedures: '',
      followUpDate: '',
      notes: ''
    })
  }

  const handleProgressSubmit = (e) => {
    e.preventDefault()
    
    if (!progressForm.recordId) {
      toast.error('Please select a treatment record')
      return
    }

    // Add progress note to the treatment record
    setTreatmentRecords(prev => prev.map(record => {
      if (record.id === progressForm.recordId) {
        const newNote = {
          date: new Date().toISOString().split('T')[0],
          note: `Progress Update: ${progressForm.response}. Symptoms: ${progressForm.symptoms}. ${progressForm.notes}`,
          physician: 'Current User', // In real app, this would be the logged-in physician
          vitalSigns: progressForm.vitalSigns
        }
        return {
          ...record,
          progressNotes: [newNote, ...record.progressNotes],
          lastUpdated: new Date().toISOString().split('T')[0]
        }
      }
      return record
    }))

    toast.success('Progress note added successfully!')
    
    // Reset form
    setProgressForm({
      recordId: '',
      vitalSigns: {
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        weight: '',
        height: ''
      },
      symptoms: '',
      response: '',
      notes: '',
      nextVisit: ''
    })
  }

  const addMedication = () => {
    setTreatmentForm(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', duration: '' }]
    }))
  }

  const removeMedication = (index) => {
    setTreatmentForm(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }))
  }

  const updateMedication = (index, field, value) => {
    setTreatmentForm(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }))
  }

  const openViewModal = (record) => {
    setSelectedPatient(record)
    setShowViewModal(true)
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
              <button 
                onClick={() => navigate('/')}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
                  <ApperIcon name="Stethoscope" className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gradient">MedFlow</h1>
                  <p className="text-xs sm:text-sm text-surface-600 hidden sm:block">Treatment & Diagnosis</p>
                </div>
              </button>
            </div>
            
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-surface-100 hover:bg-surface-200 text-surface-700 font-medium transition-all duration-200"
            >
              <ApperIcon name="Home" className="w-4 h-4" />
              <span className="text-sm">Dashboard</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="medical-card"
        >
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary-100 rounded-xl">
                <ApperIcon name="FileText" className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-surface-900">Treatment & Diagnosis Tracking</h1>
                <p className="text-surface-600">Manage patient diagnoses, treatments, and progress</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap space-x-2 mb-6 border-b border-surface-200">
            {[
              { id: 'records', label: 'Patient Records', icon: 'Users' },
              { id: 'diagnosis', label: 'Add Diagnosis', icon: 'FilePlus' },
              { id: 'treatment', label: 'Treatment Plans', icon: 'Pill' },
              { id: 'progress', label: 'Progress Tracking', icon: 'TrendingUp' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 font-medium transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 bg-primary-50/50'
                    : 'border-transparent text-surface-700 hover:text-surface-900 hover:border-surface-300'
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {/* Patient Records Tab */}
            {activeTab === 'records' && (
              <motion.div
                key="records"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                    <input
                      type="text"
                      placeholder="Search by patient name, diagnosis, or ICD code..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-surface-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Records List */}
                {filteredRecords.length > 0 ? (
                  <div className="space-y-4">
                    {filteredRecords.map((record) => (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="medical-card-compact border border-surface-200 hover:border-primary-200 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center">
                                <ApperIcon name="User" className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="font-semibold text-surface-900">{record.patientName}</h3>
                                  <span className="text-sm text-surface-600">({record.patientId})</span>
                                  <span className={`medical-badge ${getStatusColor(record.status)}`}>
                                    {record.status}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                                  <div>
                                    <span className="text-sm font-medium text-surface-700">Diagnosis:</span>
                                    <p className="text-sm text-surface-900">{record.diagnosis}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-surface-700">ICD Code:</span>
                                    <p className="text-sm text-surface-900">{record.icdCode}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-surface-700">Severity:</span>
                                    <span className={`medical-badge ${getSeverityColor(record.severity)} ml-2`}>
                                      {record.severity}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-surface-700">Department:</span>
                                    <p className="text-sm text-surface-900">{record.department}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-surface-600">
                                  <div className="flex items-center space-x-1">
                                    <ApperIcon name="Calendar" className="w-4 h-4" />
                                    <span>Diagnosed: {record.diagnosisDate}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <ApperIcon name="User" className="w-4 h-4" />
                                    <span>{record.treatingPhysician}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2 ml-4">
                            <button
                              onClick={() => openViewModal(record)}
                              className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors duration-200 text-sm font-medium"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                setProgressForm(prev => ({ ...prev, recordId: record.id }))
                                setActiveTab('progress')
                              }}
                              className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors duration-200 text-sm font-medium"
                            >
                              Add Progress
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ApperIcon name="FileText" className="w-8 h-8 text-surface-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 mb-2">
                      {searchTerm ? 'No records found' : 'No treatment records'}
                    </h3>
                    <p className="text-surface-600 mb-4">
                      {searchTerm 
                        ? 'Try adjusting your search terms' 
                        : 'Add your first diagnosis to get started'
                      }
                    </p>
                    {!searchTerm && (
                      <button
                        onClick={() => setActiveTab('diagnosis')}
                        className="medical-button-primary"
                      >
                        Add Diagnosis
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Add Diagnosis Tab */}
            {activeTab === 'diagnosis' && (
              <motion.div
                key="diagnosis"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleDiagnosisSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Patient *
                      </label>
                      <select
                        value={diagnosisForm.patientId}
                        onChange={(e) => setDiagnosisForm(prev => ({ ...prev, patientId: e.target.value }))}
                        className="medical-select"
                        required
                      >
                        <option value="">Select patient</option>
                        {patients.map(patient => (
                          <option key={patient.id} value={patient.id}>
                            {patient.name} ({patient.id})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Treating Physician *
                      </label>
                      <input
                        type="text"
                        value={diagnosisForm.treatingPhysician}
                        onChange={(e) => setDiagnosisForm(prev => ({ ...prev, treatingPhysician: e.target.value }))}
                        className="medical-input"
                        placeholder="Enter physician name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Diagnosis *
                      </label>
                      <input
                        type="text"
                        value={diagnosisForm.diagnosis}
                        onChange={(e) => setDiagnosisForm(prev => ({ ...prev, diagnosis: e.target.value }))}
                        className="medical-input"
                        placeholder="Enter diagnosis"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        ICD Code
                      </label>
                      <input
                        type="text"
                        value={diagnosisForm.icdCode}
                        onChange={(e) => setDiagnosisForm(prev => ({ ...prev, icdCode: e.target.value }))}
                        className="medical-input"
                        placeholder="Enter ICD-10 code"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Severity
                      </label>
                      <select
                        value={diagnosisForm.severity}
                        onChange={(e) => setDiagnosisForm(prev => ({ ...prev, severity: e.target.value }))}
                        className="medical-select"
                      >
                        <option value="">Select severity</option>
                        {severityLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Department
                      </label>
                      <select
                        value={diagnosisForm.department}
                        onChange={(e) => setDiagnosisForm(prev => ({ ...prev, department: e.target.value }))}
                        className="medical-select"
                      >
                        <option value="">Select department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Initial Notes
                    </label>
                    <textarea
                      value={diagnosisForm.notes}
                      onChange={(e) => setDiagnosisForm(prev => ({ ...prev, notes: e.target.value }))}
                      className="medical-input"
                      rows="4"
                      placeholder="Enter initial diagnosis notes, symptoms, examination findings..."
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setDiagnosisForm({
                        patientId: '',
                        diagnosis: '',
                        icdCode: '',
                        severity: '',
                        treatingPhysician: '',
                        department: '',
                        notes: ''
                      })}
                      className="px-6 py-3 rounded-xl border-2 border-surface-300 text-surface-700 font-medium hover:bg-surface-50 transition-colors"
                    >
                      Clear Form
                    </button>
                    <button
                      type="submit"
                      className="medical-button-primary"
                    >
                      Record Diagnosis
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Treatment Plans Tab */}
            {activeTab === 'treatment' && (
              <motion.div
                key="treatment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleTreatmentSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Treatment Record *
                    </label>
                    <select
                      value={treatmentForm.recordId}
                      onChange={(e) => setTreatmentForm(prev => ({ ...prev, recordId: e.target.value }))}
                      className="medical-select"
                      required
                    >
                      <option value="">Select treatment record</option>
                      {treatmentRecords.map(record => (
                        <option key={record.id} value={record.id}>
                          {record.patientName} - {record.diagnosis} ({record.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-surface-900">Medications</h3>
                      <button
                        type="button"
                        onClick={addMedication}
                        className="flex items-center space-x-2 px-3 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
                      >
                        <ApperIcon name="Plus" className="w-4 h-4" />
                        <span>Add Medication</span>
                      </button>
                    </div>
                    
                    {treatmentForm.medications.map((medication, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-surface-50 rounded-xl">
                        <div>
                          <label className="block text-sm font-medium text-surface-700 mb-1">
                            Medication Name
                          </label>
                          <input
                            type="text"
                            value={medication.name}
                            onChange={(e) => updateMedication(index, 'name', e.target.value)}
                            className="medical-input"
                            placeholder="Enter medication name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-surface-700 mb-1">
                            Dosage
                          </label>
                          <input
                            type="text"
                            value={medication.dosage}
                            onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                            className="medical-input"
                            placeholder="e.g., 10mg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-surface-700 mb-1">
                            Frequency
                          </label>
                          <input
                            type="text"
                            value={medication.frequency}
                            onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                            className="medical-input"
                            placeholder="e.g., Twice daily"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removeMedication(index)}
                            className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Procedures/Instructions
                    </label>
                    <textarea
                      value={treatmentForm.procedures}
                      onChange={(e) => setTreatmentForm(prev => ({ ...prev, procedures: e.target.value }))}
                      className="medical-input"
                      rows="4"
                      placeholder="Enter treatment procedures, lifestyle recommendations, instructions..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Follow-up Date
                      </label>
                      <input
                        type="date"
                        value={treatmentForm.followUpDate}
                        onChange={(e) => setTreatmentForm(prev => ({ ...prev, followUpDate: e.target.value }))}
                        className="medical-input"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        value={treatmentForm.notes}
                        onChange={(e) => setTreatmentForm(prev => ({ ...prev, notes: e.target.value }))}
                        className="medical-input"
                        rows="3"
                        placeholder="Additional treatment notes..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setTreatmentForm({
                        recordId: '',
                        medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
                        procedures: '',
                        followUpDate: '',
                        notes: ''
                      })}
                      className="px-6 py-3 rounded-xl border-2 border-surface-300 text-surface-700 font-medium hover:bg-surface-50 transition-colors"
                    >
                      Clear Form
                    </button>
                    <button
                      type="submit"
                      className="medical-button-primary"
                    >
                      Update Treatment Plan
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Progress Tracking Tab */}
            {activeTab === 'progress' && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleProgressSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Treatment Record *
                    </label>
                    <select
                      value={progressForm.recordId}
                      onChange={(e) => setProgressForm(prev => ({ ...prev, recordId: e.target.value }))}
                      className="medical-select"
                      required
                    >
                      <option value="">Select treatment record</option>
                      {treatmentRecords.map(record => (
                        <option key={record.id} value={record.id}>
                          {record.patientName} - {record.diagnosis} ({record.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-surface-900 mb-4">Vital Signs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">
                          Blood Pressure
                        </label>
                        <input
                          type="text"
                          value={progressForm.vitalSigns.bloodPressure}
                          onChange={(e) => setProgressForm(prev => ({
                            ...prev,
                            vitalSigns: { ...prev.vitalSigns, bloodPressure: e.target.value }
                          }))}
                          className="medical-input"
                          placeholder="e.g., 120/80"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">
                          Heart Rate (bpm)
                        </label>
                        <input
                          type="number"
                          value={progressForm.vitalSigns.heartRate}
                          onChange={(e) => setProgressForm(prev => ({
                            ...prev,
                            vitalSigns: { ...prev.vitalSigns, heartRate: e.target.value }
                          }))}
                          className="medical-input"
                          placeholder="e.g., 72"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">
                          Temperature (°F)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={progressForm.vitalSigns.temperature}
                          onChange={(e) => setProgressForm(prev => ({
                            ...prev,
                            vitalSigns: { ...prev.vitalSigns, temperature: e.target.value }
                          }))}
                          className="medical-input"
                          placeholder="e.g., 98.6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Current Symptoms
                      </label>
                      <textarea
                        value={progressForm.symptoms}
                        onChange={(e) => setProgressForm(prev => ({ ...prev, symptoms: e.target.value }))}
                        className="medical-input"
                        rows="4"
                        placeholder="Describe current symptoms or patient complaints..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Treatment Response
                      </label>
                      <textarea
                        value={progressForm.response}
                        onChange={(e) => setProgressForm(prev => ({ ...prev, response: e.target.value }))}
                        className="medical-input"
                        rows="4"
                        placeholder="How is the patient responding to treatment..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Progress Notes
                      </label>
                      <textarea
                        value={progressForm.notes}
                        onChange={(e) => setProgressForm(prev => ({ ...prev, notes: e.target.value }))}
                        className="medical-input"
                        rows="4"
                        placeholder="Additional progress notes, observations, recommendations..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Next Visit Date
                      </label>
                      <input
                        type="date"
                        value={progressForm.nextVisit}
                        onChange={(e) => setProgressForm(prev => ({ ...prev, nextVisit: e.target.value }))}
                        className="medical-input"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setProgressForm({
                        recordId: '',
                        vitalSigns: {
                          bloodPressure: '',
                          heartRate: '',
                          temperature: '',
                          weight: '',
                          height: ''
                        },
                        symptoms: '',
                        response: '',
                        notes: '',
                        nextVisit: ''
                      })}
                      className="px-6 py-3 rounded-xl border-2 border-surface-300 text-surface-700 font-medium hover:bg-surface-50 transition-colors"
                    >
                      Clear Form
                    </button>
                    <button
                      type="submit"
                      className="medical-button-primary"
                    >
                      Add Progress Note
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* View Details Modal */}
      <AnimatePresence>
        {showViewModal && selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center">
                      <ApperIcon name="User" className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-surface-900">{selectedPatient.patientName}</h2>
                      <p className="text-surface-600">Treatment Record Details</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Diagnosis Information */}
                  <div className="bg-surface-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-surface-900 mb-3">Diagnosis Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Diagnosis</label>
                        <p className="text-surface-900">{selectedPatient.diagnosis}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">ICD Code</label>
                        <p className="text-surface-900">{selectedPatient.icdCode}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Severity</label>
                        <span className={`medical-badge ${getSeverityColor(selectedPatient.severity)}`}>
                          {selectedPatient.severity}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Status</label>
                        <span className={`medical-badge ${getStatusColor(selectedPatient.status)}`}>
                          {selectedPatient.status}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Treating Physician</label>
                        <p className="text-surface-900">{selectedPatient.treatingPhysician}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Department</label>
                        <p className="text-surface-900">{selectedPatient.department}</p>
                      </div>
                    </div>
                  </div>

                  {/* Current Medications */}
                  <div>
                    <h3 className="text-lg font-semibold text-surface-900 mb-3">Current Medications</h3>
                    {selectedPatient.medications && selectedPatient.medications.length > 0 ? (
                      <div className="space-y-2">
                        {selectedPatient.medications.map((med, index) => (
                          <div key={index} className="bg-surface-50 rounded-lg p-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <div>
                                <span className="text-sm font-medium text-surface-700">Medication:</span>
                                <p className="text-surface-900">{med.name}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-surface-700">Dosage:</span>
                                <p className="text-surface-900">{med.dosage}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-surface-700">Frequency:</span>
                                <p className="text-surface-900">{med.frequency}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-surface-600">No medications recorded</p>
                    )}
                  </div>

                  {/* Progress Notes */}
                  <div>
                    <h3 className="text-lg font-semibold text-surface-900 mb-3">Progress Notes</h3>
                    {selectedPatient.progressNotes && selectedPatient.progressNotes.length > 0 ? (
                      <div className="space-y-3">
                        {selectedPatient.progressNotes.map((note, index) => (
                          <div key={index} className="bg-surface-50 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <span className="text-sm font-medium text-surface-700">{note.date}</span>
                              <span className="text-sm text-surface-600">{note.physician}</span>
                            </div>
                            <p className="text-surface-900">{note.note}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-surface-600">No progress notes recorded</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-surface-200">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-4 py-2 rounded-xl bg-surface-100 text-surface-700 hover:bg-surface-200 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowViewModal(false)
                      setProgressForm(prev => ({ ...prev, recordId: selectedPatient.id }))
                      setActiveTab('progress')
                    }}
                    className="medical-button-primary"
                  >
                    Add Progress Note
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TreatmentTracking