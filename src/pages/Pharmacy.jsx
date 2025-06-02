import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

const Pharmacy = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('inventory')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMedication, setSelectedMedication] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showDispenseForm, setShowDispenseForm] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState(null)

  // Sample data - in real app this would come from API
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: 'Amoxicillin 500mg',
      genericName: 'Amoxicillin',
      category: 'Antibiotic',
      stock: 150,
      minStock: 50,
      price: 12.50,
      supplier: 'PharmaCorp',
      expiryDate: '2025-03-15',
      location: 'A-15'
    },
    {
      id: 2,
      name: 'Ibuprofen 400mg',
      genericName: 'Ibuprofen',
      category: 'Pain Relief',
      stock: 25,
      minStock: 100,
      price: 8.75,
      supplier: 'MediSupply',
      expiryDate: '2024-12-20',
      location: 'B-08'
    },
    {
      id: 3,
      name: 'Metformin 850mg',
      genericName: 'Metformin',
      category: 'Diabetes',
      stock: 200,
      minStock: 75,
      price: 15.30,
      supplier: 'PharmaCorp',
      expiryDate: '2025-06-10',
      location: 'C-22'
    },
    {
      id: 4,
      name: 'Lisinopril 10mg',
      genericName: 'Lisinopril',
      category: 'Hypertension',
      stock: 30,
      minStock: 50,
      price: 22.40,
      supplier: 'CardioMeds',
      expiryDate: '2025-01-28',
      location: 'D-05'
    }
  ])

  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patientName: 'John Smith',
      patientId: 'P001',
      medication: 'Amoxicillin 500mg',
      dosage: '1 tablet 3 times daily',
      quantity: 21,
      doctor: 'Dr. Johnson',
      date: '2024-01-15',
      status: 'pending',
      instructions: 'Take with food'
    },
    {
      id: 2,
      patientName: 'Sarah Wilson',
      patientId: 'P002',
      medication: 'Metformin 850mg',
      dosage: '1 tablet twice daily',
      quantity: 60,
      doctor: 'Dr. Chen',
      date: '2024-01-14',
      status: 'dispensed',
      instructions: 'Take with meals'
    },
    {
      id: 3,
      patientName: 'Mike Davis',
      patientId: 'P003',
      medication: 'Lisinopril 10mg',
      dosage: '1 tablet once daily',
      quantity: 30,
      doctor: 'Dr. Anderson',
      date: '2024-01-13',
      status: 'pending',
      instructions: 'Take in the morning'
    }
  ])

  const [pharmacyStats] = useState({
    totalMedications: 847,
    lowStockItems: 12,
    pendingPrescriptions: 23,
    dailyDispensed: 156,
    monthlyRevenue: 45780,
    supplierOrders: 8
  })

  // Filter medications based on search
  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter prescriptions based on search and status
  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get low stock medications
  const lowStockMedications = medications.filter(med => med.stock <= med.minStock)

  const handleAddMedication = (medicationData) => {
    const newMedication = {
      id: Date.now(),
      ...medicationData,
      stock: parseInt(medicationData.stock),
      minStock: parseInt(medicationData.minStock),
      price: parseFloat(medicationData.price)
    }
    setMedications([...medications, newMedication])
    setShowAddForm(false)
    toast.success('Medication added successfully!')
  }

  const handleUpdateStock = (medicationId, newStock) => {
    setMedications(medications.map(med =>
      med.id === medicationId ? { ...med, stock: newStock } : med
    ))
    toast.success('Stock updated successfully!')
  }

  const handleDispensePrescription = (prescriptionId) => {
    setPrescriptions(prescriptions.map(prescription =>
      prescription.id === prescriptionId ? { ...prescription, status: 'dispensed' } : prescription
    ))
    setShowDispenseForm(false)
    setSelectedPrescription(null)
    toast.success('Prescription dispensed successfully!')
  }

  const handleDeleteMedication = (medicationId) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      setMedications(medications.filter(med => med.id !== medicationId))
      toast.success('Medication deleted successfully!')
    }
  }

  const handleReorderMedication = (medication) => {
    toast.info(`Reorder request sent for ${medication.name}`)
  }

  const AddMedicationForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      genericName: '',
      category: '',
      stock: '',
      minStock: '',
      price: '',
      supplier: '',
      expiryDate: '',
      location: ''
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      if (!formData.name || !formData.stock || !formData.price) {
        toast.error('Please fill in required fields')
        return
      }
      handleAddMedication(formData)
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-surface-900">Add New Medication</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Medication Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="medical-input"
                placeholder="Enter medication name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Generic Name
              </label>
              <input
                type="text"
                value={formData.genericName}
                onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                className="medical-input"
                placeholder="Enter generic name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="medical-select"
                >
                  <option value="">Select category</option>
                  <option value="Antibiotic">Antibiotic</option>
                  <option value="Pain Relief">Pain Relief</option>
                  <option value="Diabetes">Diabetes</option>
                  <option value="Hypertension">Hypertension</option>
                  <option value="Cardiovascular">Cardiovascular</option>
                  <option value="Respiratory">Respiratory</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Current Stock *
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="medical-input"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Minimum Stock
                </label>
                <input
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                  className="medical-input"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="medical-input"
                  placeholder="0.00"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Supplier
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="medical-input"
                placeholder="Enter supplier name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="medical-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Storage Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="medical-input"
                  placeholder="e.g., A-15"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="medical-button-primary flex-1"
              >
                Add Medication
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="medical-button bg-surface-200 text-surface-700 hover:bg-surface-300 flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )
  }

  const DispenseForm = ({ prescription }) => {
    const [verificationCode, setVerificationCode] = useState('')
    const [pharmacistNotes, setPharmacistNotes] = useState('')

    const handleSubmit = (e) => {
      e.preventDefault()
      if (!verificationCode) {
        toast.error('Please enter verification code')
        return
      }
      handleDispensePrescription(prescription.id)
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl p-6 max-w-md w-full"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-surface-900">Dispense Prescription</h3>
            <button
              onClick={() => setShowDispenseForm(false)}
              className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-surface-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-surface-900 mb-2">Prescription Details</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Patient:</span> {prescription.patientName}</p>
              <p><span className="font-medium">Medication:</span> {prescription.medication}</p>
              <p><span className="font-medium">Dosage:</span> {prescription.dosage}</p>
              <p><span className="font-medium">Quantity:</span> {prescription.quantity}</p>
              <p><span className="font-medium">Doctor:</span> {prescription.doctor}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Verification Code *
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="medical-input"
                placeholder="Enter verification code"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Pharmacist Notes
              </label>
              <textarea
                value={pharmacistNotes}
                onChange={(e) => setPharmacistNotes(e.target.value)}
                className="medical-input h-20 resize-none"
                placeholder="Add any notes..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="medical-button-primary flex-1"
              >
                Confirm Dispensing
              </button>
              <button
                type="button"
                onClick={() => setShowDispenseForm(false)}
                className="medical-button bg-surface-200 text-surface-700 hover:bg-surface-300 flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-primary-50/30 to-secondary-50/30">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-surface-200 sticky top-0 z-40"
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
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl">
                <ApperIcon name="Pill" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gradient">Pharmacy Management</h1>
                <p className="text-sm text-surface-600 hidden sm:block">Medication & Prescription System</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 sm:p-3 rounded-xl bg-surface-100 hover:bg-surface-200 transition-colors">
                <ApperIcon name="Bell" className="w-5 h-5 sm:w-6 sm:h-6 text-surface-700" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Overview */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="medical-grid">
            <div className="medical-card bg-orange-50 border-orange-200 border-2">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-orange-100 border border-orange-200">
                  <ApperIcon name="Package" className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-secondary-600">+2%</span>
              </div>
              <h3 className="text-3xl font-bold text-surface-900 mb-1">{pharmacyStats.totalMedications}</h3>
              <p className="text-sm text-surface-600">Total Medications</p>
            </div>

            <div className="medical-card bg-red-50 border-red-200 border-2">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-red-100 border border-red-200">
                  <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-sm font-medium text-red-600">Alert</span>
              </div>
              <h3 className="text-3xl font-bold text-surface-900 mb-1">{pharmacyStats.lowStockItems}</h3>
              <p className="text-sm text-surface-600">Low Stock Items</p>
            </div>

            <div className="medical-card bg-blue-50 border-blue-200 border-2">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-blue-100 border border-blue-200">
                  <ApperIcon name="FileText" className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-secondary-600">+8%</span>
              </div>
              <h3 className="text-3xl font-bold text-surface-900 mb-1">{pharmacyStats.pendingPrescriptions}</h3>
              <p className="text-sm text-surface-600">Pending Prescriptions</p>
            </div>

            <div className="medical-card bg-purple-50 border-purple-200 border-2">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-purple-100 border border-purple-200">
                  <ApperIcon name="TrendingUp" className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-secondary-600">+15%</span>
              </div>
              <h3 className="text-3xl font-bold text-surface-900 mb-1">${pharmacyStats.monthlyRevenue.toLocaleString()}</h3>
              <p className="text-sm text-surface-600">Monthly Revenue</p>
            </div>
          </div>
        </motion.section>

        {/* Low Stock Alerts */}
        {lowStockMedications.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="medical-card bg-red-50 border-red-200 border-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-red-800 flex items-center">
                  <ApperIcon name="AlertTriangle" className="w-5 h-5 mr-2" />
                  Low Stock Alerts
                </h3>
                <span className="medical-badge bg-red-100 text-red-800">{lowStockMedications.length} items</span>
              </div>
              <div className="grid gap-3">
                {lowStockMedications.map((med) => (
                  <div key={med.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                    <div>
                      <p className="font-medium text-surface-900">{med.name}</p>
                      <p className="text-sm text-surface-600">Stock: {med.stock} | Min: {med.minStock} | Location: {med.location}</p>
                    </div>
                    <button
                      onClick={() => handleReorderMedication(med)}
                      className="medical-button bg-red-100 text-red-700 hover:bg-red-200 text-sm px-3 py-2"
                    >
                      Reorder
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex space-x-1 bg-surface-100 rounded-xl p-1 mb-8 overflow-x-auto"
        >
          {[
            { id: 'inventory', label: 'Inventory', icon: 'Package' },
            { id: 'prescriptions', label: 'Prescriptions', icon: 'FileText' },
            { id: 'analytics', label: 'Analytics', icon: 'BarChart3' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              {/* Search and Actions */}
              <div className="medical-card">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                      <input
                        type="text"
                        placeholder="Search medications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 medical-input"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="medical-button-primary flex items-center space-x-2"
                  >
                    <ApperIcon name="Plus" className="w-4 h-4" />
                    <span>Add Medication</span>
                  </button>
                </div>

                {/* Medications Grid */}
                <div className="medical-grid-3">
                  {filteredMedications.map((medication) => (
                    <motion.div
                      key={medication.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-surface-50 rounded-xl p-4 hover:bg-surface-100 transition-all duration-200 border border-surface-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-surface-900 mb-1">{medication.name}</h4>
                          <p className="text-sm text-surface-600">{medication.genericName}</p>
                          <span className="medical-badge bg-primary-100 text-primary-800 text-xs mt-2">
                            {medication.category}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => setSelectedMedication(medication)}
                            className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
                          >
                            <ApperIcon name="Eye" className="w-4 h-4 text-primary-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteMedication(medication.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-surface-600">Stock:</span>
                          <span className={`font-medium ${
                            medication.stock <= medication.minStock ? 'text-red-600' : 'text-surface-900'
                          }`}>
                            {medication.stock}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-surface-600">Price:</span>
                          <span className="font-medium text-surface-900">${medication.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-surface-600">Location:</span>
                          <span className="font-medium text-surface-900">{medication.location}</span>
                        </div>
                      </div>

                      {medication.stock <= medication.minStock && (
                        <div className="mt-3 p-2 bg-red-100 rounded-lg">
                          <p className="text-xs text-red-700 font-medium">Low Stock Alert</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="space-y-6">
              {/* Search */}
              <div className="medical-card">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                      <input
                        type="text"
                        placeholder="Search prescriptions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 medical-input"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="medical-button bg-secondary-100 text-secondary-700 hover:bg-secondary-200">
                      Pending ({prescriptions.filter(p => p.status === 'pending').length})
                    </button>
                    <button className="medical-button bg-surface-200 text-surface-700 hover:bg-surface-300">
                      All Prescriptions
                    </button>
                  </div>
                </div>

                {/* Prescriptions List */}
                <div className="space-y-4">
                  {filteredPrescriptions.map((prescription) => (
                    <motion.div
                      key={prescription.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-surface-50 rounded-xl p-4 border border-surface-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h4 className="font-semibold text-surface-900">{prescription.patientName}</h4>
                            <span className="text-sm text-surface-600">#{prescription.patientId}</span>
                            <span className={`medical-badge ${
                              prescription.status === 'pending' 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-secondary-100 text-secondary-800'
                            }`}>
                              {prescription.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-surface-600">Medication:</p>
                              <p className="font-medium text-surface-900">{prescription.medication}</p>
                            </div>
                            <div>
                              <p className="text-surface-600">Dosage:</p>
                              <p className="font-medium text-surface-900">{prescription.dosage}</p>
                            </div>
                            <div>
                              <p className="text-surface-600">Quantity:</p>
                              <p className="font-medium text-surface-900">{prescription.quantity}</p>
                            </div>
                            <div>
                              <p className="text-surface-600">Doctor:</p>
                              <p className="font-medium text-surface-900">{prescription.doctor}</p>
                            </div>
                          </div>

                          {prescription.instructions && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <span className="font-medium">Instructions:</span> {prescription.instructions}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-2 ml-4">
                          {prescription.status === 'pending' && (
                            <button
                              onClick={() => {
                                setSelectedPrescription(prescription)
                                setShowDispenseForm(true)
                              }}
                              className="medical-button-primary text-sm px-3 py-2"
                            >
                              Dispense
                            </button>
                          )}
                          <button className="medical-button bg-surface-200 text-surface-700 hover:bg-surface-300 text-sm px-3 py-2">
                            View Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="medical-card">
                <h3 className="text-xl font-bold text-surface-900 mb-6">Pharmacy Analytics</h3>
                
                <div className="medical-grid-2 gap-6">
                  <div className="bg-surface-50 rounded-xl p-6">
                    <h4 className="font-semibold text-surface-900 mb-4">Monthly Performance</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-surface-600">Prescriptions Filled</span>
                        <span className="font-bold text-2xl text-secondary-600">1,234</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-surface-600">Average Processing Time</span>
                        <span className="font-bold text-2xl text-primary-600">12 min</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-surface-600">Customer Satisfaction</span>
                        <span className="font-bold text-2xl text-secondary-600">98.5%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-50 rounded-xl p-6">
                    <h4 className="font-semibold text-surface-900 mb-4">Top Medications</h4>
                    <div className="space-y-3">
                      {[
                        { name: 'Amoxicillin 500mg', dispensed: 156 },
                        { name: 'Ibuprofen 400mg', dispensed: 134 },
                        { name: 'Metformin 850mg', dispensed: 98 },
                        { name: 'Lisinopril 10mg', dispensed: 87 }
                      ].map((med, index) => (
                        <div key={med.name} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-surface-900">{med.name}</p>
                            <p className="text-sm text-surface-600">#{index + 1} most dispensed</p>
                          </div>
                          <span className="font-bold text-primary-600">{med.dispensed}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-surface-50 rounded-xl p-6">
                  <h4 className="font-semibold text-surface-900 mb-4">Inventory Status</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-secondary-600 mb-2">{pharmacyStats.totalMedications}</div>
                      <p className="text-surface-600">Total Items</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600 mb-2">{pharmacyStats.lowStockItems}</div>
                      <p className="text-surface-600">Low Stock</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-amber-600 mb-2">{pharmacyStats.supplierOrders}</div>
                      <p className="text-surface-600">Pending Orders</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Modals */}
      {showAddForm && <AddMedicationForm />}
      {showDispenseForm && selectedPrescription && (
        <DispenseForm prescription={selectedPrescription} />
      )}

      {/* Medication Details Modal */}
      {selectedMedication && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-surface-900">Medication Details</h3>
              <button
                onClick={() => setSelectedMedication(null)}
                className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Name</label>
                <p className="text-surface-900">{selectedMedication.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Generic Name</label>
                <p className="text-surface-900">{selectedMedication.genericName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Stock</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      defaultValue={selectedMedication.stock}
                      onBlur={(e) => handleUpdateStock(selectedMedication.id, parseInt(e.target.value))}
                      className="medical-input text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Price</label>
                  <p className="text-surface-900">${selectedMedication.price}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Supplier</label>
                  <p className="text-surface-900">{selectedMedication.supplier}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Location</label>
                  <p className="text-surface-900">{selectedMedication.location}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Expiry Date</label>
                <p className="text-surface-900">{selectedMedication.expiryDate}</p>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => handleReorderMedication(selectedMedication)}
                className="medical-button-secondary flex-1"
              >
                Reorder
              </button>
              <button
                onClick={() => setSelectedMedication(null)}
                className="medical-button bg-surface-200 text-surface-700 hover:bg-surface-300 flex-1"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Pharmacy