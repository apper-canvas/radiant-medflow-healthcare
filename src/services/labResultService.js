import { toast } from 'react-toastify'

class LabResultService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'lab_result'
    
    // All fields for fetch operations
    this.allFields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'patient_name', 'patient_id', 'test_type', 'status', 'priority', 'order_date', 'completed_date',
      'wbc', 'rbc', 'hemoglobin', 'hematocrit', 'critical_flags', 'doctor_ordered',
      'tsh', 't4', 't3', 'troponin', 'ckmb', 'ldh', 'interpretation', 'comments'
    ]
    
    // Only updateable fields for create/update operations
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'patient_name', 'patient_id', 'test_type', 'status', 'priority', 'order_date', 'completed_date',
      'wbc', 'rbc', 'hemoglobin', 'hematocrit', 'critical_flags', 'doctor_ordered',
      'tsh', 't4', 't3', 'troponin', 'ckmb', 'ldh', 'interpretation', 'comments'
    ]
  }

  async fetchLabResults(searchTerm = '', statusFilter = '', dateFilter = '') {
    try {
      const params = {
        fields: this.allFields,
        orderBy: [
          {
            fieldName: 'order_date',
            SortType: 'DESC'
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
            fieldName: 'order_date',
            operator: 'ExactMatch',
            values: [today]
          })
        } else if (dateFilter === 'week') {
          whereConditions.push({
            fieldName: 'order_date',
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
      console.error('Error fetching lab results:', error)
      toast.error('Failed to fetch lab results')
      return []
    }
  }

  async getLabResultById(labResultId) {
    try {
      const params = {
        fields: this.allFields
      }

      const response = await this.apperClient.getRecordById(this.tableName, labResultId, params)
      
      if (!response || !response.data) {
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching lab result with ID ${labResultId}:`, error)
      toast.error('Failed to fetch lab result details')
      return null
    }
  }

  async createLabResult(labResultData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {}
      this.updateableFields.forEach(field => {
        if (labResultData[field] !== undefined && labResultData[field] !== '') {
          if (field === 'critical_flags') {
            filteredData[field] = Boolean(labResultData[field])
          } else if (field === 'order_date' || field === 'completed_date') {
            filteredData[field] = labResultData[field] // ISO date format
          } else {
            filteredData[field] = labResultData[field]
          }
        }
      })

      // Set default values
      if (!filteredData.Name) {
        filteredData.Name = `${filteredData.test_type || 'Lab Test'} - ${filteredData.patient_name || 'Unknown Patient'}`
      }
      filteredData.order_date = filteredData.order_date || new Date().toISOString().split('T')[0]
      filteredData.status = filteredData.status || 'pending'
      filteredData.priority = filteredData.priority || 'routine'

      const params = {
        records: [filteredData]
      }

      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        if (successfulRecords.length > 0) {
          toast.success('Lab result created successfully')
          return successfulRecords[0].data
        } else {
          const failedRecord = response.results[0]
          if (failedRecord.errors) {
            failedRecord.errors.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
          } else {
            toast.error('Failed to create lab result')
          }
          return null
        }
      } else {
        toast.error('Failed to create lab result')
        return null
      }
    } catch (error) {
      console.error('Error creating lab result:', error)
      toast.error('Failed to create lab result')
      return null
    }
  }

  async updateLabResult(labResultId, labResultData) {
    try {
      // Filter to only include updateable fields
      const filteredData = { Id: labResultId }
      this.updateableFields.forEach(field => {
        if (labResultData[field] !== undefined) {
          if (field === 'critical_flags') {
            filteredData[field] = Boolean(labResultData[field])
          } else if (field === 'order_date' || field === 'completed_date') {
            filteredData[field] = labResultData[field] // ISO date format
          } else {
            filteredData[field] = labResultData[field]
          }
        }
      })

      const params = {
        records: [filteredData]
      }

      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        if (successfulRecords.length > 0) {
          toast.success('Lab result updated successfully')
          return successfulRecords[0].data
        } else {
          toast.error('Failed to update lab result')
          return null
        }
      } else {
        toast.error('Failed to update lab result')
        return null
      }
    } catch (error) {
      console.error('Error updating lab result:', error)
      toast.error('Failed to update lab result')
      return null
    }
  }

  async deleteLabResult(labResultId) {
    try {
      const params = {
        RecordIds: [labResultId]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        if (successfulDeletions.length > 0) {
          toast.success('Lab result deleted successfully')
          return true
        } else {
          toast.error('Failed to delete lab result')
          return false
        }
      } else {
        toast.error('Failed to delete lab result')
        return false
      }
    } catch (error) {
      console.error('Error deleting lab result:', error)
      toast.error('Failed to delete lab result')
      return false
    }
  }

  async flagAsCritical(labResultId, isCritical = true) {
    try {
      const updatedData = {
        Id: labResultId,
        critical_flags: isCritical
      }

      const params = {
        records: [updatedData]
      }

      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        if (successfulRecords.length > 0) {
          toast.success(`Lab result ${isCritical ? 'flagged as critical' : 'critical flag removed'}`)
          return successfulRecords[0].data
        } else {
          toast.error('Failed to update critical flag')
          return null
        }
      } else {
        toast.error('Failed to update critical flag')
        return null
      }
    } catch (error) {
      console.error('Error updating critical flag:', error)
      toast.error('Failed to update critical flag')
      return null
    }
  }

  async getPendingResults() {
    try {
      const params = {
        fields: this.allFields,
        where: [
          {
            fieldName: 'status',
            operator: 'ExactMatch',
            values: ['pending']
          }
        ],
        orderBy: [
          {
            fieldName: 'order_date',
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
      console.error('Error fetching pending results:', error)
      toast.error('Failed to fetch pending results')
      return []
    }
  }

  async getCriticalResults() {
    try {
      const params = {
        fields: this.allFields,
        where: [
          {
            fieldName: 'critical_flags',
            operator: 'ExactMatch',
            values: [true]
          }
        ],
        orderBy: [
          {
            fieldName: 'order_date',
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
      console.error('Error fetching critical results:', error)
      toast.error('Failed to fetch critical results')
      return []
    }
  }
}

export default new LabResultService()