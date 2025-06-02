import { toast } from 'react-toastify'

class PrescriptionService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'prescription'
    
    // All fields for fetch operations
    this.allFields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'patient_name', 'patient_id', 'medication', 'dosage', 'quantity', 'doctor', 'date', 'status', 'instructions'
    ]
    
    // Only updateable fields for create/update operations
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'patient_name', 'patient_id', 'medication', 'dosage', 'quantity', 'doctor', 'date', 'status', 'instructions'
    ]
  }

  async fetchPrescriptions(searchTerm = '', statusFilter = '') {
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
            fieldName: 'patient_name',
            operator: 'Contains',
            values: [searchTerm]
          }
        ]
      }

      // Add status filter if provided
      if (statusFilter && statusFilter !== 'all') {
        if (params.where) {
          params.whereGroups = [
            {
              operator: 'AND',
              subGroups: [
                {
                  conditions: params.where,
                  operator: ''
                },
                {
                  conditions: [
                    {
                      fieldName: 'status',
                      operator: 'ExactMatch',
                      values: [statusFilter]
                    }
                  ],
                  operator: ''
                }
              ]
            }
          ]
          delete params.where
        } else {
          params.where = [
            {
              fieldName: 'status',
              operator: 'ExactMatch',
              values: [statusFilter]
            }
          ]
        }
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response || !response.data) {
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching prescriptions:', error)
      toast.error('Failed to fetch prescriptions')
      return []
    }
  }

  async getPrescriptionById(prescriptionId) {
    try {
      const params = {
        fields: this.allFields
      }

      const response = await this.apperClient.getRecordById(this.tableName, prescriptionId, params)
      
      if (!response || !response.data) {
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching prescription with ID ${prescriptionId}:`, error)
      toast.error('Failed to fetch prescription details')
      return null
    }
  }

  async createPrescription(prescriptionData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {}
      this.updateableFields.forEach(field => {
        if (prescriptionData[field] !== undefined && prescriptionData[field] !== '') {
          if (field === 'quantity') {
            filteredData[field] = parseInt(prescriptionData[field]) || 0
          } else if (field === 'date') {
            filteredData[field] = prescriptionData[field] // ISO date format
          } else {
            filteredData[field] = prescriptionData[field]
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
          toast.success('Prescription created successfully')
          return successfulRecords[0].data
        } else {
          const failedRecord = response.results[0]
          if (failedRecord.errors) {
            failedRecord.errors.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
          } else {
            toast.error('Failed to create prescription')
          }
          return null
        }
      } else {
        toast.error('Failed to create prescription')
        return null
      }
    } catch (error) {
      console.error('Error creating prescription:', error)
      toast.error('Failed to create prescription')
      return null
    }
  }

  async updatePrescription(prescriptionId, prescriptionData) {
    try {
      // Filter to only include updateable fields
      const filteredData = { Id: prescriptionId }
      this.updateableFields.forEach(field => {
        if (prescriptionData[field] !== undefined) {
          if (field === 'quantity') {
            filteredData[field] = parseInt(prescriptionData[field]) || 0
          } else if (field === 'date') {
            filteredData[field] = prescriptionData[field] // ISO date format
          } else {
            filteredData[field] = prescriptionData[field]
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
          toast.success('Prescription updated successfully')
          return successfulRecords[0].data
        } else {
          toast.error('Failed to update prescription')
          return null
        }
      } else {
        toast.error('Failed to update prescription')
        return null
      }
    } catch (error) {
      console.error('Error updating prescription:', error)
      toast.error('Failed to update prescription')
      return null
    }
  }

  async deletePrescription(prescriptionId) {
    try {
      const params = {
        RecordIds: [prescriptionId]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        if (successfulDeletions.length > 0) {
          toast.success('Prescription deleted successfully')
          return true
        } else {
          toast.error('Failed to delete prescription')
          return false
        }
      } else {
        toast.error('Failed to delete prescription')
        return false
      }
    } catch (error) {
      console.error('Error deleting prescription:', error)
      toast.error('Failed to delete prescription')
      return false
    }
  }

  async dispensePrescription(prescriptionId, notes = '') {
    try {
      const updatedData = {
        Id: prescriptionId,
        status: 'dispensed'
      }

      if (notes) {
        updatedData.instructions = notes
      }

      const params = {
        records: [updatedData]
      }

      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        if (successfulRecords.length > 0) {
          toast.success('Prescription dispensed successfully')
          return successfulRecords[0].data
        } else {
          toast.error('Failed to dispense prescription')
          return null
        }
      } else {
        toast.error('Failed to dispense prescription')
        return null
      }
    } catch (error) {
      console.error('Error dispensing prescription:', error)
      toast.error('Failed to dispense prescription')
      return null
    }
  }

  async getPendingPrescriptions() {
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
      console.error('Error fetching pending prescriptions:', error)
      toast.error('Failed to fetch pending prescriptions')
      return []
    }
  }
}

export default new PrescriptionService()