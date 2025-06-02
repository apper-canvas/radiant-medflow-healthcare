import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [activeTab, setActiveTab] = useState('patient')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [patientForm, setPatientForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    emergencyContact: '',
    insuranceProvider: '',
    medicalHistory: ''
  })

  const [appointmentForm, setAppointmentForm] = useState({
    patientName: '',
    doctorName: '',
    department: '',
    appointmentDate: '',
    appointmentTime: '',
    appointmentType: '',
    notes: ''
  })

  const [patients] = useState([
    {
      id: 'P001',
      name: 'Sarah Johnson',
      age: 34,
      department: 'Cardiology',
      status: 'Active',
      lastVisit: '2024-01-15',
      priority: 'normal'
    },
    {
      id: 'P002',
      name: 'Michael Chen',
      age: 67,
      department: 'Neurology',
      status: 'Critical',
      lastVisit: '2024-01-16',
      priority: 'urgent'
    },
    {
      id: 'P003',
      name: 'Emma Williams',
      age: 28,
      department: 'Dermatology',
      status: 'Scheduled',
      lastVisit: '2024-01-10',
      priority: 'normal'
    },
    {
      id: 'P004',
      name: 'Robert Davis',
      age: 45,
      department: 'Orthopedics',
      status: 'Active',
      lastVisit: '2024-01-14',
      priority: 'normal'
    }
  ])

  const [appointments] = useState([
    {
      id: 'A001',
      patient: 'Sarah Johnson',
      doctor: 'Dr. Smith',
      time: '09:00',
      department: 'Cardiology',
      status: 'Confirmed'
    },
    {
      id: 'A002',
      patient: 'Michael Chen',
      doctor: 'Dr. Brown',
      time: '10:30',
      department: 'Neurology',
      status: 'Pending'
    },
    {
      id: 'A003',
      patient: 'Emma Williams',
      doctor: 'Dr. Wilson',
      time: '14:00',
      department: 'Dermatology',
      status: 'Confirmed'
    }
  ])

  const tabs = [
    {
      id: 'patient',
      name: 'Patient Management',
      icon: 'Users',
      color: 'primary'
    },
    {
      id: 'appointment',
      name: 'Appointments',
      icon: 'Calendar',
      color: 'secondary'
    },
    {
      id: 'search',
      name: 'Search Records',
      icon: 'Search',
      color: 'purple'
    }
  ]

  const departments = [
    'Cardiology', 'Neurology', 'Dermatology', 'Orthopedics', 
    'Pediatrics', 'Emergency', 'Radiology', 'Laboratory'
  ]

  const appointmentTypes = [
    'Consultation', 'Follow-up', 'Emergency', 'Surgery', 
    'Diagnostic', 'Therapy', 'Vaccination'
  ]

  const handlePatientSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!patientForm.firstName || !patientForm.lastName || !patientForm.email || !patientForm.phone) {
      toast.error('Please fill in all required fields')
      return
    }

    // Simulate patient registration
    const newPatientId = `P${String(patients.length + 1).padStart(3, '0')}`
    
    toast.success(`Patient ${patientForm.firstName} ${patientForm.lastName} registered successfully! ID: ${newPatientId}`)
    
    // Reset form
    setPatientForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      emergencyContact: '',
      insuranceProvider: '',
      medicalHistory: ''
    })
  }

  const handleAppointmentSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!appointmentForm.patientName || !appointmentForm.doctorName || !appointmentForm.appointmentDate || !appointmentForm.appointmentTime) {
      toast.error('Please fill in all required fields')
      return
    }

    // Simulate appointment scheduling
    const newAppointmentId = `A${String(appointments.length + 1).padStart(3, '0')}`
    
    toast.success(`Appointment scheduled successfully! ID: ${newAppointmentId}`)
    
    // Reset form
    setAppointmentForm({
      patientName: '',
      doctorName: '',
      department: '',
      appointmentDate: '',
      appointmentTime: '',
      appointmentType: '',
      notes: ''
    })
  }

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredAppointments = appointments.filter(appointment =>
    appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="medical-card">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 p-1 bg-surface-100 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 flex-1 sm:flex-none ${
              activeTab === tab.id
                ? `bg-white shadow-md ${
                    tab.color === 'primary' ? 'text-primary-600' :
                    tab.color === 'secondary' ? 'text-secondary-600' :
                    'text-purple-600'
                  }`
                : 'text-surface-600 hover:text-surface-800 hover:bg-surface-50'
            }`}
          >
            <ApperIcon 
              name={tab.icon} 
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                activeTab === tab.id
                  ? tab.color === 'primary' ? 'text-primary-600' :
                    tab.color === 'secondary' ? 'text-secondary-600' :
                    'text-purple-600'
                  : 'text-surface-500'
              }`} 
            />
            <span className="text-sm sm:text-base hidden sm:inline">{tab.name}</span>
            <span className="text-xs sm:hidden">{tab.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Patient Management Tab */}
        {activeTab === 'patient' && (
          <motion.div
            key="patient"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-surface-900 mb-6 flex items-center">
              <ApperIcon name="UserPlus" className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary-600" />
              Register New Patient
            </h3>

            <form onSubmit={handlePatientSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={patientForm.firstName}
                    onChange={(e) => setPatientForm(prev => ({ ...prev, firstName: e.target.value }))}
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
                    value={patientForm.lastName}
                    onChange={(e) => setPatientForm(prev => ({ ...prev, lastName: e.target.value }))}
                    className="medical-input"
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={patientForm.email}
                    onChange={(e) => setPatientForm(prev => ({ ...prev, email: e.target.value }))}
                    className="medical-input"
                    placeholder="patient@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={patientForm.phone}
                    onChange={(e) => setPatientForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="medical-input"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={patientForm.dateOfBirth}
                    onChange={(e) => setPatientForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="medical-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={patientForm.gender}
                    onChange={(e) => setPatientForm(prev => ({ ...prev, gender: e.target.value }))}
                    className="medical-select"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Emergency Contact
                  </label>
                  <input
                    type="tel"
                    value={patientForm.emergencyContact}
                    onChange={(e) => setPatientForm(prev => ({ ...prev, emergencyContact: e.target.value }))}
                    className="medical-input"
                    placeholder="Emergency contact"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Insurance Provider
                </label>
                <input
                  type="text"
                  value={patientForm.insuranceProvider}
                  onChange={(e) => setPatientForm(prev => ({ ...prev, insuranceProvider: e.target.value }))}
                  className="medical-input"
                  placeholder="Insurance provider name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Medical History
                </label>
                <textarea
                  value={patientForm.medicalHistory}
                  onChange={(e) => setPatientForm(prev => ({ ...prev, medicalHistory: e.target.value }))}
                  rows={4}
                  className="medical-input resize-none"
                  placeholder="Brief medical history, allergies, current medications..."
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="medical-button-primary w-full sm:w-auto"
              >
                Register Patient
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointment' && (
          <motion.div
            key="appointment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-surface-900 mb-6 flex items-center">
              <ApperIcon name="CalendarPlus" className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-secondary-600" />
              Schedule Appointment
            </h3>

            <form onSubmit={handleAppointmentSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    value={appointmentForm.patientName}
                    onChange={(e) => setAppointmentForm(prev => ({ ...prev, patientName: e.target.value }))}
                    className="medical-input"
                    placeholder="Enter patient name or ID"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Doctor Name *
                  </label>
                  <input
                    type="text"
                    value={appointmentForm.doctorName}
                    onChange={(e) => setAppointmentForm(prev => ({ ...prev, doctorName: e.target.value }))}
                    className="medical-input"
                    placeholder="Select or enter doctor name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Department
                  </label>
                  <select
                    value={appointmentForm.department}
                    onChange={(e) => setAppointmentForm(prev => ({ ...prev, department: e.target.value }))}
                    className="medical-select"
                  >
                    <option value="">Select department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Appointment Type
                  </label>
                  <select
                    value={appointmentForm.appointmentType}
                    onChange={(e) => setAppointmentForm(prev => ({ ...prev, appointmentType: e.target.value }))}
                    className="medical-select"
                  >
                    <option value="">Select type</option>
                    {appointmentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={appointmentForm.appointmentDate}
                    onChange={(e) => setAppointmentForm(prev => ({ ...prev, appointmentDate: e.target.value }))}
                    className="medical-input"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={appointmentForm.appointmentTime}
                    onChange={(e) => setAppointmentForm(prev => ({ ...prev, appointmentTime: e.target.value }))}
                    className="medical-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={appointmentForm.notes}
                  onChange={(e) => setAppointmentForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="medical-input resize-none"
                  placeholder="Additional notes or special requirements..."
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="medical-button-secondary w-full sm:w-auto"
              >
                Schedule Appointment
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* Search Records Tab */}
        {activeTab === 'search' && (
          <motion.div
            key="search"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-surface-900 mb-6 flex items-center">
              <ApperIcon name="Search" className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-600" />
              Search Medical Records
            </h3>

            <div className="mb-6">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="medical-input pl-10"
                  placeholder="Search by patient name, ID, or department..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Patients Results */}
              <div>
                <h4 className="text-lg font-semibold text-surface-900 mb-4 flex items-center">
                  <ApperIcon name="Users" className="w-5 h-5 mr-2 text-primary-600" />
                  Patients ({filteredPatients.length})
                </h4>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {filteredPatients.map((patient) => (
                    <motion.div
                      key={patient.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors border border-surface-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-surface-900">{patient.name}</h5>
                        <span className={`medical-badge ${
                          patient.status === 'Critical' ? 'status-urgent' :
                          patient.status === 'Active' ? 'status-active' :
                          'status-pending'
                        }`}>
                          {patient.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-surface-600">
                        <p><span className="font-medium">ID:</span> {patient.id}</p>
                        <p><span className="font-medium">Age:</span> {patient.age}</p>
                        <p><span className="font-medium">Department:</span> {patient.department}</p>
                        <p><span className="font-medium">Last Visit:</span> {patient.lastVisit}</p>
                      </div>
                    </motion.div>
                  ))}
                  {filteredPatients.length === 0 && searchTerm && (
                    <p className="text-center text-surface-500 py-8">No patients found matching your search.</p>
                  )}
                </div>
              </div>

              {/* Appointments Results */}
              <div>
                <h4 className="text-lg font-semibold text-surface-900 mb-4 flex items-center">
                  <ApperIcon name="Calendar" className="w-5 h-5 mr-2 text-secondary-600" />
                  Appointments ({filteredAppointments.length})
                </h4>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {filteredAppointments.map((appointment) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors border border-surface-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-surface-900">{appointment.patient}</h5>
                        <span className={`medical-badge ${
                          appointment.status === 'Confirmed' ? 'status-active' : 'status-pending'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-1 text-sm text-surface-600">
                        <p><span className="font-medium">Doctor:</span> {appointment.doctor}</p>
                        <p><span className="font-medium">Time:</span> {appointment.time}</p>
                        <p><span className="font-medium">Department:</span> {appointment.department}</p>
                      </div>
                    </motion.div>
                  ))}
                  {filteredAppointments.length === 0 && searchTerm && (
                    <p className="text-center text-surface-500 py-8">No appointments found matching your search.</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature