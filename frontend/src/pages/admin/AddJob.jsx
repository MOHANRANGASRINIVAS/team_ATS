import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, ArrowLeft, Plus } from 'lucide-react'
import { toast } from 'react-toastify'
import api from '../../services/api'
import { useFormValidation, ValidatedInput, ValidatedSelect } from '../../components/FormValidation'

const AdminAddJob = () => {
  const navigate = useNavigate()
  const [uploadMethod, setUploadMethod] = useState('manual') // 'manual' or 'csv'
  const [uploadedFile, setUploadedFile] = useState(null)
  const [previewData, setPreviewData] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [hrUsers, setHrUsers] = useState([])
  const [loading, setLoading] = useState(true)

  // Form validation for manual job entry
  const {
    values: manualForm,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues
  } = useFormValidation({
    title: '',
    description: '',
    location: '',
    ctc: '',
    assigned_hr: ''
  })

  // Load HR users
  React.useEffect(() => {
    fetchHrUsers()
  }, [])

  const fetchHrUsers = async () => {
    try {
      const response = await api.get('/admin/users')
      setHrUsers(response.data)
    } catch (error) {
      console.error('Error fetching HR users:', error)
    } finally {
      setLoading(false)
    }
  }

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file && file.type === 'text/csv') {
      setUploadedFile(file)
      parseCSV(file)
    } else {
      toast.error('Please upload a valid CSV file')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  })

  const parseCSV = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim())
      
      const parsedData = lines.slice(1).map((line, index) => {
        const values = line.split(',')
        const row = {}
        headers.forEach((header, colIndex) => {
          row[header] = values[colIndex]?.trim() || ''
        })
        // Add assign dropdown for each row
        row.assigned_hr = ''
        row.id = index // For React key
        return row
      })
      
      setPreviewData({ headers, data: parsedData })
    }
    reader.readAsText(file)
  }

  const handleManualSubmit = async (formData) => {
    setUploading(true)
    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        salary_package: formData.ctc,
        source_company: 'Manual Entry',
        assigned_hr: formData.assigned_hr
      }
      
      const response = await api.post('/admin/add-job', jobData)
      toast.success('Job added successfully!')
      navigate('/admin/jobs')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add job')
    } finally {
      setUploading(false)
    }
  }

  const handleCSVUpload = async () => {
    if (!previewData || !previewData.data) return

    setUploading(true)
    try {
      // Prepare jobs data with assigned HR
      const jobsData = previewData.data.map(row => ({
        title: row.title,
        description: row.description,
        location: row.location,
        ctc: row.ctc,
        assigned_hr: row.assigned_hr || null
      }))

      const response = await api.post('/admin/add-jobs-bulk', jobsData)
      
      toast.success(response.data.message)
      navigate('/admin/jobs')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add jobs')
    } finally {
      setUploading(false)
    }
  }

  const validateHeaders = () => {
    if (!previewData) return false
    const requiredHeaders = ['title', 'description', 'location', 'ctc']
    const missingHeaders = requiredHeaders.filter(header => 
      !previewData.headers.some(h => h.toLowerCase().includes(header.toLowerCase()))
    )
    return missingHeaders.length === 0
  }

  const handleAssignHRChange = (rowId, hrId) => {
    if (!previewData) return
    
    const updatedData = previewData.data.map(row => 
      row.id === rowId ? { ...row, assigned_hr: hrId } : row
    )
    setPreviewData({ ...previewData, data: updatedData })
  }

  const hrOptions = [
    { value: '', label: 'Select HR User' },
    ...hrUsers.map(hr => ({
      value: hr.id,
      label: hr.name
    }))
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin/jobs')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add Job</h1>
            <p className="text-gray-600">Add new job openings manually or via CSV</p>
          </div>
        </div>
      </motion.div>

      {/* Upload Method Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Upload Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setUploadMethod('manual')}
            className={`p-4 border-2 rounded-lg transition-colors ${
              uploadMethod === 'manual'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 hover:border-primary-400'
            }`}
          >
            <Plus className="h-8 w-8 mx-auto mb-2" />
            <p className="font-medium">Manual Entry</p>
            <p className="text-sm text-gray-600">Add jobs one by one</p>
          </button>
          <button
            onClick={() => setUploadMethod('csv')}
            className={`p-4 border-2 rounded-lg transition-colors ${
              uploadMethod === 'csv'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 hover:border-primary-400'
            }`}
          >
            <UploadIcon className="h-8 w-8 mx-auto mb-2" />
            <p className="font-medium">CSV Upload</p>
            <p className="text-sm text-gray-600">Upload multiple jobs via CSV</p>
          </button>
        </div>
      </motion.div>

      {uploadMethod === 'manual' ? (
        /* Manual Job Entry Form */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Job Entry</h3>
          <form onSubmit={(e) => {
            e.preventDefault()
            handleSubmit(handleManualSubmit, {
              title: { required: true, message: 'Job title is required' },
              description: { required: true, message: 'Job description is required' },
              location: { required: true, message: 'Location is required' },
              ctc: { required: true, message: 'CTC is required' },
              assigned_hr: { required: true, message: 'Please assign to an HR' }
            })
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                name="title"
                label="Job Title"
                value={manualForm.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.title}
                touched={touched.title}
                placeholder="e.g., Software Engineer"
              />
              <ValidatedInput
                name="location"
                label="Location"
                value={manualForm.location}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.location}
                touched={touched.location}
                placeholder="e.g., Bangalore"
              />
              <ValidatedInput
                name="ctc"
                label="CTC (Cost to Company)"
                value={manualForm.ctc}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.ctc}
                touched={touched.ctc}
                placeholder="e.g., 8-12 LPA"
              />
              <ValidatedSelect
                name="assigned_hr"
                label="Assign to HR"
                options={hrOptions}
                value={manualForm.assigned_hr}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.assigned_hr}
                touched={touched.assigned_hr}
              />
            </div>
            <ValidatedInput
              name="description"
              label="Job Description"
              value={manualForm.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.description}
              touched={touched.description}
              placeholder="Detailed job description..."
            />
            <button
              type="submit"
              disabled={uploading}
              className="mt-4 w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Adding Job...
                </div>
              ) : (
                'Add Job'
              )}
            </button>
          </form>
        </motion.div>
      ) : (
        /* CSV Upload Section */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload CSV File</h3>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400'
              }`}
            >
              <input {...getInputProps()} />
              <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                {isDragActive
                  ? 'Drop the CSV file here'
                  : 'Drag and drop a CSV file here, or click to select'}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Only CSV files are supported
              </p>
            </div>

            {uploadedFile && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900">
                    {uploadedFile.name}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Size: {(uploadedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}


          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">CSV Preview</h3>
            
            {previewData ? (
              <div className="space-y-4">
                <div className={`flex items-center p-3 rounded-lg ${
                  validateHeaders() 
                    ? 'bg-green-50 text-green-800' 
                    : 'bg-red-50 text-red-800'
                }`}>
                  {validateHeaders() ? (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2" />
                  )}
                  <span className="text-sm font-medium">
                    {validateHeaders() 
                      ? 'File format is valid' 
                      : 'Missing required columns'
                    }
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Job Title
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CTC
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assign to HR
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {previewData.data.map((row, rowIndex) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-900">
                            {row.title}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900 max-w-xs truncate" title={row.description}>
                            {row.description}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900">
                            {row.location}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900">
                            {row.ctc}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900">
                            <select
                              value={row.assigned_hr}
                              onChange={(e) => handleAssignHRChange(row.id, e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="">Select HR</option>
                              {hrUsers.map(hr => (
                                <option key={hr.id} value={hr.id}>
                                  {hr.name}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={handleCSVUpload}
                  disabled={uploading || !validateHeaders()}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding Jobs...
                    </div>
                  ) : (
                    'Add Jobs'
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-sm">No file selected</p>
                <p className="text-xs">Upload a CSV file to see parsed data</p>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* CSV Format Instructions */}
      {uploadMethod === 'csv' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">CSV Format Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Required Columns:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• title - Job title</li>
                <li>• description - Job description</li>
                <li>• location - Job location</li>
                <li>• ctc - Cost to Company</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Example Format:</h4>
              <div className="text-xs bg-gray-50 p-3 rounded">
                <p>title,description,location,ctc</p>
                <p>Software Engineer,Develop web applications,Bangalore,8-12 LPA</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default AdminAddJob 