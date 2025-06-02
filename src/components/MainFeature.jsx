import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [activeTab, setActiveTab] = useState('patient')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [activeBillingTab, setActiveBillingTab] = useState('invoice')
  const [selectedBillingType, setSelectedBillingType] = useState('insurance')
  const [reportDateRange, setReportDateRange] = useState({ start: '', end: '' })
  
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

  const [invoiceForm, setInvoiceForm] = useState({
    patientName: '',
    patientId: '',
    billingType: 'insurance',
    insuranceProvider: '',
    policyNumber: '',
    services: [{ description: '', amount: 0 }],
    discount: 0,
    notes: ''
  })

  const [paymentForm, setPaymentForm] = useState({
    invoiceId: '',
    amount: '',
    paymentMethod: '',
    transactionId: '',
    notes: ''
  })

  const [invoices, setInvoices] = useState([
    {
      id: 'INV001',
      patientName: 'Sarah Johnson',
      patientId: 'P001',
      billingType: 'insurance',
      insuranceProvider: 'Blue Cross',
      policyNumber: 'BC123456',
      totalAmount: 1250.00,
      paidAmount: 1000.00,
      remainingAmount: 250.00,
      status: 'Partially Paid',
      createdDate: '2024-01-15',
      dueDate: '2024-02-15',
      services: [
        { description: 'Cardiology Consultation', amount: 350.00 },
        { description: 'ECG Test', amount: 200.00 },
        { description: 'Blood Work', amount: 150.00 },
        { description: 'Medication', amount: 550.00 }
      ]
    },
    {
      id: 'INV002',
      patientName: 'Michael Chen',
      patientId: 'P002',
      billingType: 'self-pay',
      insuranceProvider: '',
      policyNumber: '',
      totalAmount: 2400.00,
      paidAmount: 2400.00,
      remainingAmount: 0.00,
      status: 'Paid',
      createdDate: '2024-01-16',
      dueDate: '2024-02-16',
      services: [
        { description: 'Neurology Surgery', amount: 2000.00 },
        { description: 'Post-op Care', amount: 400.00 }
      ]
    },
    {
      id: 'INV003',
      patientName: 'Emma Williams',
      patientId: 'P003',
      billingType: 'insurance',
      insuranceProvider: 'Aetna',
      policyNumber: 'AET789012',
      totalAmount: 680.00,
      paidAmount: 0.00,
      remainingAmount: 680.00,
      status: 'Pending',
      createdDate: '2024-01-17',
      dueDate: '2024-02-17',
      services: [
        { description: 'Dermatology Consultation', amount: 280.00 },
        { description: 'Skin Biopsy', amount: 400.00 }
      ]
    }
  ])

  const [payments, setPayments] = useState([
    {
      id: 'PAY001',
      invoiceId: 'INV001',
      patientName: 'Sarah Johnson',
      amount: 1000.00,
      paymentMethod: 'Insurance',
      transactionId: 'BC001234',
      paymentDate: '2024-01-18',
      status: 'Completed'
    },
    {
      id: 'PAY002',
      invoiceId: 'INV002',
      patientName: 'Michael Chen',
      amount: 2400.00,
      paymentMethod: 'Credit Card',
      transactionId: 'CC567890',
      paymentDate: '2024-01-19',
      status: 'Completed'
    }
  ])
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
    },
    {
      id: 'billing',
      name: 'Billing & Invoices',
      icon: 'CreditCard',
      color: 'orange'
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

  const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Check', 'Insurance', 'Bank Transfer']

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

  const handleInvoiceSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!invoiceForm.patientName || !invoiceForm.patientId || invoiceForm.services.some(s => !s.description || s.amount <= 0)) {
      toast.error('Please fill in all required fields and ensure all services have valid amounts')
      return
    }

    // Calculate total amount
    const subtotal = invoiceForm.services.reduce((sum, service) => sum + Number(service.amount), 0)
    const totalAmount = subtotal - Number(invoiceForm.discount)

    // Create new invoice
    const newInvoice = {
      id: `INV${String(invoices.length + 4).padStart(3, '0')}`,
      ...invoiceForm,
      totalAmount,
      paidAmount: 0,
      remainingAmount: totalAmount,
      status: 'Pending',
      createdDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }

    setInvoices(prev => [...prev, newInvoice])
    toast.success(`Invoice ${newInvoice.id} generated successfully!`)
    
    // Reset form
    setInvoiceForm({
      patientName: '',
      patientId: '',
      billingType: 'insurance',
      insuranceProvider: '',
      policyNumber: '',
      services: [{ description: '', amount: 0 }],
      discount: 0,
      notes: ''
    })
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!paymentForm.invoiceId || !paymentForm.amount || !paymentForm.paymentMethod) {
      toast.error('Please fill in all required fields')
      return
    }

    const invoice = invoices.find(inv => inv.id === paymentForm.invoiceId)
    if (!invoice) {
      toast.error('Invoice not found')
      return
    }

    const paymentAmount = Number(paymentForm.amount)
    if (paymentAmount > invoice.remainingAmount) {
      toast.error('Payment amount cannot exceed remaining balance')
      return
    }

    // Create new payment
    const newPayment = {
      id: `PAY${String(payments.length + 3).padStart(3, '0')}`,
      ...paymentForm,
      patientName: invoice.patientName,
      amount: paymentAmount,
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'Completed'
    }

    // Update invoice
    const updatedInvoice = {
      ...invoice,
      paidAmount: invoice.paidAmount + paymentAmount,
      remainingAmount: invoice.remainingAmount - paymentAmount,
      status: invoice.remainingAmount - paymentAmount === 0 ? 'Paid' : 'Partially Paid'
    }

    setPayments(prev => [...prev, newPayment])
    setInvoices(prev => prev.map(inv => inv.id === invoice.id ? updatedInvoice : inv))
    
    toast.success(`Payment of $${paymentAmount.toFixed(2)} recorded successfully!`)
    
    // Reset form
    setPaymentForm({
      invoiceId: '',
      amount: '',
      paymentMethod: '',
      transactionId: '',
      notes: ''
    })
  }

  const addService = () => {
    setInvoiceForm(prev => ({
      ...prev,
      services: [...prev.services, { description: '', amount: 0 }]
    }))
  }

  const removeService = (index) => {
    setInvoiceForm(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }))
  }

  const updateService = (index, field, value) => {
    setInvoiceForm(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }))
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
                    tab.color === 'purple' ? 'text-purple-600' :
                    'text-orange-600'
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
                    tab.color === 'purple' ? 'text-purple-600' :
                    'text-orange-600'
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

        {/* Billing & Invoices Tab */}
        {activeTab === 'billing' && (
          <motion.div
            key="billing"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-surface-900 mb-6 flex items-center">
              <ApperIcon name="CreditCard" className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-orange-600" />
              Billing & Invoice Management
            </h3>

            {/* Billing Sub-tabs */}
            <div className="flex flex-wrap gap-2 mb-6 p-1 bg-surface-100 rounded-xl">
              {[
                { id: 'invoice', name: 'Generate Invoice', icon: 'FileText' },
                { id: 'payments', name: 'Record Payment', icon: 'DollarSign' },
                { id: 'reports', name: 'Payment Reports', icon: 'BarChart3' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveBillingTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 flex-1 sm:flex-none ${
                    activeBillingTab === tab.id
                      ? 'bg-white shadow-md text-orange-600'
                      : 'text-surface-600 hover:text-surface-800 hover:bg-surface-50'
                  }`}
                >
                  <ApperIcon name={tab.icon} className="w-4 h-4" />
                  <span className="text-sm sm:text-base hidden sm:inline">{tab.name}</span>
                  <span className="text-xs sm:hidden">{tab.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Invoice Generation */}
            {activeBillingTab === 'invoice' && (
              <div>
                <div className="flex flex-wrap gap-2 mb-6 p-1 bg-orange-50 rounded-xl">
                  {[
                    { id: 'insurance', name: 'Insurance Billing', icon: 'Shield' },
                    { id: 'self-pay', name: 'Self-Pay Billing', icon: 'Wallet' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedBillingType(type.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex-1 sm:flex-none ${
                        selectedBillingType === type.id
                          ? 'bg-white shadow-md text-orange-600'
                          : 'text-surface-600 hover:text-surface-800 hover:bg-white/50'
                      }`}
                    >
                      <ApperIcon name={type.icon} className="w-4 h-4" />
                      <span>{type.name}</span>
                    </button>
                  ))}
                </div>

                <form onSubmit={handleInvoiceSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Patient Name *
                      </label>
                      <input
                        type="text"
                        value={invoiceForm.patientName}
                        onChange={(e) => setInvoiceForm(prev => ({ ...prev, patientName: e.target.value }))}
                        className="medical-input"
                        placeholder="Enter patient name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Patient ID *
                      </label>
                      <input
                        type="text"
                        value={invoiceForm.patientId}
                        onChange={(e) => setInvoiceForm(prev => ({ ...prev, patientId: e.target.value }))}
                        className="medical-input"
                        placeholder="Enter patient ID"
                        required
                      />
                    </div>
                  </div>

                  {selectedBillingType === 'insurance' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-xl">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Insurance Provider *
                        </label>
                        <input
                          type="text"
                          value={invoiceForm.insuranceProvider}
                          onChange={(e) => setInvoiceForm(prev => ({ ...prev, insuranceProvider: e.target.value }))}
                          className="medical-input"
                          placeholder="Insurance company name"
                          required={selectedBillingType === 'insurance'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Policy Number *
                        </label>
                        <input
                          type="text"
                          value={invoiceForm.policyNumber}
                          onChange={(e) => setInvoiceForm(prev => ({ ...prev, policyNumber: e.target.value }))}
                          className="medical-input"
                          placeholder="Policy number"
                          required={selectedBillingType === 'insurance'}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-surface-700">
                        Services & Charges *
                      </label>
                      <button
                        type="button"
                        onClick={addService}
                        className="flex items-center space-x-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                      >
                        <ApperIcon name="Plus" className="w-4 h-4" />
                        <span>Add Service</span>
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {invoiceForm.services.map((service, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-surface-50 rounded-lg">
                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              value={service.description}
                              onChange={(e) => updateService(index, 'description', e.target.value)}
                              className="medical-input"
                              placeholder="Service description"
                              required
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={service.amount}
                              onChange={(e) => updateService(index, 'amount', Number(e.target.value))}
                              className="medical-input"
                              placeholder="Amount"
                              min="0"
                              step="0.01"
                              required
                            />
                            {invoiceForm.services.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeService(index)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <ApperIcon name="X" className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Discount ($)
                      </label>
                      <input
                        type="number"
                        value={invoiceForm.discount}
                        onChange={(e) => setInvoiceForm(prev => ({ ...prev, discount: Number(e.target.value) }))}
                        className="medical-input"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Total Amount
                      </label>
                      <div className="medical-input bg-surface-100 font-semibold text-surface-900">
                        ${(invoiceForm.services.reduce((sum, service) => sum + Number(service.amount), 0) - Number(invoiceForm.discount)).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={invoiceForm.notes}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="medical-input resize-none"
                      placeholder="Additional notes or payment terms..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="medical-button bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 focus:ring-orange-500 shadow-lg hover:shadow-xl w-full sm:w-auto"
                  >
                    Generate Invoice
                  </motion.button>
                </form>
              </div>
            )}

            {/* Payment Recording */}
            {activeBillingTab === 'payments' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-surface-900 mb-4">Record Payment</h4>
                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Invoice ID *
                        </label>
                        <select
                          value={paymentForm.invoiceId}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, invoiceId: e.target.value }))}
                          className="medical-select"
                          required
                        >
                          <option value="">Select invoice</option>
                          {invoices.filter(inv => inv.remainingAmount > 0).map(invoice => (
                            <option key={invoice.id} value={invoice.id}>
                              {invoice.id} - {invoice.patientName} (${invoice.remainingAmount.toFixed(2)} remaining)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-surface-700 mb-2">
                            Payment Amount *
                          </label>
                          <input
                            type="number"
                            value={paymentForm.amount}
                            onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                            className="medical-input"
                            placeholder="0.00"
                            min="0.01"
                            step="0.01"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-surface-700 mb-2">
                            Payment Method *
                          </label>
                          <select
                            value={paymentForm.paymentMethod}
                            onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                            className="medical-select"
                            required
                          >
                            <option value="">Select method</option>
                            {paymentMethods.map(method => (
                              <option key={method} value={method}>{method}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Transaction ID
                        </label>
                        <input
                          type="text"
                          value={paymentForm.transactionId}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, transactionId: e.target.value }))}
                          className="medical-input"
                          placeholder="Transaction reference number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Notes
                        </label>
                        <textarea
                          value={paymentForm.notes}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
                          rows={3}
                          className="medical-input resize-none"
                          placeholder="Payment notes..."
                        />
                      </div>

                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="medical-button bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 focus:ring-green-500 shadow-lg hover:shadow-xl w-full"
                      >
                        Record Payment
                      </motion.button>
                    </form>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-surface-900 mb-4">Outstanding Invoices</h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {invoices.filter(inv => inv.remainingAmount > 0).map((invoice) => (
                        <div key={invoice.id} className="p-4 bg-surface-50 rounded-xl border border-surface-200">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-surface-900">{invoice.id}</h5>
                            <span className="medical-badge status-pending">{invoice.status}</span>
                          </div>
                          <p className="text-sm text-surface-600 mb-2">{invoice.patientName}</p>
                          <div className="grid grid-cols-2 gap-2 text-sm text-surface-600">
                            <p><span className="font-medium">Total:</span> ${invoice.totalAmount.toFixed(2)}</p>
                            <p><span className="font-medium">Paid:</span> ${invoice.paidAmount.toFixed(2)}</p>
                            <p><span className="font-medium">Remaining:</span> ${invoice.remainingAmount.toFixed(2)}</p>
                            <p><span className="font-medium">Due:</span> {invoice.dueDate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Reports */}
            {activeBillingTab === 'reports' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-4 p-4 bg-surface-50 rounded-xl">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={reportDateRange.start}
                      onChange={(e) => setReportDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="medical-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={reportDateRange.end}
                      onChange={(e) => setReportDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="medical-input"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => toast.info('Report filters applied')}
                      className="medical-button-primary"
                    >
                      Apply Filter
                    </button>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="medical-card bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-200">
                    <h5 className="text-sm font-medium text-surface-700 mb-2">Total Revenue</h5>
                    <p className="text-2xl font-bold text-green-600">
                      ${payments.reduce((sum, payment) => sum + payment.amount, 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="medical-card bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-200">
                    <h5 className="text-sm font-medium text-surface-700 mb-2">Total Invoices</h5>
                    <p className="text-2xl font-bold text-blue-600">{invoices.length}</p>
                  </div>
                  <div className="medical-card bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-200">
                    <h5 className="text-sm font-medium text-surface-700 mb-2">Outstanding</h5>
                    <p className="text-2xl font-bold text-orange-600">
                      ${invoices.reduce((sum, inv) => sum + inv.remainingAmount, 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="medical-card bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-200">
                    <h5 className="text-sm font-medium text-surface-700 mb-2">Payments Today</h5>
                    <p className="text-2xl font-bold text-purple-600">
                      {payments.filter(p => p.paymentDate === new Date().toISOString().split('T')[0]).length}
                    </p>
                  </div>
                </div>

                {/* Recent Payments */}
                <div>
                  <h4 className="text-lg font-semibold text-surface-900 mb-4">Recent Payments</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-surface-100">
                          <th className="text-left p-3 font-medium text-surface-700">Payment ID</th>
                          <th className="text-left p-3 font-medium text-surface-700">Patient</th>
                          <th className="text-left p-3 font-medium text-surface-700">Invoice</th>
                          <th className="text-left p-3 font-medium text-surface-700">Amount</th>
                          <th className="text-left p-3 font-medium text-surface-700">Method</th>
                          <th className="text-left p-3 font-medium text-surface-700">Date</th>
                          <th className="text-left p-3 font-medium text-surface-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment) => (
                          <tr key={payment.id} className="border-b border-surface-200 hover:bg-surface-50">
                            <td className="p-3 font-medium text-surface-900">{payment.id}</td>
                            <td className="p-3 text-surface-700">{payment.patientName}</td>
                            <td className="p-3 text-surface-700">{payment.invoiceId}</td>
                            <td className="p-3 font-medium text-green-600">${payment.amount.toFixed(2)}</td>
                            <td className="p-3 text-surface-700">{payment.paymentMethod}</td>
                            <td className="p-3 text-surface-700">{payment.paymentDate}</td>
                            <td className="p-3">
                              <span className="medical-badge status-active">{payment.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Invoice Summary */}
                <div>
                  <h4 className="text-lg font-semibold text-surface-900 mb-4">Invoice Summary</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-surface-700 mb-3">By Billing Type</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                          <span>Insurance Billing</span>
                          <span className="font-semibold">
                            {invoices.filter(inv => inv.billingType === 'insurance').length} invoices
                          </span>
                        </div>
                        <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                          <span>Self-Pay Billing</span>
                          <span className="font-semibold">
                            {invoices.filter(inv => inv.billingType === 'self-pay').length} invoices
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-surface-700 mb-3">By Status</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                          <span>Paid</span>
                          <span className="font-semibold">
                            {invoices.filter(inv => inv.status === 'Paid').length} invoices
                          </span>
                        </div>
                        <div className="flex justify-between p-3 bg-yellow-50 rounded-lg">
                          <span>Partially Paid</span>
                          <span className="font-semibold">
                            {invoices.filter(inv => inv.status === 'Partially Paid').length} invoices
                          </span>
                        </div>
                        <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                          <span>Pending</span>
                          <span className="font-semibold">
                            {invoices.filter(inv => inv.status === 'Pending').length} invoices
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature