import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

const PatientManagement = () => {
  const navigate = useNavigate()
  // State for UI management
  const [activeTab, setActiveTab] = useState('view')
  const [searchTerm, setSearchTerm] = useState('')
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [patients, setPatients] = useState([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1985-06-15',
      gender: 'male',
      phone: '+1 (555) 123-4567',
      email: 'john.doe@email.com',
      address: '123 Main St, Anytown, State 12345',
      emergencyContact: 'Jane Doe',
      emergencyPhone: '+1 (555) 987-6543',
      bloodType: 'O+',
      allergies: 'Penicillin, Shellfish',
      medications: 'Lisinopril 10mg daily',
      medicalHistory: 'Hypertension, Previous surgery: Appendectomy (2018)',
      insurance: 'Blue Cross Blue Shield',
      registeredDate: '2024-01-15'
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Johnson',
      dateOfBirth: '1990-03-22',
      gender: 'female',
      phone: '+1 (555) 234-5678',
      email: 'sarah.johnson@email.com',
      address: '456 Oak Ave, Springfield, State 54321',
      emergencyContact: 'Mike Johnson',
      emergencyPhone: '+1 (555) 876-5432',
      bloodType: 'A-',
      allergies: 'None known',
      medications: 'Multivitamin',
      medicalHistory: 'Diabetes Type 2, managed with diet',
      insurance: 'Aetna',
      registeredDate: '2024-02-03'
    },
    {
      id: 3,
      firstName: 'Michael',
      lastName: 'Brown',
      dateOfBirth: '1978-11-08',
      gender: 'male',
      phone: '+1 (555) 345-6789',
      email: 'michael.brown@email.com',
      address: '789 Pine St, Riverside, State 67890',
      emergencyContact: 'Lisa Brown',
      emergencyPhone: '+1 (555) 765-4321',
      bloodType: 'B+',
      allergies: 'Latex, Aspirin',
      medications: 'Metformin 500mg twice daily',
      medicalHistory: 'Asthma since childhood, well controlled',
      insurance: 'United Healthcare',
      registeredDate: '2024-01-28'
    }
  ])

  // Form data for registration
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    bloodType: '',
    allergies: '',
    medications: '',
    medicalHistory: '',
    insurance: '',
    policyNumber: ''
  })

  // Patient operations
  const handleAddPatient = (newPatientData) => {
    const newPatient = {
      ...newPatientData,
      id: Date.now(),
      registeredDate: new Date().toISOString().split('T')[0]
    }
    setPatients(prev => [...prev, newPatient])
    toast.success('Patient registered successfully!')
  }

  const handleUpdatePatient = (updatedPatient) => {
    setPatients(prev => prev.map(patient => 
      patient.id === updatedPatient.id ? updatedPatient : patient
    ))
    toast.success('Patient information updated successfully!')
  }

  const handleDeletePatient = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      setPatients(prev => prev.filter(patient => patient.id !== patientId))
      toast.success('Patient deleted successfully!')
    }
  }

  // Utility functions
  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  )

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      phone: '',
      email: '',
      address: '',
      emergencyContact: '',
      emergencyPhone: '',
      bloodType: '',
      allergies: '',
      medications: '',
      medicalHistory: '',
      insurance: '',
      policyNumber: ''
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'phone']
    const missingFields = requiredFields.filter(field => !formData[field])
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`)
      return
    }

    handleAddPatient(formData)
    resetForm()
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    handleUpdatePatient(editFormData)
    setShowEditModal(false)
    setSelectedPatient(null)
    setEditFormData({})
  }

  const openViewModal = (patient) => {
    setSelectedPatient(patient)
    setShowViewModal(true)
  }

  const openEditModal = (patient) => {
    setSelectedPatient(patient)
    setEditFormData(patient)
    setShowEditModal(true)
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
                  <p className="text-xs sm:text-sm text-surface-600 hidden sm:block">Patient Management</p>
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
          {/* Tab Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary-100 rounded-xl">
                <ApperIcon name="Users" className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-surface-900">Patient Management</h1>
                <p className="text-surface-600">Manage patient records and registration</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('view')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'view'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                }`}
              >
                View Patients
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'register'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                }`}
              >
                Register Patient
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'view' && (
              <motion.div
                key="view"
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
                      placeholder="Search patients by name, email, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-surface-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Patients List */}
                {filteredPatients.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPatients.map((patient) => (
                      <motion.div
                        key={patient.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="medical-card-compact border border-surface-200 hover:border-primary-200 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center">
                              <span className="text-white font-semibold text-lg">
                                {patient.firstName[0]}{patient.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-surface-900">
                                {patient.firstName} {patient.lastName}
                              </h3>
                              <p className="text-sm text-surface-600">{patient.bloodType || 'Unknown'}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-2 text-sm text-surface-600">
                            <ApperIcon name="Phone" className="w-4 h-4" />
                            <span>{patient.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-surface-600">
                            <ApperIcon name="Mail" className="w-4 h-4" />
                            <span>{patient.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-surface-600">
                            <ApperIcon name="Calendar" className="w-4 h-4" />
                            <span>Registered: {patient.registeredDate}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openViewModal(patient)}
                            className="flex-1 px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors duration-200 text-sm font-medium"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openEditModal(patient)}
                            className="flex-1 px-3 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors duration-200 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePatient(patient.id)}
                            className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 text-sm font-medium"
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ApperIcon name="Users" className="w-8 h-8 text-surface-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 mb-2">
                      {searchTerm ? 'No patients found' : 'No patients registered'}
                    </h3>
                    <p className="text-surface-600 mb-4">
                      {searchTerm 
                        ? 'Try adjusting your search terms' 
                        : 'Register your first patient to get started'
                      }
                    </p>
                    {!searchTerm && (
                      <button
                        onClick={() => setActiveTab('register')}
                        className="medical-button-primary"
                      >
                        Register Patient
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-surface-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="medical-input"
                          placeholder="Enter first name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="medical-input"
                          placeholder="Enter last name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Date of Birth *
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          className="medical-input"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Gender *
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="medical-select"
                          required
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-surface-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="medical-input"
                          placeholder="Enter phone number"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="medical-input"
                          placeholder="Enter email address"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Address
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="medical-input"
                          rows="3"
                          placeholder="Enter full address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h3 className="text-lg font-semibold text-surface-900 mb-4">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Emergency Contact Name
                        </label>
                        <input
                          type="text"
                          name="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={handleInputChange}
                          className="medical-input"
                          placeholder="Enter emergency contact name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Emergency Contact Phone
                        </label>
                        <input
                          type="tel"
                          name="emergencyPhone"
                          value={formData.emergencyPhone}
                          onChange={handleInputChange}
                          className="medical-input"
                          placeholder="Enter emergency contact phone"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-surface-900 mb-4">Medical Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Blood Type
                        </label>
                        <select
                          name="bloodType"
                          value={formData.bloodType}
                          onChange={handleInputChange}
                          className="medical-select"
                        >
                          <option value="">Select blood type</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Insurance Provider
                        </label>
                        <input
                          type="text"
                          name="insurance"
                          value={formData.insurance}
                          onChange={handleInputChange}
                          className="medical-input"
                          placeholder="Enter insurance provider"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Known Allergies
                        </label>
                        <textarea
                          name="allergies"
                          value={formData.allergies}
                          onChange={handleInputChange}
                          className="medical-input"
                          rows="3"
                          placeholder="List any known allergies"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Current Medications
                        </label>
                        <textarea
                          name="medications"
                          value={formData.medications}
                          onChange={handleInputChange}
                          className="medical-input"
                          rows="3"
                          placeholder="List current medications"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Medical History
                        </label>
                        <textarea
                          name="medicalHistory"
                          value={formData.medicalHistory}
                          onChange={handleInputChange}
                          className="medical-input"
                          rows="4"
                          placeholder="Enter relevant medical history"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 rounded-xl border-2 border-surface-300 text-surface-700 font-medium hover:bg-surface-50 transition-colors"
                    >
                      Clear Form
                    </button>
                    <button
                      type="submit"
                      className="medical-button-primary"
                    >
                      Register Patient
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* View Patient Modal */}
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
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-surface-900">
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </h2>
                      <p className="text-surface-600">Patient Details</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Date of Birth</label>
                      <p className="text-surface-900">{selectedPatient.dateOfBirth}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Gender</label>
                      <p className="text-surface-900 capitalize">{selectedPatient.gender}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Phone</label>
                      <p className="text-surface-900">{selectedPatient.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Email</label>
                      <p className="text-surface-900">{selectedPatient.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Blood Type</label>
                      <p className="text-surface-900">{selectedPatient.bloodType || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Insurance</label>
                      <p className="text-surface-900">{selectedPatient.insurance || 'Not specified'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Address</label>
                    <p className="text-surface-900">{selectedPatient.address || 'Not provided'}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Emergency Contact</label>
                      <p className="text-surface-900">{selectedPatient.emergencyContact || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Emergency Phone</label>
                      <p className="text-surface-900">{selectedPatient.emergencyPhone || 'Not provided'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Known Allergies</label>
                    <p className="text-surface-900">{selectedPatient.allergies || 'None known'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Current Medications</label>
                    <p className="text-surface-900">{selectedPatient.medications || 'None listed'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Medical History</label>
                    <p className="text-surface-900">{selectedPatient.medicalHistory || 'No history recorded'}</p>
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
                      openEditModal(selectedPatient)
                    }}
                    className="medical-button-primary"
                  >
                    Edit Patient
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Patient Modal */}
      <AnimatePresence>
        {showEditModal && selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
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
                  <h2 className="text-2xl font-bold text-surface-900">Edit Patient Information</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-surface-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={editFormData.firstName || ''}
                          onChange={handleEditInputChange}
                          className="medical-input"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={editFormData.lastName || ''}
                          onChange={handleEditInputChange}
                          className="medical-input"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">Date of Birth *</label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={editFormData.dateOfBirth || ''}
                          onChange={handleEditInputChange}
                          className="medical-input"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">Gender *</label>
                        <select
                          name="gender"
                          value={editFormData.gender || ''}
                          onChange={handleEditInputChange}
                          className="medical-select"
                          required
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-surface-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={editFormData.phone || ''}
                          onChange={handleEditInputChange}
                          className="medical-input"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={editFormData.email || ''}
                          onChange={handleEditInputChange}
                          className="medical-input"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-surface-700 mb-2">Address</label>
                        <textarea
                          name="address"
                          value={editFormData.address || ''}
                          onChange={handleEditInputChange}
                          className="medical-input"
                          rows="3"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-surface-900 mb-4">Medical Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">Blood Type</label>
                        <select
                          name="bloodType"
                          value={editFormData.bloodType || ''}
                          onChange={handleEditInputChange}
                          className="medical-select"
                        >
                          <option value="">Select blood type</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">Insurance Provider</label>
                        <input
                          type="text"
                          name="insurance"
                          value={editFormData.insurance || ''}
                          onChange={handleEditInputChange}
                          className="medical-input"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-surface-700 mb-2">Known Allergies</label>
                        <textarea
                          name="allergies"
                          value={editFormData.allergies || ''}
                          onChange={handleEditInputChange}
                          className="medical-input"
                          rows="3"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-surface-700 mb-2">Current Medications</label>
                        <textarea
                          name="medications"
                          value={editFormData.medications || ''}
                          onChange={handleEditInputChange}
                          className="medical-input"
                          rows="3"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-surface-700 mb-2">Medical History</label>
                        <textarea
                          name="medicalHistory"
                          value={editFormData.medicalHistory || ''}
                          onChange={handleEditInputChange}
                          className="medical-input"
                          rows="4"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-surface-200">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-6 py-3 rounded-xl border-2 border-surface-300 text-surface-700 font-medium hover:bg-surface-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="medical-button-primary"
                    >
                      Update Patient
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PatientManagement