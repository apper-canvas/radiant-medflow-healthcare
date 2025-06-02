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