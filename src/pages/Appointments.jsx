import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

const Appointments = () => {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'John Smith',
      doctor: 'Dr. Sarah Johnson',
      department: 'Cardiology',
      date: '2024-01-15',
      time: '10:00',
      status: 'confirmed',
      type: 'consultation'
    },
    {
      id: 2,
      patientName: 'Mary Johnson',
      doctor: 'Dr. Michael Chen',
      department: 'Dermatology',
      date: '2024-01-15',
      time: '14:30',
      status: 'pending',
      type: 'follow-up'
    },
    {
      id: 3,
      patientName: 'Robert Davis',
      doctor: 'Dr. Emily Wilson',
      department: 'Orthopedics',
      date: '2024-01-16',
      time: '09:15',
      status: 'completed',
      type: 'check-up'
    }
  ])

  const [formData, setFormData] = useState({
    patientName: '',
    doctor: '',
    department: '',
    date: '',
    time: '',
    type: 'consultation',
    notes: ''
  })

  const [showForm, setShowForm] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    const requiredFields = ['patientName', 'doctor', 'department', 'date', 'time']
    const missingFields = requiredFields.filter(field => !formData[field])
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`)
      return
    }

    // Create new appointment
    const newAppointment = {
      id: appointments.length + 1,
      ...formData,
      status: 'pending'
    }

    setAppointments(prev => [...prev, newAppointment])
    toast.success('Appointment scheduled successfully!')
    
    // Reset form
    setFormData({
      patientName: '',
      doctor: '',
      department: '',
      date: '',
      time: '',
      type: 'consultation',
      notes: ''
    })
    setShowForm(false)
  }

  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === id ? { ...apt, status: newStatus } : apt
      )
    )
    toast.success(`Appointment ${newStatus} successfully!`)
  }

  const deleteAppointment = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setAppointments(prev => prev.filter(apt => apt.id !== id))
      toast.success('Appointment cancelled successfully!')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-secondary-600 bg-secondary-100'
      case 'pending': return 'text-amber-600 bg-amber-100'
      case 'completed': return 'text-primary-600 bg-primary-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-surface-600 bg-surface-100'
    }
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
                  <p className="text-xs sm:text-sm text-surface-600 hidden sm:block">Appointment Management</p>
                </div>
              </button>
</div>
            
<button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-surface-100 hover:bg-surface-200 text-black font-medium transition-all duration-200"
            >
              <ApperIcon name="Home" className="w-4 h-4" />
              <span className="text-sm">Dashboard</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className="p-3 bg-secondary-100 rounded-xl">
              <ApperIcon name="Calendar" className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-surface-900">Appointments</h1>
              <p className="text-surface-600">Manage patient appointments</p>
            </div>
          </div>
          
<button
            onClick={() => setShowForm(!showForm)}
            className="medical-button-primary text-black"
          >
            <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
            Schedule Appointment
          </button>
        </motion.div>

        {/* New Appointment Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="medical-card mb-8"
          >
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Schedule New Appointment</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    className="medical-input"
                    placeholder="Enter patient name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Doctor *
                  </label>
                  <select
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleInputChange}
                    className="medical-select"
                    required
                  >
                    <option value="">Select doctor</option>
                    <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
                    <option value="Dr. Michael Chen">Dr. Michael Chen</option>
                    <option value="Dr. Emily Wilson">Dr. Emily Wilson</option>
                    <option value="Dr. David Brown">Dr. David Brown</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="medical-select"
                    required
                  >
                    <option value="">Select department</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Neurology">Neurology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="medical-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="medical-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Appointment Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="medical-select"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="check-up">Check-up</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="medical-input"
                  rows="3"
                  placeholder="Additional notes or comments"
                />
              </div>
              <div className="flex justify-end space-x-4">
<button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 rounded-xl border-2 border-surface-300 text-black font-medium hover:bg-surface-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="medical-button-primary text-black"
                >
                  Schedule Appointment
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Appointments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="medical-card"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-6">Scheduled Appointments</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="text-left py-3 px-4 font-medium text-surface-700">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-700">Doctor</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-700">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-700">Date & Time</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-700">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-700">Actions</th>
                </tr>
              </thead>
<tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.Id || appointment.id} className="border-b border-surface-100 hover:bg-surface-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-surface-900">{appointment.patientName}</div>
                    </td>
                    <td className="py-4 px-4 text-surface-700">{appointment.doctor}</td>
                    <td className="py-4 px-4 text-surface-700">{appointment.department}</td>
                    <td className="py-4 px-4">
                      <div className="text-surface-900">{appointment.date}</div>
                      <div className="text-sm text-surface-600">{appointment.time}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="capitalize text-surface-700">{appointment.type}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`medical-badge ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
<div className="flex items-center space-x-2">
                        {appointment.status === 'pending' && (
                          <button
                            onClick={() => updateAppointmentStatus(appointment.Id || appointment.id, 'confirmed')}
                            className="p-2 text-black hover:bg-secondary-100 rounded-lg transition-colors"
                            title="Confirm appointment"
                          >
                            <ApperIcon name="Check" className="w-4 h-4" />
                          </button>
                        )}
)}
                        {appointment.status === 'confirmed' && (
                          <button
                            onClick={() => updateAppointmentStatus(appointment.Id || appointment.id, 'completed')}
                            className="p-2 text-black hover:bg-primary-100 rounded-lg transition-colors"
                            title="Mark as completed"
                          >
                            <ApperIcon name="CheckCircle" className="w-4 h-4" />
                          </button>
                        )}
)}
                        <button
                          onClick={() => deleteAppointment(appointment.Id || appointment.id)}
                          className="p-2 text-black hover:bg-red-100 rounded-lg transition-colors"
                          title="Cancel appointment"
                        >
                          <ApperIcon name="X" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default Appointments