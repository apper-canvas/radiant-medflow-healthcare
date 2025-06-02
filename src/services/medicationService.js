import { toast } from 'react-toastify'

class MedicationService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'medication'
    
    // All fields for fetch operations
    this.allFields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'generic_name', 'category', 'stock', 'min_stock', 'price', 'supplier', 'expiry_date', 'location'
    ]
    
    // Only updateable fields for create/update operations
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'generic_name', 'category', 'stock', 'min_stock', 'price', 'supplier', 'expiry_date', 'location'
    ]
  }

  async fetchMedications(searchTerm = '', categoryFilter = '') {
    try {
      const params = {
        fields: this.allFields,
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      }

      // Add search filter if provided
      if (searchTerm) {
        params.where = [
          {
            fieldName: 'Name',
            operator: 'Contains',
            values: [searchTerm]
          }
        ]
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response || !response.data) {
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching medications:', error)
      toast.error('Failed to fetch medications')
      return []
    }
  }

  async getMedicationById(medicationId) {
    try {
      const params = {
        fields: this.allFields
      }

      const response = await this.apperClient.getRecordById(this.tableName, medicationId, params)
      
      if (!response || !response.data) {
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching medication with ID ${medicationId}:`, error)
      toast.error('Failed to fetch medication details')
      return null
    }
  }

  async createMedication(medicationData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {}
      this.updateableFields.forEach(field => {
        if (medicationData[field] !== undefined && medicationData[field] !== '') {
          if (field === 'stock' || field === 'min_stock') {
            filteredData[field] = parseInt(medicationData[field]) || 0
          } else if (field === 'price') {
            filteredData[field] = parseFloat(medicationData[field]) || 0
          } else {
            filteredData[field] = medicationData[field]
          }
        }
      })

      const params = {
        records: [filteredData]
      }

      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        if (successfulRecords.length > 0) {
          toast.success('Medication created successfully')
          return successfulRecords[0].data
        } else {
          const failedRecord = response.results[0]
          if (failedRecord.errors) {
            failedRecord.errors.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
          } else {
            toast.error('Failed to create medication')
          }
          return null
        }
      } else {
        toast.error('Failed to create medication')
        return null
      }
    } catch (error) {
      console.error('Error creating medication:', error)
      toast.error('Failed to create medication')
      return null
    }
  }

  async updateMedication(medicationId, medicationData) {
    try {
      // Filter to only include updateable fields
      const filteredData = { Id: medicationId }
      this.updateableFields.forEach(field => {
        if (medicationData[field] !== undefined) {
          if (field === 'stock' || field === 'min_stock') {
            filteredData[field] = parseInt(medicationData[field]) || 0
          } else if (field === 'price') {
            filteredData[field] = parseFloat(medicationData[field]) || 0
          } else {
            filteredData[field] = medicationData[field]
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
          toast.success('Medication updated successfully')
          return successfulRecords[0].data
        } else {
          toast.error('Failed to update medication')
          return null
        }
      } else {
        toast.error('Failed to update medication')
        return null
      }
    } catch (error) {
      console.error('Error updating medication:', error)
      toast.error('Failed to update medication')
      return null
    }
  }

  async deleteMedication(medicationId) {
    try {
      const params = {
        RecordIds: [medicationId]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        if (successfulDeletions.length > 0) {
          toast.success('Medication deleted successfully')
          return true
        } else {
          toast.error('Failed to delete medication')
          return false
        }
      } else {
        toast.error('Failed to delete medication')
        return false
      }
    } catch (error) {
      console.error('Error deleting medication:', error)
      toast.error('Failed to delete medication')
      return false
    }
  }

  async getLowStockMedications() {
    try {
      const params = {
        fields: this.allFields,
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response || !response.data) {
        return []
      }
      
      // Filter for low stock items on client side
      return response.data.filter(med => 
        med.stock !== undefined && 
        med.min_stock !== undefined && 
        parseInt(med.stock) <= parseInt(med.min_stock)
      ) || []
    } catch (error) {
      console.error('Error fetching low stock medications:', error)
      toast.error('Failed to fetch low stock medications')
      return []
    }
  }
}

export default new MedicationService()