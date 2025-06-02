import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import ReactApexChart from 'react-apexcharts'

const Reports = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('financial')
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)

  // Sample data for reports
  const [financialData, setFinancialData] = useState({
    revenue: [
      { month: 'Jan', amount: 125000, target: 120000 },
      { month: 'Feb', amount: 132000, target: 125000 },
      { month: 'Mar', amount: 145000, target: 130000 },
      { month: 'Apr', amount: 138000, target: 135000 },
      { month: 'May', amount: 155000, target: 140000 },
      { month: 'Jun', amount: 162000, target: 150000 }
    ],
    expenses: [
      { category: 'Staff Salaries', amount: 45000, percentage: 35 },
      { category: 'Medical Supplies', amount: 25000, percentage: 20 },
      { category: 'Equipment', amount: 18000, percentage: 14 },
      { category: 'Utilities', amount: 12000, percentage: 9 },
      { category: 'Insurance', amount: 15000, percentage: 12 },
      { category: 'Other', amount: 13000, percentage: 10 }
    ]
  })

  const [patientData, setPatientData] = useState({
    demographics: [
      { ageGroup: '0-18', count: 245, percentage: 15 },
      { ageGroup: '19-35', count: 420, percentage: 26 },
      { ageGroup: '36-50', count: 380, percentage: 24 },
      { ageGroup: '51-65', count: 325, percentage: 20 },
      { ageGroup: '65+', count: 240, percentage: 15 }
    ],
    admissions: [
      { department: 'Emergency', count: 89, avgStay: 2.3 },
      { department: 'Cardiology', count: 67, avgStay: 4.1 },
      { department: 'Orthopedics', count: 45, avgStay: 3.8 },
      { department: 'Neurology', count: 34, avgStay: 5.2 },
      { department: 'Pediatrics', count: 78, avgStay: 2.9 }
    ]
  })

  const [appointmentData, setAppointmentData] = useState({
    daily: [
      { date: '2024-01-15', scheduled: 89, completed: 82, cancelled: 7 },
      { date: '2024-01-16', scheduled: 95, completed: 89, cancelled: 6 },
      { date: '2024-01-17', scheduled: 78, completed: 75, cancelled: 3 },
      { date: '2024-01-18', scheduled: 102, completed: 96, cancelled: 6 },
      { date: '2024-01-19', scheduled: 87, completed: 84, cancelled: 3 }
    ],
    byDepartment: [
      { department: 'Cardiology', count: 125, satisfaction: 4.8 },
      { department: 'Neurology', count: 98, satisfaction: 4.7 },
      { department: 'Dermatology', count: 87, satisfaction: 4.9 },
      { department: 'Orthopedics', count: 76, satisfaction: 4.6 },
      { department: 'Pediatrics', count: 145, satisfaction: 4.9 }
    ]
  })

  const tabs = [
    { id: 'financial', name: 'Financial Reports', icon: 'DollarSign', color: 'primary' },
    { id: 'patients', name: 'Patient Analytics', icon: 'Users', color: 'secondary' },
    { id: 'appointments', name: 'Appointment Stats', icon: 'Calendar', color: 'purple' },
    { id: 'departments', name: 'Department Performance', icon: 'Building2', color: 'orange' }
  ]

  // Chart configurations
  const revenueChartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false }
    },
    colors: ['#2563eb', '#10b981'],
    stroke: {
      width: [3, 2],
      curve: 'smooth'
    },
    xaxis: {
      categories: financialData.revenue.map(item => item.month)
    },
    yaxis: {
      title: { text: 'Amount ($)' },
      labels: {
        formatter: (value) => `$${(value / 1000).toFixed(0)}K`
      }
    },
    legend: {
      position: 'top'
    },
    grid: {
      borderColor: '#e2e8f0'
    }
  }

  const revenueChartSeries = [
    {
      name: 'Revenue',
      data: financialData.revenue.map(item => item.amount)
    },
    {
      name: 'Target',
      data: financialData.revenue.map(item => item.target)
    }
  ]

  const expensesChartOptions = {
    chart: {
      type: 'donut',
      height: 350
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'],
    labels: financialData.expenses.map(item => item.category),
    legend: {
      position: 'bottom'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Expenses',
              formatter: () => `$${financialData.expenses.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}`
            }
          }
        }
      }
    }
  }

  const expensesChartSeries = financialData.expenses.map(item => item.amount)

  const patientAgeChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false }
    },
    colors: ['#2563eb'],
    xaxis: {
      categories: patientData.demographics.map(item => item.ageGroup)
    },
    yaxis: {
      title: { text: 'Number of Patients' }
    },
    grid: {
      borderColor: '#e2e8f0'
    }
  }

  const patientAgeChartSeries = [{
    name: 'Patients',
    data: patientData.demographics.map(item => item.count)
  }]

  const appointmentTrendOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false }
    },
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    xaxis: {
      categories: appointmentData.daily.map(item => new Date(item.date).toLocaleDateString())
    },
    yaxis: {
      title: { text: 'Number of Appointments' }
    },
    legend: {
      position: 'top'
    },
    grid: {
      borderColor: '#e2e8f0'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.1
      }
    }
  }

  const appointmentTrendSeries = [
    {
      name: 'Scheduled',
      data: appointmentData.daily.map(item => item.scheduled)
    },
    {
      name: 'Completed',
      data: appointmentData.daily.map(item => item.completed)
    },
    {
      name: 'Cancelled',
      data: appointmentData.daily.map(item => item.cancelled)
    }
  ]

  const handleGenerateReport = (reportType) => {
    setLoading(true)
    toast.info(`Generating ${reportType} report...`)
    
    setTimeout(() => {
      setLoading(false)
      toast.success(`${reportType} report generated successfully!`)
    }, 2000)
  }

  const handleExportData = (format) => {
    toast.success(`Data exported as ${format.toUpperCase()} successfully!`)
  }

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }))
    toast.info('Date range updated - refreshing data...')
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
                  <p className="text-xs sm:text-sm text-surface-600 hidden sm:block">Reports & Analytics</p>
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
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-700 font-medium transition-all duration-200"
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
            <div className="p-3 bg-blue-100 rounded-xl">
              <ApperIcon name="BarChart3" className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-surface-900">Reports & Analytics</h1>
              <p className="text-surface-600">Comprehensive healthcare data insights</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-surface-700">From:</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
                className="medical-input py-2 text-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-surface-700">To:</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                className="medical-input py-2 text-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 p-1 bg-surface-100 rounded-xl mb-8"
        >
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
                  : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base hidden sm:inline">{tab.name}</span>
              <span className="text-xs sm:hidden">{tab.name.split(' ')[0]}</span>
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Financial Reports */}
          {activeTab === 'financial' && (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="medical-card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-green-200 rounded-lg">
                      <ApperIcon name="TrendingUp" className="w-5 h-5 text-green-700" />
                    </div>
                    <span className="text-sm text-green-600 font-medium">+8.2%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-surface-900 mb-1">$957K</h3>
                  <p className="text-sm text-surface-600">Total Revenue</p>
                </div>

                <div className="medical-card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-blue-200 rounded-lg">
                      <ApperIcon name="TrendingDown" className="w-5 h-5 text-blue-700" />
                    </div>
                    <span className="text-sm text-red-600 font-medium">+2.1%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-surface-900 mb-1">$128K</h3>
                  <p className="text-sm text-surface-600">Total Expenses</p>
                </div>

                <div className="medical-card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-purple-200 rounded-lg">
                      <ApperIcon name="DollarSign" className="w-5 h-5 text-purple-700" />
                    </div>
                    <span className="text-sm text-green-600 font-medium">+12.5%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-surface-900 mb-1">$829K</h3>
                  <p className="text-sm text-surface-600">Net Profit</p>
                </div>

                <div className="medical-card bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-orange-200 rounded-lg">
                      <ApperIcon name="Percent" className="w-5 h-5 text-orange-700" />
                    </div>
                    <span className="text-sm text-green-600 font-medium">+3.2%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-surface-900 mb-1">86.6%</h3>
                  <p className="text-sm text-surface-600">Profit Margin</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="medical-card">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-surface-900">Revenue vs Target</h3>
                    <button
                      onClick={() => handleExportData('csv')}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Export CSV
                    </button>
                  </div>
                  <ReactApexChart
                    options={revenueChartOptions}
                    series={revenueChartSeries}
                    type="line"
                    height={350}
                  />
                </div>

                <div className="medical-card">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-surface-900">Expense Breakdown</h3>
                    <button
                      onClick={() => handleExportData('pdf')}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Export PDF
                    </button>
                  </div>
                  <ReactApexChart
                    options={expensesChartOptions}
                    series={expensesChartSeries}
                    type="donut"
                    height={350}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleGenerateReport('Financial Summary')}
                  disabled={loading}
                  className="medical-button-primary"
                >
                  {loading ? 'Generating...' : 'Generate Financial Report'}
                </button>
                <button
                  onClick={() => handleGenerateReport('Profit & Loss')}
                  className="medical-button-secondary"
                >
                  P&L Statement
                </button>
                <button
                  onClick={() => handleGenerateReport('Cash Flow')}
                  className="px-6 py-3 rounded-xl border-2 border-surface-300 text-surface-700 font-medium hover:bg-surface-50 transition-colors"
                >
                  Cash Flow Report
                </button>
              </div>
            </div>
          )}

          {/* Patient Analytics */}
          {activeTab === 'patients' && (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="medical-card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-blue-200 rounded-lg">
                      <ApperIcon name="Users" className="w-5 h-5 text-blue-700" />
                    </div>
                    <span className="text-sm text-blue-600 font-medium">+5.2%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-surface-900 mb-1">1,610</h3>
                  <p className="text-sm text-surface-600">Total Patients</p>
                </div>

                <div className="medical-card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-green-200 rounded-lg">
                      <ApperIcon name="UserPlus" className="w-5 h-5 text-green-700" />
                    </div>
                    <span className="text-sm text-green-600 font-medium">+12%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-surface-900 mb-1">89</h3>
                  <p className="text-sm text-surface-600">New This Month</p>
                </div>

                <div className="medical-card bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-orange-200 rounded-lg">
                      <ApperIcon name="Clock" className="w-5 h-5 text-orange-700" />
                    </div>
                    <span className="text-sm text-orange-600 font-medium">3.4 days</span>
                  </div>
                  <h3 className="text-2xl font-bold text-surface-900 mb-1">4.1</h3>
                  <p className="text-sm text-surface-600">Avg Stay (days)</p>
                </div>

                <div className="medical-card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-purple-200 rounded-lg">
                      <ApperIcon name="Star" className="w-5 h-5 text-purple-700" />
                    </div>
                    <span className="text-sm text-purple-600 font-medium">+0.2</span>
                  </div>
                  <h3 className="text-2xl font-bold text-surface-900 mb-1">4.7</h3>
                  <p className="text-sm text-surface-600">Satisfaction</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="medical-card">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-surface-900">Patient Demographics</h3>
                    <button
                      onClick={() => handleExportData('xlsx')}
                      className="text-secondary-600 hover:text-secondary-700 text-sm font-medium"
                    >
                      Export Excel
                    </button>
                  </div>
                  <ReactApexChart
                    options={patientAgeChartOptions}
                    series={patientAgeChartSeries}
                    type="bar"
                    height={350}
                  />
                </div>

                <div className="medical-card">
                  <h3 className="text-lg font-semibold text-surface-900 mb-6">Department Admissions</h3>
                  <div className="space-y-4">
                    {patientData.admissions.map((dept, index) => (
                      <div key={dept.department} className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
                        <div>
                          <h4 className="font-medium text-surface-900">{dept.department}</h4>
                          <p className="text-sm text-surface-600">Avg Stay: {dept.avgStay} days</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-surface-900">{dept.count}</p>
                          <p className="text-sm text-surface-600">admissions</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleGenerateReport('Patient Demographics')}
                  className="medical-button-secondary"
                >
                  Demographics Report
                </button>
                <button
                  onClick={() => handleGenerateReport('Admission Trends')}
                  className="medical-button-primary"
                >
                  Admission Analysis
                </button>
              </div>
            </div>
          )}

          {/* Appointment Statistics */}
          {activeTab === 'appointments' && (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="medical-card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-green-200 rounded-lg">
                      <ApperIcon name="Calendar" className="w-5 h-5 text-green-700" />
                    </div>
                    <span className="text-sm text-green-600 font-medium">+6.3%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-surface-900 mb-1">451</h3>
                  <p className="text-sm text-surface-600">Total Scheduled</p>
                </div>

                <div className="medical-card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-blue-200 rounded-lg">
                      <ApperIcon name="CheckCircle" className="w-5 h-5 text-blue-700" />
                    </div>
                    <span className="text-sm text-blue-600 font-medium">93.2%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-surface-900 mb-1">426</h3>
                  <p className="text-sm text-surface-600">Completed</p>
                </div>

                <div className="medical-card bg-gradient-to-r from-red-50 to-red-100 border-red-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-red-200 rounded-lg">
                      <ApperIcon name="XCircle" className="w-5 h-5 text-red-700" />
                    </div>
                    <span className="text-sm text-red-600 font-medium">-1.2%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-surface-900 mb-1">25</h3>
                  <p className="text-sm text-surface-600">Cancelled</p>
                </div>

                <div className="medical-card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-purple-200 rounded-lg">
                      <ApperIcon name="Clock" className="w-5 h-5 text-purple-700" />
                    </div>
                    <span className="text-sm text-purple-600 font-medium">-5 min</span>
                  </div>
                  <h3 className="text-2xl font-bold text-surface-900 mb-1">12</h3>
                  <p className="text-sm text-surface-600">Avg Wait (min)</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="medical-card">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-surface-900">Appointment Trends</h3>
                    <button
                      onClick={() => handleExportData('csv')}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      Export Data
                    </button>
                  </div>
                  <ReactApexChart
                    options={appointmentTrendOptions}
                    series={appointmentTrendSeries}
                    type="area"
                    height={350}
                  />
                </div>

                <div className="medical-card">
                  <h3 className="text-lg font-semibold text-surface-900 mb-6">Department Performance</h3>
                  <div className="space-y-4">
                    {appointmentData.byDepartment.map((dept, index) => (
                      <div key={dept.department} className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
                        <div>
                          <h4 className="font-medium text-surface-900">{dept.department}</h4>
                          <div className="flex items-center space-x-1 mt-1">
                            <ApperIcon name="Star" className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-surface-600">{dept.satisfaction}/5.0</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-surface-900">{dept.count}</p>
                          <p className="text-sm text-surface-600">appointments</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleGenerateReport('Appointment Analytics')}
                  className="medical-button bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 focus:ring-purple-500 shadow-lg hover:shadow-xl"
                >
                  Appointment Report
                </button>
                <button
                  onClick={() => handleGenerateReport('Department Performance')}
                  className="medical-button-secondary"
                >
                  Performance Analysis
                </button>
              </div>
            </div>
          )}

          {/* Department Performance */}
          {activeTab === 'departments' && (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="medical-card bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-orange-200 rounded-lg">
                      <ApperIcon name="Building2" className="w-5 h-5 text-orange-700" />
                    </div>
                    <span className="text-sm text-orange-600 font-medium">8 active</span>
                  </div>
                  <h3 className="text-2xl font-bold text-surface-900 mb-1">12</h3>
                  <p className="text-sm text-surface-600">Total Departments</p>
                </div>

                <div className="medical-card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-green-200 rounded-lg">
                      <ApperIcon name="TrendingUp" className="w-5 h-5 text-green-700" />
                    </div>
                    <span className="text-sm text-green-600 font-medium">+15%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-surface-900 mb-1">94.2%</h3>
                  <p className="text-sm text-surface-600">Efficiency Rate</p>
                </div>

                <div className="medical-card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-blue-200 rounded-lg">
                      <ApperIcon name="Users" className="w-5 h-5 text-blue-700" />
                    </div>
                    <span className="text-sm text-blue-600 font-medium">342 total</span>
                  </div>
                  <h3 className="text-2xl font-bold text-surface-900 mb-1">28.5</h3>
                  <p className="text-sm text-surface-600">Avg Staff/Dept</p>
                </div>

                <div className="medical-card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-purple-200 rounded-lg">
                      <ApperIcon name="Award" className="w-5 h-5 text-purple-700" />
                    </div>
                    <span className="text-sm text-purple-600 font-medium">Cardiology</span>
                  </div>
                  <h3 className="text-2xl font-bold text-surface-900 mb-1">4.9</h3>
                  <p className="text-sm text-surface-600">Top Rated Dept</p>
                </div>
              </div>

              {/* Department Details Table */}
              <div className="medical-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-surface-900">Department Performance Overview</h3>
                  <button
                    onClick={() => handleExportData('xlsx')}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    Export Excel
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-surface-200">
                        <th className="text-left py-3 px-4 font-medium text-surface-700">Department</th>
                        <th className="text-left py-3 px-4 font-medium text-surface-700">Staff Count</th>
                        <th className="text-left py-3 px-4 font-medium text-surface-700">Patients</th>
                        <th className="text-left py-3 px-4 font-medium text-surface-700">Revenue</th>
                        <th className="text-left py-3 px-4 font-medium text-surface-700">Efficiency</th>
                        <th className="text-left py-3 px-4 font-medium text-surface-700">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Cardiology', staff: 45, patients: 267, revenue: 145000, efficiency: 96, rating: 4.9 },
                        { name: 'Emergency', staff: 38, patients: 892, revenue: 234000, efficiency: 89, rating: 4.6 },
                        { name: 'Neurology', staff: 32, patients: 134, revenue: 187000, efficiency: 94, rating: 4.8 },
                        { name: 'Orthopedics', staff: 28, patients: 156, revenue: 134000, efficiency: 92, rating: 4.7 },
                        { name: 'Pediatrics', staff: 42, patients: 345, revenue: 98000, efficiency: 97, rating: 4.9 },
                        { name: 'Radiology', staff: 24, patients: 456, revenue: 156000, efficiency: 91, rating: 4.5 }
                      ].map((dept) => (
                        <tr key={dept.name} className="border-b border-surface-100 hover:bg-surface-50">
                          <td className="py-4 px-4 font-medium text-surface-900">{dept.name}</td>
                          <td className="py-4 px-4 text-surface-700">{dept.staff}</td>
                          <td className="py-4 px-4 text-surface-700">{dept.patients}</td>
                          <td className="py-4 px-4 font-semibold text-green-600">${dept.revenue.toLocaleString()}</td>
                          <td className="py-4 px-4">
                            <span className={`medical-badge ${
                              dept.efficiency >= 95 ? 'status-active' :
                              dept.efficiency >= 90 ? 'status-pending' :
                              'status-urgent'
                            }`}>
                              {dept.efficiency}%
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="Star" className="w-4 h-4 text-yellow-500" />
                              <span className="font-medium text-surface-900">{dept.rating}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleGenerateReport('Department Analysis')}
                  className="medical-button bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 focus:ring-orange-500 shadow-lg hover:shadow-xl"
                >
                  Department Report
                </button>
                <button
                  onClick={() => handleGenerateReport('Staff Performance')}
                  className="medical-button-secondary"
                >
                  Staff Analysis
                </button>
                <button
                  onClick={() => handleGenerateReport('Resource Utilization')}
                  className="px-6 py-3 rounded-xl border-2 border-surface-300 text-surface-700 font-medium hover:bg-surface-50 transition-colors"
                >
                  Resource Report
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}

export default Reports