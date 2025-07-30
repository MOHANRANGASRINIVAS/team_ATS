import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, MapPin, Building, Filter, Users, Eye, Edit, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { toast } from 'react-toastify'

const HRJobs = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: ''
  })
  const [selectedJob, setSelectedJob] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false)
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [candidateForm, setCandidateForm] = useState({
    name: '',
    email: '',
    phone: '',
    pan_number: '',
    current_location: '',
    hometown: '',
    total_experience: '',
    relevant_experience: '',
    // Class X
    education_x_institute: '',
    education_x_start_date: '',
    education_x_end_date: '',
    education_x_percentage: '',
    // Class XII
    education_xii_institute: '',
    education_xii_start_date: '',
    education_xii_end_date: '',
    education_xii_percentage: '',
    // Degree
    education_degree_name: '',
    education_degree_institute: '',
    education_degree_start_date: '',
    education_degree_end_date: '',
    education_degree_percentage: '',
    // Legacy education fields
    education_x: '',
    education_xii: '',
    education_degree: '',
    education_percentage: '',
    education_duration: '',
    experience_entries: [],
    certifications: '',
    publications: '',
    references: '',
    linkedin: '',
    github: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    fetchJobs()
  }, [filters])

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      
      const response = await api.get(`/hr/jobs?${params.toString()}`)
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
        return 'bg-yellow-100 text-yellow-800'
      case 'allocated':
        return 'bg-blue-100 text-blue-800'
      case 'closed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleViewCandidates = (job) => {
    setSelectedJob(job)
    setShowViewModal(true)
  }

  const handleAddCandidate = (job) => {
    setSelectedJob(job)
    setShowAddCandidateModal(true)
  }

  const handleUpdateStatus = (job) => {
    setSelectedJob(job)
    setNewStatus(job.status)
    setShowUpdateStatusModal(true)
  }

  const handleSaveCandidate = async () => {
    try {
      // Validate required fields
      if (!candidateForm.name || !candidateForm.email || !candidateForm.phone) {
        toast.error('Please fill in all required fields (Name, Email, Phone)')
        return
      }

      const candidateData = {
        ...candidateForm,
        job_id: selectedJob.job_id,
        status: 'applied',
        applied_date: new Date().toISOString()
      }
      
      const response = await api.post('/candidates', candidateData)
      toast.success('Candidate added successfully!')
      setShowAddCandidateModal(false)
      setCandidateForm({
        name: '',
        email: '',
        phone: '',
        pan_number: '',
        current_location: '',
        hometown: '',
        total_experience: '',
        relevant_experience: '',
        // Class X
        education_x_institute: '',
        education_x_start_date: '',
        education_x_end_date: '',
        education_x_percentage: '',
        // Class XII
        education_xii_institute: '',
        education_xii_start_date: '',
        education_xii_end_date: '',
        education_xii_percentage: '',
        // Degree
        education_degree_name: '',
        education_degree_institute: '',
        education_degree_start_date: '',
        education_degree_end_date: '',
        education_degree_percentage: '',
        // Legacy education fields
        education_x: '',
        education_xii: '',
        education_degree: '',
        education_percentage: '',
        education_duration: '',
        experience_entries: [],
        certifications: '',
        publications: '',
        references: '',
        linkedin: '',
        github: ''
      })
    } catch (error) {
      console.error('Error adding candidate:', error)
      const errorMessage = error.response?.data?.detail || 'Failed to add candidate'
      toast.error(errorMessage)
    }
  }

  const handleUpdateJobStatus = async () => {
    try {
      await api.put(`/hr/jobs/${selectedJob.job_id}/status?status=${newStatus}`)
      toast.success('Job status updated successfully!')
      setShowUpdateStatusModal(false)
      fetchJobs() // Refresh the jobs list
    } catch (error) {
      console.error('Error updating job status:', error)
      toast.error('Failed to update job status')
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
      >
        <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
        <p className="text-gray-600">View your assigned job openings</p>
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
        </div>
      </motion.div>

      {/* Jobs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Job Openings</h2>
          <span className="text-sm text-gray-500">{jobs.length} jobs found</span>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No jobs found</p>
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
                {jobs.map((job) => (
                  <tr key={job.job_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {job.job_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {job.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={job.description}>
                        {job.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {job.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{job.salary_package}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(job.opening_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewCandidates(job)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View Candidates
                        </button>
                        <button
                          onClick={() => handleAddCandidate(job)}
                          className="text-green-600 hover:text-green-900 flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" />
                          Add Candidate
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(job)}
                          className="text-purple-600 hover:text-purple-900 flex items-center gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          Update Status
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* View Candidates Modal */}
      {showViewModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Candidates for {selectedJob.title}</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <CandidatesList jobId={selectedJob.job_id} />
          </div>
        </div>
      )}

      {/* Add Candidate Modal */}
      {showAddCandidateModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Candidate for {selectedJob.title}</h3>
              <button
                onClick={() => setShowAddCandidateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <AddCandidateForm 
              formData={candidateForm}
              setFormData={setCandidateForm}
              onSave={handleSaveCandidate}
            />
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showUpdateStatusModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Update Job Status</h3>
              <button
                onClick={() => setShowUpdateStatusModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <p className="text-gray-900">{selectedJob.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Status
                </label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedJob.status)}`}>
                  {selectedJob.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="input-field"
                >
                  <option value="allocated">Allocated</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowUpdateStatusModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateJobStatus}
                  className="btn-primary"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Candidates List Component
const CandidatesList = ({ jobId }) => {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchCandidates()
  }, [jobId])

  const fetchCandidates = async () => {
    try {
      const response = await api.get(`/hr/candidates/${jobId}`)
      setCandidates(response.data)
    } catch (error) {
      console.error('Error fetching candidates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateCandidateStatus = async () => {
    try {
      await api.put(`/hr/candidates/${selectedCandidate.id}/status?status=${newStatus}&notes=${notes}`)
      toast.success('Candidate status updated successfully!')
      setShowUpdateStatusModal(false)
      fetchCandidates() // Refresh the candidates list
    } catch (error) {
      console.error('Error updating candidate status:', error)
      toast.error('Failed to update candidate status')
    }
  }

  const handleUpdateStatus = (candidate) => {
    setSelectedCandidate(candidate)
    setNewStatus(candidate.status)
    setNotes('')
    setShowUpdateStatusModal(true)
  }

  if (loading) {
    return <div className="text-center py-4">Loading candidates...</div>
  }

  if (candidates.length === 0) {
    return <div className="text-center py-4 text-gray-500">No candidates found for this job.</div>
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-900">{candidate.name}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{candidate.email}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{candidate.phone}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{candidate.experience || 'N/A'}</td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    candidate.status === 'selected' ? 'bg-green-100 text-green-800' :
                    candidate.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    candidate.status === 'interviewed' ? 'bg-blue-100 text-blue-800' :
                    candidate.status === 'in_progress' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {candidate.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  <button 
                    onClick={() => handleUpdateStatus(candidate)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Update Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Candidate Status Modal */}
      {showUpdateStatusModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Update Candidate Status</h3>
              <button
                onClick={() => setShowUpdateStatusModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Candidate Name
                </label>
                <p className="text-gray-900">{selectedCandidate.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Status
                </label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedCandidate.status === 'selected' ? 'bg-green-100 text-green-800' :
                  selectedCandidate.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  selectedCandidate.status === 'interviewed' ? 'bg-blue-100 text-blue-800' :
                  selectedCandidate.status === 'in_progress' ? 'bg-orange-100 text-orange-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedCandidate.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="input-field"
                >
                  <option value="applied">Applied</option>
                  <option value="in_progress">In Progress</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-field"
                  rows="3"
                  placeholder="Add any notes about this candidate..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowUpdateStatusModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCandidateStatus}
                  className="btn-primary"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Add Candidate Form Component
const AddCandidateForm = ({ formData, setFormData, onSave }) => {
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleExperienceChange = (index, field, value) => {
    setFormData(prev => {
      const newExperienceEntries = [...(prev.experience_entries || [])]
      if (!newExperienceEntries[index]) {
        newExperienceEntries[index] = {
          organization: '',
          end_client: '',
          project: '',
          start_month_year: '',
          end_month_year: '',
          technology_tools: ''
        }
      }
      newExperienceEntries[index][field] = value
      return { ...prev, experience_entries: newExperienceEntries }
    })
  }

  const addExperienceEntry = () => {
    setFormData(prev => ({
      ...prev,
      experience_entries: [...(prev.experience_entries || []), {
        organization: '',
        end_client: '',
        project: '',
        start_month_year: '',
        end_month_year: '',
        technology_tools: ''
      }]
    }))
  }

  const removeExperienceEntry = (index) => {
    setFormData(prev => ({
      ...prev,
      experience_entries: prev.experience_entries.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Required Fields */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-blue-900 mb-4">Required Information *</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
            <input
              type="text"
              value={formData.pan_number || ''}
              onChange={(e) => handleChange('pan_number', e.target.value)}
              className="input-field"
              placeholder="ABCDE1234F"
            />
          </div>
        </div>
      </div>

      {/* Location and Experience */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Location & Experience</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
            <input
              type="text"
              value={formData.current_location || ''}
              onChange={(e) => handleChange('current_location', e.target.value)}
              className="input-field"
              placeholder="e.g., Bangalore, Karnataka"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hometown</label>
            <input
              type="text"
              value={formData.hometown || ''}
              onChange={(e) => handleChange('hometown', e.target.value)}
              className="input-field"
              placeholder="e.g., Chennai, Tamil Nadu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Experience</label>
            <input
              type="text"
              value={formData.total_experience || ''}
              onChange={(e) => handleChange('total_experience', e.target.value)}
              className="input-field"
              placeholder="e.g., 5 years"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relevant Experience</label>
            <input
              type="text"
              value={formData.relevant_experience || ''}
              onChange={(e) => handleChange('relevant_experience', e.target.value)}
              className="input-field"
              placeholder="e.g., 3 years in React"
            />
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-green-900 mb-4">Education</h4>
        
        {/* Class X */}
        <div className="mb-6">
          <h5 className="text-md font-medium text-green-800 mb-3">Class X</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institute/School Name</label>
              <input
                type="text"
                value={formData.education_x_institute || ''}
                onChange={(e) => handleChange('education_x_institute', e.target.value)}
                className="input-field"
                placeholder="e.g., St. Mary's High School"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (Month & Year)</label>
              <input
                type="text"
                value={formData.education_x_start_date || ''}
                onChange={(e) => handleChange('education_x_start_date', e.target.value)}
                className="input-field"
                placeholder="e.g., June 2014"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Month & Year)</label>
              <input
                type="text"
                value={formData.education_x_end_date || ''}
                onChange={(e) => handleChange('education_x_end_date', e.target.value)}
                className="input-field"
                placeholder="e.g., March 2015"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Percentage</label>
              <input
                type="text"
                value={formData.education_x_percentage || ''}
                onChange={(e) => handleChange('education_x_percentage', e.target.value)}
                className="input-field"
                placeholder="e.g., 85%"
              />
            </div>
          </div>
        </div>

        {/* Class XII */}
        <div className="mb-6">
          <h5 className="text-md font-medium text-green-800 mb-3">Class XII</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institute/School Name</label>
              <input
                type="text"
                value={formData.education_xii_institute || ''}
                onChange={(e) => handleChange('education_xii_institute', e.target.value)}
                className="input-field"
                placeholder="e.g., St. Mary's High School"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (Month & Year)</label>
              <input
                type="text"
                value={formData.education_xii_start_date || ''}
                onChange={(e) => handleChange('education_xii_start_date', e.target.value)}
                className="input-field"
                placeholder="e.g., June 2015"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Month & Year)</label>
              <input
                type="text"
                value={formData.education_xii_end_date || ''}
                onChange={(e) => handleChange('education_xii_end_date', e.target.value)}
                className="input-field"
                placeholder="e.g., March 2016"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Percentage</label>
              <input
                type="text"
                value={formData.education_xii_percentage || ''}
                onChange={(e) => handleChange('education_xii_percentage', e.target.value)}
                className="input-field"
                placeholder="e.g., 82%"
              />
            </div>
          </div>
        </div>

        {/* Degree */}
        <div className="mb-6">
          <h5 className="text-md font-medium text-green-800 mb-3">Degree</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Degree Name</label>
              <input
                type="text"
                value={formData.education_degree_name || ''}
                onChange={(e) => handleChange('education_degree_name', e.target.value)}
                className="input-field"
                placeholder="e.g., B.Tech Computer Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">University/Institute Name</label>
              <input
                type="text"
                value={formData.education_degree_institute || ''}
                onChange={(e) => handleChange('education_degree_institute', e.target.value)}
                className="input-field"
                placeholder="e.g., Anna University"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (Month & Year)</label>
              <input
                type="text"
                value={formData.education_degree_start_date || ''}
                onChange={(e) => handleChange('education_degree_start_date', e.target.value)}
                className="input-field"
                placeholder="e.g., August 2018"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Month & Year)</label>
              <input
                type="text"
                value={formData.education_degree_end_date || ''}
                onChange={(e) => handleChange('education_degree_end_date', e.target.value)}
                className="input-field"
                placeholder="e.g., May 2022"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Percentage/CGPA</label>
              <input
                type="text"
                value={formData.education_degree_percentage || ''}
                onChange={(e) => handleChange('education_degree_percentage', e.target.value)}
                className="input-field"
                placeholder="e.g., 78% or 8.5 CGPA"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Experience Entries */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-yellow-900">Work Experience</h4>
          <button
            type="button"
            onClick={addExperienceEntry}
            className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
          >
            + Add Experience
          </button>
        </div>
        
        {(formData.experience_entries || []).map((entry, index) => (
          <div key={index} className="border border-yellow-200 rounded-lg p-4 mb-4 bg-white">
            <div className="flex justify-between items-center mb-3">
              <h5 className="font-medium text-gray-900">Experience {index + 1}</h5>
              <button
                type="button"
                onClick={() => removeExperienceEntry(index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                <input
                  type="text"
                  value={entry.organization || ''}
                  onChange={(e) => handleExperienceChange(index, 'organization', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Vaeso India Pvt Ltd"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Client</label>
                <input
                  type="text"
                  value={entry.end_client || ''}
                  onChange={(e) => handleExperienceChange(index, 'end_client', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Vaeso India Pvt Ltd"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                <input
                  type="text"
                  value={entry.project || ''}
                  onChange={(e) => handleExperienceChange(index, 'project', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Implementation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Month & Year</label>
                <input
                  type="text"
                  value={entry.start_month_year || ''}
                  onChange={(e) => handleExperienceChange(index, 'start_month_year', e.target.value)}
                  className="input-field"
                  placeholder="e.g., June 2021"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Month & Year</label>
                <input
                  type="text"
                  value={entry.end_month_year || ''}
                  onChange={(e) => handleExperienceChange(index, 'end_month_year', e.target.value)}
                  className="input-field"
                  placeholder="e.g., August 2023"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technology/Tools Used</label>
                <input
                  type="text"
                  value={entry.technology_tools || ''}
                  onChange={(e) => handleExperienceChange(index, 'technology_tools', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Automation Testing, Java Selenium, BDD Cucumber, Cypress"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Information */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-purple-900 mb-4">Additional Information</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
            <textarea
              value={formData.certifications || ''}
              onChange={(e) => handleChange('certifications', e.target.value)}
              className="input-field"
              rows="3"
              placeholder="List any relevant certifications..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Publications</label>
            <textarea
              value={formData.publications || ''}
              onChange={(e) => handleChange('publications', e.target.value)}
              className="input-field"
              rows="3"
              placeholder="List any publications, research papers, or technical articles..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">References</label>
            <textarea
              value={formData.references || ''}
              onChange={(e) => handleChange('references', e.target.value)}
              className="input-field"
              rows="3"
              placeholder="List professional references with contact information..."
            />
          </div>
        </div>
      </div>

      {/* Legacy Fields (for backward compatibility) */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
            <input
              type="url"
              value={formData.linkedin || ''}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              className="input-field"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Profile</label>
            <input
              type="url"
              value={formData.github || ''}
              onChange={(e) => handleChange('github', e.target.value)}
              className="input-field"
              placeholder="https://github.com/username"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          onClick={() => setFormData({
            name: '',
            email: '',
            phone: '',
            pan_number: '',
            current_location: '',
            hometown: '',
            total_experience: '',
            relevant_experience: '',
            // Class X
            education_x_institute: '',
            education_x_start_date: '',
            education_x_end_date: '',
            education_x_percentage: '',
            // Class XII
            education_xii_institute: '',
            education_xii_start_date: '',
            education_xii_end_date: '',
            education_xii_percentage: '',
            // Degree
            education_degree_name: '',
            education_degree_institute: '',
            education_degree_start_date: '',
            education_degree_end_date: '',
            education_degree_percentage: '',
            // Legacy education fields
            education_x: '',
            education_xii: '',
            education_degree: '',
            education_percentage: '',
            education_duration: '',
            experience_entries: [],
            certifications: '',
            publications: '',
            references: '',
            linkedin: '',
            github: ''
          })}
          className="btn-secondary"
        >
          Reset
        </button>
        <button
          onClick={onSave}
          className="btn-primary"
        >
          Save Candidate
        </button>
      </div>
    </div>
  )
}

export default HRJobs 