import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

const Billing = () => {
  const navigate = useNavigate()
  
  const [invoices, setInvoices] = useState([
    {
      id: 'INV-001',
      patientName: 'John Smith',
      patientId: 'P001',
      services: [
        { name: 'Consultation - Cardiology', amount: 150 },
        { name: 'ECG Test', amount: 75 },
        { name: 'Blood Work', amount: 100 }
      ],
      total: 325,
      billingType: 'insurance',
      insuranceProvider: 'Blue Cross',
      paymentStatus: 'paid',
      dateCreated: '2024-01-10',
      datePaid: '2024-01-12'
    },
    {
      id: 'INV-002',
      patientName: 'Mary Johnson',
      patientId: 'P002',
      services: [
        { name: 'Dermatology Consultation', amount: 120 },
        { name: 'Skin Biopsy', amount: 200 }
      ],
      total: 320,
      billingType: 'self-pay',
      insuranceProvider: null,
      paymentStatus: 'pending',
      dateCreated: '2024-01-12',
      datePaid: null
    }
  ])

  const [payments, setPayments] = useState([
    {
      id: 'PAY-001',
      invoiceId: 'INV-001',
      amount: 325,
      method: 'insurance',
      date: '2024-01-12',
      reference: 'BC123456'
    }
  ])

  const [activeTab, setActiveTab] = useState('invoices')
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  const [invoiceForm, setInvoiceForm] = useState({
    patientName: '',
    patientId: '',
    billingType: 'self-pay',
    insuranceProvider: '',
    services: [{ name: '', amount: '' }]
  })

  const [paymentForm, setPaymentForm] = useState({
    invoiceId: '',
    amount: '',
    method: 'cash',
    reference: ''
  })

  const addService = () => {
    setInvoiceForm(prev => ({
      ...prev,
      services: [...prev.services, { name: '', amount: '' }]
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

  const handleCreateInvoice = (e) => {
    e.preventDefault()
    
    if (!invoiceForm.patientName || !invoiceForm.patientId) {
      toast.error('Please fill in patient information')
      return
    }

    const validServices = invoiceForm.services.filter(s => s.name && s.amount)
    if (validServices.length === 0) {
      toast.error('Please add at least one service')
      return
    }

    const total = validServices.reduce((sum, service) => sum + parseFloat(service.amount), 0)
    
    const newInvoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      ...invoiceForm,
      services: validServices.map(s => ({ ...s, amount: parseFloat(s.amount) })),
      total,
      paymentStatus: 'pending',
      dateCreated: new Date().toISOString().split('T')[0],
      datePaid: null
    }

    setInvoices(prev => [...prev, newInvoice])
    toast.success('Invoice created successfully!')
    
    // Reset form
    setInvoiceForm({
      patientName: '',
      patientId: '',
      billingType: 'self-pay',
      insuranceProvider: '',
      services: [{ name: '', amount: '' }]
    })
    setShowInvoiceForm(false)
  }

  const handleRecordPayment = (e) => {
    e.preventDefault()
    
    if (!paymentForm.invoiceId || !paymentForm.amount || !paymentForm.method) {
      toast.error('Please fill in all payment details')
      return
    }

    const newPayment = {
      id: `PAY-${String(payments.length + 1).padStart(3, '0')}`,
      ...paymentForm,
      amount: parseFloat(paymentForm.amount),
      date: new Date().toISOString().split('T')[0]
    }

    setPayments(prev => [...prev, newPayment])
    
    // Update invoice status
    setInvoices(prev => 
      prev.map(inv => 
        inv.id === paymentForm.invoiceId 
          ? { ...inv, paymentStatus: 'paid', datePaid: newPayment.date }
          : inv
      )
    )
    
    toast.success('Payment recorded successfully!')
    
    // Reset form
    setPaymentForm({
      invoiceId: '',
      amount: '',
      method: 'cash',
      reference: ''
    })
    setShowPaymentForm(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-secondary-600 bg-secondary-100'
      case 'pending': return 'text-amber-600 bg-amber-100'
      case 'overdue': return 'text-red-600 bg-red-100'
      default: return 'text-surface-600 bg-surface-100'
    }
  }

  const getBillingTypeColor = (type) => {
    return type === 'insurance' 
      ? 'text-primary-600 bg-primary-100' 
      : 'text-purple-600 bg-purple-100'
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
                  <p className="text-xs sm:text-sm text-surface-600 hidden sm:block">Billing & Invoices</p>
                </div>
              </button>
            </div>
            
            {/* Navigation Buttons */}
            <nav className="hidden lg:flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/patient-management')}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-primary-100 hover:bg-primary-200 text-primary-700 font-medium transition-all duration-200"
              >
                <ApperIcon name="Users" className="w-4 h-4" />
                <span className="text-sm">Patients</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/appointments')}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-secondary-100 hover:bg-secondary-200 text-secondary-700 font-medium transition-all duration-200"
              >
                <ApperIcon name="Calendar" className="w-4 h-4" />
                <span className="text-sm">Appointments</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/billing')}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-200 text-amber-700 font-medium transition-all duration-200"
              >
                <ApperIcon name="CreditCard" className="w-4 h-4" />
                <span className="text-sm">Billing</span>
              </motion.button>
            </nav>
            
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className="p-3 bg-amber-100 rounded-xl">
              <ApperIcon name="CreditCard" className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-surface-900">Billing & Invoices</h1>
              <p className="text-surface-600">Manage patient billing and payments</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowInvoiceForm(!showInvoiceForm)}
              className="medical-button-primary"
            >
              <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
              Create Invoice
            </button>
            <button
              onClick={() => setShowPaymentForm(!showPaymentForm)}
              className="medical-button-secondary"
            >
              <ApperIcon name="DollarSign" className="w-5 h-5 mr-2" />
              Record Payment
            </button>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex space-x-1 p-1 bg-surface-100 rounded-xl mb-8 w-fit"
        >
          {[
            { id: 'invoices', label: 'Invoices', icon: 'FileText' },
            { id: 'payments', label: 'Payments', icon: 'DollarSign' },
            { id: 'reports', label: 'Reports', icon: 'BarChart3' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Invoice Form */}
        {showInvoiceForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="medical-card mb-8"
          >
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Create New Invoice</h3>
            <form onSubmit={handleCreateInvoice} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Billing Type *
                  </label>
                  <select
                    value={invoiceForm.billingType}
                    onChange={(e) => setInvoiceForm(prev => ({ ...prev, billingType: e.target.value }))}
                    className="medical-select"
                  >
                    <option value="self-pay">Self Pay</option>
                    <option value="insurance">Insurance</option>
                  </select>
                </div>
                {invoiceForm.billingType === 'insurance' && (
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Insurance Provider
                    </label>
                    <input
                      type="text"
                      value={invoiceForm.insuranceProvider}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, insuranceProvider: e.target.value }))}
                      className="medical-input"
                      placeholder="Enter insurance provider"
                    />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-surface-700">
                    Services *
                  </label>
                  <button
                    type="button"
                    onClick={addService}
                    className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                  >
                    <ApperIcon name="Plus" className="w-4 h-4" />
                    <span className="text-sm">Add Service</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {invoiceForm.services.map((service, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="text"
                        placeholder="Service name"
                        value={service.name}
                        onChange={(e) => updateService(index, 'name', e.target.value)}
                        className="medical-input flex-1"
                      />
                      <input
                        type="number"
                        placeholder="Amount"
                        value={service.amount}
                        onChange={(e) => updateService(index, 'amount', e.target.value)}
                        className="medical-input w-32"
                        min="0"
                        step="0.01"
                      />
                      {invoiceForm.services.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                        >
                          <ApperIcon name="X" className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowInvoiceForm(false)}
                  className="px-6 py-3 rounded-xl border-2 border-surface-300 text-surface-700 font-medium hover:bg-surface-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="medical-button-primary"
                >
                  Create Invoice
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Payment Form */}
        {showPaymentForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="medical-card mb-8"
          >
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Record Payment</h3>
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {invoices.filter(inv => inv.paymentStatus === 'pending').map(invoice => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.id} - {invoice.patientName} (${invoice.total})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                    className="medical-input"
                    placeholder="Enter payment amount"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    value={paymentForm.method}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, method: e.target.value }))}
                    className="medical-select"
                    required
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="insurance">Insurance</option>
                    <option value="check">Check</option>
                    <option value="bank-transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    value={paymentForm.reference}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, reference: e.target.value }))}
                    className="medical-input"
                    placeholder="Enter reference number"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowPaymentForm(false)}
                  className="px-6 py-3 rounded-xl border-2 border-surface-300 text-surface-700 font-medium hover:bg-surface-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="medical-button-secondary"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {activeTab === 'invoices' && (
            <div className="medical-card">
              <h3 className="text-lg font-semibold text-surface-900 mb-6">All Invoices</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-200">
                      <th className="text-left py-3 px-4 font-medium text-surface-700">Invoice ID</th>
                      <th className="text-left py-3 px-4 font-medium text-surface-700">Patient</th>
                      <th className="text-left py-3 px-4 font-medium text-surface-700">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-surface-700">Billing Type</th>
                      <th className="text-left py-3 px-4 font-medium text-surface-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-surface-700">Date Created</th>
                      <th className="text-left py-3 px-4 font-medium text-surface-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-surface-100 hover:bg-surface-50">
                        <td className="py-4 px-4 font-mono text-sm font-medium">{invoice.id}</td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-surface-900">{invoice.patientName}</div>
                          <div className="text-sm text-surface-600">{invoice.patientId}</div>
                        </td>
                        <td className="py-4 px-4 font-semibold">${invoice.total}</td>
                        <td className="py-4 px-4">
                          <span className={`medical-badge ${getBillingTypeColor(invoice.billingType)}`}>
                            {invoice.billingType}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`medical-badge ${getStatusColor(invoice.paymentStatus)}`}>
                            {invoice.paymentStatus}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-surface-700">{invoice.dateCreated}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedInvoice(invoice)}
                              className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                              title="View details"
                            >
                              <ApperIcon name="Eye" className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
                              title="Download PDF"
                            >
                              <ApperIcon name="Download" className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="medical-card">
              <h3 className="text-lg font-semibold text-surface-900 mb-6">Payment History</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-200">
                      <th className="text-left py-3 px-4 font-medium text-surface-700">Payment ID</th>
                      <th className="text-left py-3 px-4 font-medium text-surface-700">Invoice ID</th>
                      <th className="text-left py-3 px-4 font-medium text-surface-700">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-surface-700">Method</th>
                      <th className="text-left py-3 px-4 font-medium text-surface-700">Reference</th>
                      <th className="text-left py-3 px-4 font-medium text-surface-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-surface-100 hover:bg-surface-50">
                        <td className="py-4 px-4 font-mono text-sm font-medium">{payment.id}</td>
                        <td className="py-4 px-4 font-mono text-sm">{payment.invoiceId}</td>
                        <td className="py-4 px-4 font-semibold">${payment.amount}</td>
                        <td className="py-4 px-4">
                          <span className="capitalize text-surface-700">{payment.method}</span>
                        </td>
                        <td className="py-4 px-4 text-surface-600">{payment.reference || '-'}</td>
                        <td className="py-4 px-4 text-surface-700">{payment.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="medical-card">
              <h3 className="text-lg font-semibold text-surface-900 mb-6">Payment Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <ApperIcon name="DollarSign" className="w-5 h-5 text-primary-600" />
                    </div>
                    <span className="text-sm text-primary-600 font-medium">+8% vs last month</span>
                  </div>
                  <h4 className="text-2xl font-bold text-surface-900 mb-1">
                    ${invoices.filter(inv => inv.paymentStatus === 'paid').reduce((sum, inv) => sum + inv.total, 0)}
                  </h4>
                  <p className="text-sm text-surface-600">Total Revenue</p>
                </div>

                <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-secondary-100 rounded-lg">
                      <ApperIcon name="Clock" className="w-5 h-5 text-secondary-600" />
                    </div>
                    <span className="text-sm text-secondary-600 font-medium">-2% vs last month</span>
                  </div>
                  <h4 className="text-2xl font-bold text-surface-900 mb-1">
                    ${invoices.filter(inv => inv.paymentStatus === 'pending').reduce((sum, inv) => sum + inv.total, 0)}
                  </h4>
                  <p className="text-sm text-surface-600">Pending Payments</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <ApperIcon name="FileText" className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="text-sm text-amber-600 font-medium">+12% vs last month</span>
                  </div>
                  <h4 className="text-2xl font-bold text-surface-900 mb-1">{invoices.length}</h4>
                  <p className="text-sm text-surface-600">Total Invoices</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <ApperIcon name="Shield" className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-sm text-purple-600 font-medium">+5% vs last month</span>
                  </div>
                  <h4 className="text-2xl font-bold text-surface-900 mb-1">
                    ${invoices.filter(inv => inv.billingType === 'insurance').reduce((sum, inv) => sum + inv.total, 0)}
                  </h4>
                  <p className="text-sm text-surface-600">Insurance Claims</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}

export default Billing