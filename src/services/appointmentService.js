import { toast } from 'react-toastify'

class AppointmentService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'appointment'
    
    // All fields for fetch operations
    this.allFields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'patient_name', 'doctor', 'department', 'date', 'time', 'status', 'type', 'notes'
    ]
    
    // Only updateable fields for create/update operations
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'patient_name', 'doctor', 'department', 'date', 'time', 'status', 'type', 'notes'
    ]
  }

  async fetchAppointments(searchTerm = '', statusFilter = '', dateFilter = '') {
    try {
      const params = {
        fields: this.allFields,
        orderBy: [
          {
            fieldName: 'date',
            SortType: 'ASC'
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      }

      const whereConditions = []

      // Add search filter if provided
      if (searchTerm) {
        whereConditions.push({
          fieldName: 'patient_name',
          operator: 'Contains',
          values: [searchTerm]
        })
      }

      // Add status filter if provided
      if (statusFilter && statusFilter !== 'all') {
        whereConditions.push({
          fieldName: 'status',
          operator: 'ExactMatch',
          values: [statusFilter]
        })
      }

      // Add date filter if provided
      if (dateFilter && dateFilter !== 'all') {
        const today = new Date().toISOString().split('T')[0]
        if (dateFilter === 'today') {
          whereConditions.push({
            fieldName: 'date',
            operator: 'ExactMatch',
            values: [today]
          })
        } else if (dateFilter === 'week') {
          whereConditions.push({
            fieldName: 'date',
            operator: 'RelativeMatch',
            values: ['this week']
          })
        }
      }

      if (whereConditions.length > 0) {
        params.where = whereConditions
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response || !response.data) {
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast.error('Failed to fetch appointments')
      return []
    }
  }

  async getAppointmentById(appointmentId) {
    try {
      const params = {
        fields: this.allFields
      }

      const response = await this.apperClient.getRecordById(this.tableName, appointmentId, params)
      
      if (!response || !response.data) {
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching appointment with ID ${appointmentId}:`, error)
      toast.error('Failed to fetch appointment details')
      return null
    }
  }

  async createAppointment(appointmentData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {}
      this.updateableFields.forEach(field => {
        if (appointmentData[field] !== undefined && appointmentData[field] !== '') {
          if (field === 'date') {
            filteredData[field] = appointmentData[field] // ISO date format
          } else {
            filteredData[field] = appointmentData[field]
          }
        }
      })

      // Set default values
      if (!filteredData.Name) {
        filteredData.Name = `${filteredData.patient_name || 'Unknown Patient'} - ${filteredData.doctor || 'Unknown Doctor'} - ${filteredData.date || ''}`
      }
      filteredData.status = filteredData.status || 'pending'
      filteredData.type = filteredData.type || 'consultation'

      const params = {
        records: [filteredData]
      }

      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        if (successfulRecords.length > 0) {
          toast.success('Appointment scheduled successfully')
          return successfulRecords[0].data
        } else {
          const failedRecord = response.results[0]
          if (failedRecord.errors) {
            failedRecord.errors.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
          } else {
            toast.error('Failed to schedule appointment')
          }
          return null
        }
      } else {
        toast.error('Failed to schedule appointment')
        return null
      }
    } catch (error) {
      console.error('Error creating appointment:', error)
      toast.error('Failed to schedule appointment')
      return null
    }
  }

  async updateAppointment(appointmentId, appointmentData) {
    try {
      // Filter to only include updateable fields
      const filteredData = { Id: appointmentId }
      this.updateableFields.forEach(field => {
        if (appointmentData[field] !== undefined) {
          if (field === 'date') {
            filteredData[field] = appointmentData[field] // ISO date format
          } else {
            filteredData[field] = appointmentData[field]
          }
        }
      })

      // Update Name field if relevant fields changed
      if (filteredData.patient_name !== undefined || filteredData.doctor !== undefined || filteredData.date !== undefined) {
        filteredData.Name = `${filteredData.patient_name || appointmentData.patient_name || 'Unknown Patient'} - ${filteredData.doctor || appointmentData.doctor || 'Unknown Doctor'} - ${filteredData.date || appointmentData.date || ''}`
      }

      const params = {
        records: [filteredData]
      }

      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        if (successfulRecords.length > 0) {
          toast.success('Appointment updated successfully')
          return successfulRecords[0].data
        } else {
          toast.error('Failed to update appointment')
          return null
        }
      } else {
        toast.error('Failed to update appointment')
        return null
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
      toast.error('Failed to update appointment')
      return null
    }
  }

  async deleteAppointment(appointmentId) {
    try {
      const params = {
        RecordIds: [appointmentId]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        if (successfulDeletions.length > 0) {
          toast.success('Appointment cancelled successfully')
          return true
        } else {
          toast.error('Failed to cancel appointment')
          return false
        }
      } else {
        toast.error('Failed to cancel appointment')
        return false
      }
    } catch (error) {
      console.error('Error deleting appointment:', error)
      toast.error('Failed to cancel appointment')
      return false
    }
  }

  async updateAppointmentStatus(appointmentId, newStatus) {
    try {
      const updatedData = {
        Id: appointmentId,
        status: newStatus
      }

      const params = {
        records: [updatedData]
      }

      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        if (successfulRecords.length > 0) {
          toast.success(`Appointment ${newStatus} successfully`)
          return successfulRecords[0].data
        } else {
          toast.error('Failed to update appointment status')
          return null
        }
      } else {
        toast.error('Failed to update appointment status')
        return null
      }
    } catch (error) {
      console.error('Error updating appointment status:', error)
      toast.error('Failed to update appointment status')
      return null
    }
  }

  async getTodaysAppointments() {
    try {
      const today = new Date().toISOString().split('T')[0]
      const params = {
        fields: this.allFields,
        where: [
          {
            fieldName: 'date',
            operator: 'ExactMatch',
            values: [today]
          }
        ],
        orderBy: [
          {
            fieldName: 'time',
            SortType: 'ASC'
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response || !response.data) {
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching today\'s appointments:', error)
      toast.error('Failed to fetch today\'s appointments')
      return []
    }
  }

  async getUpcomingAppointments(limit = 10) {
    try {
      const today = new Date().toISOString().split('T')[0]
      const params = {
        fields: this.allFields,
        where: [
          {
            fieldName: 'date',
            operator: 'GreaterThanOrEqualTo',
            values: [today]
          }
        ],
        orderBy: [
          {
            fieldName: 'date',
            SortType: 'ASC'
          }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response || !response.data) {
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error)
      toast.error('Failed to fetch upcoming appointments')
      return []
    }
  }

  async getAppointmentsByPatient(patientName) {
    try {
      const params = {
        fields: this.allFields,
        where: [
          {
            fieldName: 'patient_name',
            operator: 'ExactMatch',
            values: [patientName]
          }
        ],
        orderBy: [
          {
            fieldName: 'date',
            SortType: 'DESC'
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response || !response.data) {
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error(`Error fetching appointments for patient ${patientName}:`, error)
      toast.error('Failed to fetch patient appointments')
      return []
    }
  }

  async getAppointmentsByDoctor(doctorName) {
    try {
      const params = {
        fields: this.allFields,
        where: [
          {
            fieldName: 'doctor',
            operator: 'ExactMatch',
            values: [doctorName]
          }
        ],
        orderBy: [
          {
            fieldName: 'date',
            SortType: 'ASC'
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response || !response.data) {
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error(`Error fetching appointments for doctor ${doctorName}:`, error)
      toast.error('Failed to fetch doctor appointments')
      return []
    }
  }
}

export default new AppointmentService()