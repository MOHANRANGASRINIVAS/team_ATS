import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Mail, Calendar, Plus, Trash2, Edit, Shield } from 'lucide-react'
import { toast } from 'react-toastify'
import api from '../../services/api'
import { useFormValidation, ValidatedInput } from '../../components/FormValidation'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deletingUser, setDeletingUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`)
      toast.success('HR user deleted successfully')
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete user')
    }
  }

  const handleAddUser = async (formData) => {
    try {
      await api.post('/admin/users', formData)
      toast.success('HR user added successfully')
      setShowAddForm(false)
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add user')
    }
  }

  const handleUpdateUser = async (userId, formData) => {
    try {
      await api.put(`/admin/users/${userId}`, formData)
      toast.success('HR user updated successfully')
      setEditingUser(null)
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update user')
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
          <h1 className="text-3xl font-bold text-gray-900">HR Users</h1>
          <p className="text-gray-600">Manage HR personnel accounts</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add HR User
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">All HR Users</h3>
          <span className="text-sm text-gray-500">{users.length} users found</span>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No HR users found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-semibold text-gray-900">{user.name}</h4>
                      <p className="text-xs text-gray-500">{user.role.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit user"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeletingUser(user)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete user"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {user.email}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Add HR User Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Add New HR User</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <AddHRForm onSubmit={handleAddUser} onCancel={() => setShowAddForm(false)} />
        </motion.div>
      )}

      {/* Edit HR User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit HR User</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <EditHRForm 
              user={editingUser} 
              onSubmit={handleUpdateUser}
              onCancel={() => setEditingUser(null)}
            />
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete HR User</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deletingUser.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteUser(deletingUser.id)
                  setDeletingUser(null)
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

// Add HR User Form Component
const AddHRForm = ({ onSubmit, onCancel }) => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues
  } = useFormValidation({
    name: '',
    email: '',
    password: ''
  })

  const handleFormSubmit = (formData) => {
    onSubmit({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: 'hr'
    })
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleSubmit(handleFormSubmit, {
        name: { required: true, message: 'Name is required' },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Valid email is required' },
        password: { required: true, minLength: 6, message: 'Password must be at least 6 characters' }
      })
    }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ValidatedInput
          name="name"
          label="HR Name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          touched={touched.name}
          placeholder="Enter HR name"
        />
        <ValidatedInput
          name="email"
          label="Email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          touched={touched.email}
          placeholder="Enter email address"
        />
      </div>
      <ValidatedInput
        name="password"
        label="Password"
        type="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.password}
        touched={touched.password}
        placeholder="Enter password"
      />
      <div className="flex justify-end space-x-3 mt-6">
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
          Add HR User
        </button>
      </div>
    </form>
  )
}

// Edit HR User Form Component
const EditHRForm = ({ user, onSubmit, onCancel }) => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues
  } = useFormValidation({
    name: user.name,
    email: user.email,
    password: ''
  })

  const handleFormSubmit = (formData) => {
    const updateData = {
      name: formData.name,
      email: formData.email
    }
    
    // Only include password if it was changed
    if (formData.password) {
      updateData.password = formData.password
    }
    
    onSubmit(user.id, updateData)
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleSubmit(handleFormSubmit, {
        name: { required: true, message: 'Name is required' },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Valid email is required' },
        password: { minLength: 6, message: 'Password must be at least 6 characters (leave blank to keep current)' }
      })
    }}>
      <div className="space-y-4">
        <ValidatedInput
          name="name"
          label="HR Name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          touched={touched.name}
          placeholder="Enter HR name"
        />
        <ValidatedInput
          name="email"
          label="Email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          touched={touched.email}
          placeholder="Enter email address"
        />
        <ValidatedInput
          name="password"
          label="Password (leave blank to keep current)"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          touched={touched.password}
          placeholder="Enter new password (optional)"
        />
      </div>
      <div className="flex justify-end space-x-3 mt-6">
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
          Update HR User
        </button>
      </div>
    </form>
  )
}

export default AdminUsers 