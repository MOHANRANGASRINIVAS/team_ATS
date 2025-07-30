import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      checkAuth()
    } else {
      setLoading(false)
    }
  }, [token])

  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data)
    } catch (error) {
      console.error('Auth check failed:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { access_token } = response.data
      
      localStorage.setItem('token', access_token)
      setToken(access_token)
      
      // Set token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      
      // Get user info
      const userResponse = await api.get('/auth/me')
      setUser(userResponse.data)
      
      toast.success('Login successful!')
      return userResponse.data
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed')
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      const { access_token } = response.data
      
      localStorage.setItem('token', access_token)
      setToken(access_token)
      
      // Set token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      
      // Get user info
      const userResponse = await api.get('/auth/me')
      setUser(userResponse.data)
      
      toast.success('Registration successful!')
      return userResponse.data
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed')
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    delete api.defaults.headers.common['Authorization']
    toast.info('Logged out successfully')
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 