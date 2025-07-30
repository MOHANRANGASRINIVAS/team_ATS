import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Briefcase, 
  Users, 
  UserCheck, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react'
import { Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import api from '../../services/api'
import { useRealTime } from '../../contexts/RealTimeContext'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { refreshData, lastUpdate } = useRealTime()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard')
      setDashboardData(response.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const jobStatusData = {
    labels: ['Open', 'Allocated', 'Closed', 'Submitted'],
    datasets: [
      {
        data: [
          dashboardData?.open_jobs || 0,
          dashboardData?.allocated_jobs || 0,
          dashboardData?.closed_jobs || 0,
          dashboardData?.submitted_jobs || 0,
        ],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#6B7280',
          '#8B5CF6',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  }



  const stats = [
    {
      name: 'Total Jobs',
      value: dashboardData?.total_jobs || 0,
      icon: Briefcase,
      color: 'bg-blue-500',
    },
    {
      name: 'Open Jobs',
      value: dashboardData?.open_jobs || 0,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      name: 'Allocated Jobs',
      value: dashboardData?.allocated_jobs || 0,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      name: 'Closed Jobs',
      value: dashboardData?.closed_jobs || 0,
      icon: XCircle,
      color: 'bg-gray-500',
    },
    {
      name: 'Total Candidates',
      value: dashboardData?.total_candidates || 0,
      icon: Users,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of recruitment activities</p>
        </div>
        <button
          onClick={refreshData}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Status Distribution</h3>
          <div className="h-64">
            <Doughnut
              data={jobStatusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </motion.div>


      </div>
    </div>
  )
}

export default AdminDashboard 