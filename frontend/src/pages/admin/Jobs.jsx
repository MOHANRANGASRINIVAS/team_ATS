import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, MapPin, Building, Users, Filter, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../services/api'

const AdminJobs = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    source_company: ''
  })
  const [viewJob, setViewJob] = useState(null)
  const [editJob, setEditJob] = useState(null)
  const [hrUsers, setHrUsers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchJobs()
    fetchHrUsers()
  }, [filters])

  const fetchHrUsers = async () => {
    try {
      const response = await api.get('/admin/users')
      setHrUsers(response.data)
    } catch (error) {
      console.error('Error fetching HR users:', error)
    }
  }

  const handleViewJob = (job) => {
    setViewJob(job)
  }

  const handleEditJob = (job) => {
    setEditJob(job)
  }

  const handleUpdateJob = async (jobId, updates) => {
    try {
      await api.put(`/admin/jobs/${jobId}`, updates)
      toast.success('Job updated successfully')
      setEditJob(null)
      fetchJobs()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update job')
    }
  }

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.source_company) params.append('source_company', filters.source_company)
      
      const response = await api.get(`/admin/jobs?${params.toString()}`)
      setJobs(response.data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800'
      case 'allocated':
        return 'bg-blue-100 text-blue-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jobs Management</h1>
          <p className="text-gray-600">View and manage all job openings</p>
        </div>
        <button
          onClick={() => navigate('/admin/add-job')}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Job
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="allocated">Allocated</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source Company
            </label>
            <input
              type="text"
              value={filters.source_company}
              onChange={(e) => setFilters({ ...filters, source_company: e.target.value })}
              placeholder="Filter by company"
              className="input-field"
            />
          </div>
        </div>
      </motion.div>

      {/* Jobs List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">All Jobs</h3>
          <span className="text-sm text-gray-500">{jobs.length} jobs found</span>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <Briefcase className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No jobs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CTC
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opening Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job, index) => (
                  <motion.tr
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {job.job_id || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {job.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={job.description}>
                      {job.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {job.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {job.salary_package}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {job.assigned_hr_name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {job.opening_date ? new Date(job.opening_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewJob(job)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleEditJob(job)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* View Job Modal */}
      {viewJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
              <button
                onClick={() => setViewJob(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Job ID</label>
                  <p className="text-sm text-gray-900">{viewJob.job_id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(viewJob.status)}`}>
                    {viewJob.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <p className="text-sm text-gray-900">{viewJob.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="text-sm text-gray-900">{viewJob.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CTC</label>
                  <p className="text-sm text-gray-900">{viewJob.salary_package}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                  <p className="text-sm text-gray-900">{viewJob.assigned_hr_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Opening Date</label>
                  <p className="text-sm text-gray-900">
                    {viewJob.opening_date ? new Date(viewJob.opening_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Source</label>
                  <p className="text-sm text-gray-900">{viewJob.source_company}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="text-sm text-gray-900 mt-1">{viewJob.description}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Job Modal */}
      {editJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Job</h3>
              <button
                onClick={() => setEditJob(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <EditJobForm 
              job={editJob} 
              hrUsers={hrUsers}
              onUpdate={handleUpdateJob}
              onCancel={() => setEditJob(null)}
            />
          </motion.div>
        </div>
      )}
    </div>
  )
}

// Edit Job Form Component
const EditJobForm = ({ job, hrUsers, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    title: job.title,
    description: job.description,
    location: job.location,
    salary_package: job.salary_package,
    status: job.status,
    assigned_hr: job.assigned_hr || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(job.job_id, formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Job Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">CTC</label>
          <input
            type="text"
            name="salary_package"
            value={formData.salary_package}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-field"
          >
            <option value="open">Open</option>
            <option value="allocated">Allocated</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Assign to HR</label>
          <select
            name="assigned_hr"
            value={formData.assigned_hr}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Unassigned</option>
            {hrUsers.map(hr => (
              <option key={hr.id} value={hr.id}>
                {hr.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="input-field"
          required
        />
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Update Job
        </button>
      </div>
    </form>
  )
}

export default AdminJobs 