import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, Edit } from 'lucide-react'
import api from '../../services/api'
import { toast } from 'react-toastify'

const AdminCandidates = () => {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [statusForm, setStatusForm] = useState({ status: '', notes: '' })

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      const response = await api.get('/admin/candidates')
      setCandidates(response.data)
    } catch (error) {
      console.error('Error fetching candidates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    try {
      await api.put(`/candidates/${selectedCandidate.id}/status?status=${statusForm.status}&notes=${statusForm.notes}`)
      toast.success('Candidate status updated successfully')
      setShowStatusModal(false)
      setSelectedCandidate(null)
      setStatusForm({ status: '', notes: '' })
      fetchCandidates()
    } catch (error) {
      toast.error('Failed to update candidate status')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'selected':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'interviewed':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-orange-100 text-orange-800'
      case 'applied':
        return 'bg-yellow-100 text-yellow-800'
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
      >
        <h1 className="text-3xl font-bold text-gray-900">All Candidates</h1>
        <p className="text-gray-600">View all candidate applications</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Candidates</h3>
          <span className="text-sm text-gray-500">{candidates.length} candidates found</span>
        </div>
        {candidates.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No candidates found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Education</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Skills</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Projects</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">LinkedIn</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">GitHub</th>
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
                    <td className="px-4 py-2 text-sm text-gray-900">{candidate.experience}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{candidate.education}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{candidate.skills}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{candidate.projects}</td>
                    <td className="px-4 py-2 text-sm text-blue-600">
                      {candidate.linkedin && (
                        <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-blue-600">
                      {candidate.github && (
                        <a href={candidate.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <div className="flex space-x-2">
                        <button onClick={() => { setSelectedCandidate(candidate); setShowViewModal(true) }} className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                          <Eye className="h-4 w-4" /> View
                        </button>
                        <button onClick={() => { setSelectedCandidate(candidate); setStatusForm({ status: candidate.status, notes: candidate.notes || '' }); setShowStatusModal(true) }} className="text-green-600 hover:text-green-900 flex items-center gap-1">
                          <Edit className="h-4 w-4" /> Update Status
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

      {/* View Candidate Modal */}
      {showViewModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Candidate Details</h3>
              <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-2">
              <div><span className="font-medium">Name:</span> {selectedCandidate.name}</div>
              <div><span className="font-medium">Email:</span> {selectedCandidate.email}</div>
              <div><span className="font-medium">Phone:</span> {selectedCandidate.phone}</div>
              <div><span className="font-medium">Experience:</span> {selectedCandidate.experience}</div>
              <div><span className="font-medium">Education:</span> {selectedCandidate.education}</div>
              <div><span className="font-medium">Skills:</span> {selectedCandidate.skills}</div>
              <div><span className="font-medium">Projects:</span> {selectedCandidate.projects}</div>
              <div><span className="font-medium">LinkedIn:</span> {selectedCandidate.linkedin && (<a href={selectedCandidate.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{selectedCandidate.linkedin}</a>)}</div>
              <div><span className="font-medium">GitHub:</span> {selectedCandidate.github && (<a href={selectedCandidate.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{selectedCandidate.github}</a>)}</div>
              <div><span className="font-medium">Status:</span> <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCandidate.status)}`}>{selectedCandidate.status}</span></div>
              <div><span className="font-medium">Notes:</span> {selectedCandidate.notes}</div>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Update Status for {selectedCandidate.name}</h3>
              <button onClick={() => setShowStatusModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={statusForm.notes}
                  onChange={(e) => setStatusForm({ ...statusForm, notes: e.target.value })}
                  className="input-field"
                  rows="3"
                  placeholder="Add notes about the candidate..."
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={() => setShowStatusModal(false)} className="btn-secondary">Cancel</button>
                <button onClick={handleStatusUpdate} className="btn-primary">Update Status</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCandidates 