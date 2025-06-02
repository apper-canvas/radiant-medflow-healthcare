import { toast } from 'react-toastify'

class EmergencyService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'emergency'
    
    // All fields for fetch operations
    this.allFields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'type', 'severity', 'location', 'description', 'reporter', 'time', 'status'
    ]
    
    // Only updateable fields for create/update operations
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'type', 'severity', 'location', 'description', 'reporter', 'time', 'status'
    ]
  }

  async fetchEmergencies(statusFilter = '') {
    try {
      const params = {
        fields: this.allFields,
        orderBy: [
          {
            fieldName: 'CreatedOn',
            SortType: 'DESC'
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      }

      // Add status filter if provided
      if (statusFilter && statusFilter !== 'all') {
        params.where = [
          {
            fieldName: 'status',
            operator: 'ExactMatch',
            values: [statusFilter]
          }
        ]
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response || !response.data) {
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching emergencies:', error)
      toast.error('Failed to fetch emergencies')
      return []
    }
  }

  async getEmergencyById(emergencyId) {
    try {
      const params = {
        fields: this.allFields
      }

      const response = await this.apperClient.getRecordById(this.tableName, emergencyId, params)
      
      if (!response || !response.data) {
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching emergency with ID ${emergencyId}:`, error)
      toast.error('Failed to fetch emergency details')
      return null
    }
  }

  async createEmergency(emergencyData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {}
      this.updateableFields.forEach(field => {
        if (emergencyData[field] !== undefined && emergencyData[field] !== '') {
          filteredData[field] = emergencyData[field]
        }
      })

      // Set default values
      if (!filteredData.Name) {
        filteredData.Name = `${filteredData.type || 'Emergency'} - ${filteredData.location || 'Unknown Location'}`
      }
      filteredData.time = new Date().toLocaleTimeString()
      filteredData.status = filteredData.status || 'active'

      const params = {
        records: [filteredData]
      }

      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        if (successfulRecords.length > 0) {
          toast.success('Emergency alert created successfully')
          return successfulRecords[0].data
        } else {
          const failedRecord = response.results[0]
          if (failedRecord.errors) {
            failedRecord.errors.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
          } else {
            toast.error('Failed to create emergency alert')
          }
          return null
        }
      } else {
        toast.error('Failed to create emergency alert')
        return null
      }
    } catch (error) {
      console.error('Error creating emergency:', error)
      toast.error('Failed to create emergency alert')
      return null
    }
  }

  async updateEmergency(emergencyId, emergencyData) {
    try {
      // Filter to only include updateable fields
      const filteredData = { Id: emergencyId }
      this.updateableFields.forEach(field => {
        if (emergencyData[field] !== undefined) {
          filteredData[field] = emergencyData[field]
        }
      })

      const params = {
        records: [filteredData]
      }

      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        if (successfulRecords.length > 0) {
          toast.success('Emergency updated successfully')
          return successfulRecords[0].data
        } else {
          toast.error('Failed to update emergency')
          return null
        }
      } else {
        toast.error('Failed to update emergency')
        return null
      }
    } catch (error) {
      console.error('Error updating emergency:', error)
      toast.error('Failed to update emergency')
      return null
    }
  }

  async deleteEmergency(emergencyId) {
    try {
      const params = {
        RecordIds: [emergencyId]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        if (successfulDeletions.length > 0) {
          toast.success('Emergency deleted successfully')
          return true
        } else {
          toast.error('Failed to delete emergency')
          return false
        }
      } else {
        toast.error('Failed to delete emergency')
        return false
      }
    } catch (error) {
      console.error('Error deleting emergency:', error)
      toast.error('Failed to delete emergency')
      return false
    }
  }

  async resolveEmergency(emergencyId) {
    try {
      const updatedData = {
        Id: emergencyId,
        status: 'resolved'
      }

      const params = {
        records: [updatedData]
      }

      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        if (successfulRecords.length > 0) {
          toast.success('Emergency resolved successfully')
          return successfulRecords[0].data
        } else {
          toast.error('Failed to resolve emergency')
          return null
        }
      } else {
        toast.error('Failed to resolve emergency')
        return null
      }
    } catch (error) {
      console.error('Error resolving emergency:', error)
      toast.error('Failed to resolve emergency')
      return null
    }
  }

  async getActiveEmergencies() {
    try {
      const params = {
        fields: this.allFields,
        where: [
          {
            fieldName: 'status',
            operator: 'ExactMatch',
            values: ['active']
          }
        ],
        orderBy: [
          {
            fieldName: 'CreatedOn',
            SortType: 'DESC'
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response || !response.data) {
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching active emergencies:', error)
      toast.error('Failed to fetch active emergencies')
      return []
    }
  }

  async getCriticalEmergencies() {
    try {
      const params = {
        fields: this.allFields,
        where: [
          {
            fieldName: 'severity',
            operator: 'ExactMatch',
            values: ['critical']
          }
        ],
        orderBy: [
          {
            fieldName: 'CreatedOn',
            SortType: 'DESC'
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response || !response.data) {
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching critical emergencies:', error)
      toast.error('Failed to fetch critical emergencies')
      return []
    }
  }
}

export default new EmergencyService()