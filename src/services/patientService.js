import { toast } from 'react-toastify'

class PatientService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'patient'
    
    // All fields for fetch operations
    this.allFields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'first_name', 'last_name', 'date_of_birth', 'gender', 'phone', 'email', 'address',
      'emergency_contact', 'emergency_phone', 'blood_type', 'allergies', 'medications',
      'medical_history', 'insurance', 'registered_date'
    ]
    
    // Only updateable fields for create/update operations
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'first_name', 'last_name', 'date_of_birth', 'gender', 'phone', 'email', 'address',
      'emergency_contact', 'emergency_phone', 'blood_type', 'allergies', 'medications',
      'medical_history', 'insurance', 'registered_date'
    ]
  }

  async fetchPatients(searchTerm = '') {
    try {
      const params = {
        fields: this.allFields,
        orderBy: [
          {
            fieldName: 'registered_date',
            SortType: 'DESC'
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      }

      // Add search filter if provided
      if (searchTerm) {
        params.whereGroups = [
          {
            operator: 'OR',
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: 'first_name',
                    operator: 'Contains',
                    values: [searchTerm]
                  }
                ],
                operator: ''
              },
              {
                conditions: [
                  {
                    fieldName: 'last_name',
                    operator: 'Contains',
                    values: [searchTerm]
                  }
                ],
                operator: ''
              },
              {
                conditions: [
                  {
                    fieldName: 'email',
                    operator: 'Contains',
                    values: [searchTerm]
                  }
                ],
                operator: ''
              },
              {
                conditions: [
                  {
                    fieldName: 'phone',
                    operator: 'Contains',
                    values: [searchTerm]
                  }
                ],
                operator: ''
              }
            ]
          }
        ]
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response || !response.data) {
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching patients:', error)
      toast.error('Failed to fetch patients')
      return []
    }
  }

  async getPatientById(patientId) {
    try {
      const params = {
        fields: this.allFields
      }

      const response = await this.apperClient.getRecordById(this.tableName, patientId, params)
      
      if (!response || !response.data) {
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching patient with ID ${patientId}:`, error)
      toast.error('Failed to fetch patient details')
      return null
    }
  }

  async createPatient(patientData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {}
      this.updateableFields.forEach(field => {
        if (patientData[field] !== undefined && patientData[field] !== '') {
          if (field === 'date_of_birth' || field === 'registered_date') {
            filteredData[field] = patientData[field] // ISO date format
          } else {
            filteredData[field] = patientData[field]
          }
        }
      })

      // Set default values
      if (!filteredData.Name) {
        filteredData.Name = `${filteredData.first_name || ''} ${filteredData.last_name || ''}`.trim()
      }
      filteredData.registered_date = filteredData.registered_date || new Date().toISOString().split('T')[0]

      const params = {
        records: [filteredData]
      }

      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        if (successfulRecords.length > 0) {
          toast.success('Patient registered successfully')
          return successfulRecords[0].data
        } else {
          const failedRecord = response.results[0]
          if (failedRecord.errors) {
            failedRecord.errors.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
          } else {
            toast.error('Failed to register patient')
          }
          return null
        }
      } else {
        toast.error('Failed to register patient')
        return null
      }
    } catch (error) {
      console.error('Error creating patient:', error)
      toast.error('Failed to register patient')
      return null
    }
  }

  async updatePatient(patientId, patientData) {
    try {
      // Filter to only include updateable fields
      const filteredData = { Id: patientId }
      this.updateableFields.forEach(field => {
        if (patientData[field] !== undefined) {
          if (field === 'date_of_birth' || field === 'registered_date') {
            filteredData[field] = patientData[field] // ISO date format
          } else {
            filteredData[field] = patientData[field]
          }
        }
      })

      // Update Name field if first_name or last_name changed
      if (filteredData.first_name !== undefined || filteredData.last_name !== undefined) {
        filteredData.Name = `${filteredData.first_name || patientData.first_name || ''} ${filteredData.last_name || patientData.last_name || ''}`.trim()
      }

      const params = {
        records: [filteredData]
      }

      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        if (successfulRecords.length > 0) {
          toast.success('Patient information updated successfully')
          return successfulRecords[0].data
        } else {
          toast.error('Failed to update patient information')
          return null
        }
      } else {
        toast.error('Failed to update patient information')
        return null
      }
    } catch (error) {
      console.error('Error updating patient:', error)
      toast.error('Failed to update patient information')
      return null
    }
  }

  async deletePatient(patientId) {
    try {
      const params = {
        RecordIds: [patientId]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        if (successfulDeletions.length > 0) {
          toast.success('Patient deleted successfully')
          return true
        } else {
          toast.error('Failed to delete patient')
          return false
        }
      } else {
        toast.error('Failed to delete patient')
        return false
      }
    } catch (error) {
      console.error('Error deleting patient:', error)
      toast.error('Failed to delete patient')
      return false
    }
  }

  async searchPatientsByName(searchTerm) {
    try {
      const params = {
        fields: this.allFields,
        whereGroups: [
          {
            operator: 'OR',
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: 'first_name',
                    operator: 'Contains',
                    values: [searchTerm]
                  }
                ],
                operator: ''
              },
              {
                conditions: [
                  {
                    fieldName: 'last_name',
                    operator: 'Contains',
                    values: [searchTerm]
                  }
                ],
                operator: ''
              }
            ]
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
      console.error('Error searching patients by name:', error)
      toast.error('Failed to search patients')
      return []
    }
  }

  async getPatientsByBloodType(bloodType) {
    try {
      const params = {
        fields: this.allFields,
        where: [
          {
            fieldName: 'blood_type',
            operator: 'ExactMatch',
            values: [bloodType]
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
      console.error(`Error fetching patients with blood type ${bloodType}:`, error)
      toast.error('Failed to fetch patients by blood type')
      return []
    }
  }

  async getRecentPatients(limit = 10) {
    try {
      const params = {
        fields: this.allFields,
        orderBy: [
          {
            fieldName: 'registered_date',
            SortType: 'DESC'
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
      console.error('Error fetching recent patients:', error)
      toast.error('Failed to fetch recent patients')
      return []
    }
  }
}

export default new PatientService()