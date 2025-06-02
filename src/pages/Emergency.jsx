import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

const Emergency = () => {
  const navigate = useNavigate()
  const [activeEmergency, setActiveEmergency] = useState(null)
  const [emergencyForm, setEmergencyForm] = useState({
    type: '',
    severity: '',
    location: '',
    description: '',
    reporter: ''
  })

  const emergencyTypes = [
    { id: 'medical', name: 'Medical Emergency', icon: 'Heart', color: 'red', description: 'Patient in critical condition' },
    { id: 'fire', name: 'Fire Emergency', icon: 'Flame', color: 'orange', description: 'Fire or smoke detected' },
    { id: 'security', name: 'Security Alert', icon: 'Shield', color: 'yellow', description: 'Security breach or threat' },
    { id: 'equipment', name: 'Equipment Failure', icon: 'AlertTriangle', color: 'blue', description: 'Critical equipment malfunction' },
    { id: 'code_blue', name: 'Code Blue', icon: 'Zap', color: 'indigo', description: 'Cardiac/respiratory arrest' },
    { id: 'hazmat', name: 'Hazmat Spill', icon: 'AlertOctagon', color: 'purple', description: 'Chemical or biological hazard' }
  ]

  const severityLevels = [
    { id: 'critical', name: 'Critical', color: 'red', description: 'Life-threatening, immediate response required' },
    { id: 'high', name: 'High', color: 'orange', description: 'Urgent, response within 5 minutes' },
    { id: 'medium', name: 'Medium', color: 'yellow', description: 'Important, response within 15 minutes' },
    { id: 'low', name: 'Low', color: 'green', description: 'Non-urgent, response within 30 minutes' }
  ]

  const emergencyContacts = [
    { id: 1, name: 'Dr. Sarah Johnson', role: 'Emergency Director', phone: '(555) 0001', department: 'Emergency' },
    { id: 2, name: 'Security Chief Mike Wilson', role: 'Security Chief', phone: '(555) 0002', department: 'Security' },
    { id: 3, name: 'Fire Safety Coordinator', role: 'Fire Safety', phone: '(555) 0003', department: 'Safety' },
    { id: 4, name: 'IT Emergency Support', role: 'IT Support', phone: '(555) 0004', department: 'IT' },
    { id: 5, name: 'Maintenance Emergency', role: 'Maintenance', phone: '(555) 0005', department: 'Facilities' },
    { id: 6, name: 'Administration On-Call', role: 'Admin Director', phone: '(555) 0006', department: 'Administration' }
  ]

  const activeEmergencies = [
    { id: 1, type: 'Code Blue', location: 'ICU Room 302', severity: 'critical', time: '2 min ago', status: 'active' },
    { id: 2, type: 'Equipment Failure', location: 'OR Suite 5', severity: 'high', time: '5 min ago', status: 'responding' },
    { id: 3, type: 'Security Alert', location: 'Main Entrance', severity: 'medium', time: '8 min ago', status: 'resolved' }
  ]

  const handleEmergencySubmit = (e) => {
    e.preventDefault()
    if (!emergencyForm.type || !emergencyForm.severity || !emergencyForm.location) {
      toast.error('Please fill in all required fields')
      return
    }

    const newEmergency = {
      id: Date.now(),
      ...emergencyForm,
      time: new Date().toLocaleTimeString(),
      status: 'active'
    }

    setActiveEmergency(newEmergency)
    toast.success(`${emergencyForm.severity.toUpperCase()} emergency alert activated! All relevant staff have been notified.`)
    
    // Reset form
    setEmergencyForm({
      type: '',
      severity: '',
      location: '',
      description: '',
      reporter: ''
    })
  }

  const handleContactCall = (contact) => {
    toast.info(`Calling ${contact.name} at ${contact.phone}...`)
  }

  const handleQuickResponse = (action) => {
    switch(action) {
      case 'lockdown':
        toast.warning('Hospital lockdown initiated. All entrances secured.')
        break
      case 'evacuate':
        toast.error('Evacuation protocol activated. Please follow emergency exits.')
        break
      case 'all_clear':
        toast.success('All clear signal sent. Emergency status lifted.')
        setActiveEmergency(null)
        break
      case 'backup_power':
        toast.info('Backup power systems activated.')
        break
      default:
        toast.info(`${action} protocol initiated.`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-sm border-b-2 border-red-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-surface-600 hover:text-surface-900 transition-colors"
              >
                <ApperIcon name="ArrowLeft" className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-4 py-2 bg-red-100 rounded-xl">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-700 font-medium text-sm">Emergency Management Active</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Emergency Alert Banner */}
        {activeEmergency && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <ApperIcon name="AlertCircle" className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">ACTIVE EMERGENCY</h2>
                  <p className="text-red-100">
                    {activeEmergency.type} - {activeEmergency.severity.toUpperCase()} | {activeEmergency.location}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleQuickResponse('all_clear')}
                className="px-6 py-3 bg-white text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors"
              >
                Mark Resolved
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Emergency Declaration Form */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 medical-card"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-red-100 rounded-xl">
                <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-surface-900">Declare Emergency</h2>
            </div>

            <form onSubmit={handleEmergencySubmit} className="space-y-6">
              {/* Emergency Type Selection */}
              <div>
                <label className="block text-sm font-medium text-surface-900 mb-3">Emergency Type *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {emergencyTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setEmergencyForm(prev => ({ ...prev, type: type.name }))}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        emergencyForm.type === type.name
                          ? `border-${type.color}-500 bg-${type.color}-50`
                          : 'border-surface-200 hover:border-surface-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-${type.color}-100`}>
                          <ApperIcon name={type.icon} className={`w-5 h-5 text-${type.color}-600`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-surface-900">{type.name}</h3>
                          <p className="text-sm text-surface-600">{type.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Severity Level */}
              <div>
                <label className="block text-sm font-medium text-surface-900 mb-3">Severity Level *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {severityLevels.map((level) => (
                    <motion.button
                      key={level.id}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEmergencyForm(prev => ({ ...prev, severity: level.id }))}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        emergencyForm.severity === level.id
                          ? `border-${level.color}-500 bg-${level.color}-50`
                          : 'border-surface-200 hover:border-surface-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-${level.color}-500 mx-auto mb-2`}></div>
                      <p className="font-medium text-sm">{level.name}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Location and Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-900 mb-2">Location *</label>
                  <input
                    type="text"
                    value={emergencyForm.location}
                    onChange={(e) => setEmergencyForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., ICU Room 302, OR Suite 5"
                    className="medical-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-900 mb-2">Reporter Name</label>
                  <input
                    type="text"
                    value={emergencyForm.reporter}
                    onChange={(e) => setEmergencyForm(prev => ({ ...prev, reporter: e.target.value }))}
                    placeholder="Your name"
                    className="medical-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-900 mb-2">Description</label>
                <textarea
                  value={emergencyForm.description}
                  onChange={(e) => setEmergencyForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide additional details about the emergency..."
                  rows={3}
                  className="medical-input resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full medical-button-primary bg-red-600 hover:bg-red-700 text-white font-bold py-4 text-lg"
              >
                <ApperIcon name="AlertCircle" className="w-6 h-6 mr-2" />
                ACTIVATE EMERGENCY RESPONSE
              </button>
            </form>
          </motion.section>

          {/* Emergency Contacts & Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Quick Response Actions */}
            <div className="medical-card">
              <h3 className="text-lg font-bold text-surface-900 mb-4">Quick Response</h3>
              <div className="space-y-2">
                {[
                  { action: 'lockdown', label: 'Hospital Lockdown', icon: 'Lock', color: 'red' },
                  { action: 'evacuate', label: 'Evacuation Protocol', icon: 'Users', color: 'orange' },
                  { action: 'backup_power', label: 'Backup Power', icon: 'Zap', color: 'blue' },
                  { action: 'all_clear', label: 'All Clear Signal', icon: 'CheckCircle', color: 'green' }
                ].map((item) => (
                  <motion.button
                    key={item.action}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickResponse(item.action)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl bg-${item.color}-50 hover:bg-${item.color}-100 text-${item.color}-700 transition-colors`}
                  >
                    <ApperIcon name={item.icon} className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="medical-card">
              <h3 className="text-lg font-bold text-surface-900 mb-4">Emergency Contacts</h3>
              <div className="space-y-3">
                {emergencyContacts.map((contact) => (
                  <motion.div
                    key={contact.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface-50 hover:bg-surface-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-surface-900 truncate">{contact.name}</p>
                      <p className="text-sm text-surface-600">{contact.role}</p>
                      <p className="text-sm text-surface-500">{contact.department}</p>
                    </div>
                    <button
                      onClick={() => handleContactCall(contact)}
                      className="ml-3 p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors"
                    >
                      <ApperIcon name="Phone" className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Active Emergencies Status */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 medical-card"
        >
          <h3 className="text-lg font-bold text-surface-900 mb-6">Emergency Status Board</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="text-left py-3 px-4 font-medium text-surface-900">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-900">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-900">Severity</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-900">Time</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {activeEmergencies.map((emergency) => (
                  <tr key={emergency.id} className="border-b border-surface-100 hover:bg-surface-50">
                    <td className="py-3 px-4 font-medium">{emergency.type}</td>
                    <td className="py-3 px-4 text-surface-600">{emergency.location}</td>
                    <td className="py-3 px-4">
                      <span className={`medical-badge ${
                        emergency.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        emergency.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {emergency.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-surface-600">{emergency.time}</td>
                    <td className="py-3 px-4">
                      <span className={`medical-badge ${
                        emergency.status === 'active' ? 'bg-red-100 text-red-800' :
                        emergency.status === 'responding' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {emergency.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      </main>
    </div>
  )
}

export default Emergency