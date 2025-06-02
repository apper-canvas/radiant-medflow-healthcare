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

const departments = [
    'Cardiology', 'Neurology', 'Dermatology', 'Orthopedics', 
    'Pediatrics', 'Emergency', 'Radiology', 'Laboratory'
  ]

  const appointmentTypes = [
    'Consultation', 'Follow-up', 'Emergency', 'Surgery', 
    'Diagnostic', 'Therapy', 'Vaccination'
  ]

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

  return (
    <div className="medical-card">
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
    </div>
  )
}

export default MainFeature