import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import Header from '../components/Header'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import StatsCards from '../components/StatsCards'
import ExpenseChart from '../components/ExpenseChart'
import AIChat from '../components/AIChat'
import { Expense } from '../types'

const Dashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [username, setUsername] = useState('')
  const [totalExpense, setTotalExpense] = useState(0)
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:8000/userexpenses', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setExpenses(response.data.expenses)
      setUsername(response.data.username)
      setTotalExpense(response.data.total_expense)
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [token])

  const handleExpenseAdded = () => {
    fetchExpenses()
  }

  const handleExpenseDeleted = () => {
    fetchExpenses()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header username={username} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats Cards */}
          <StatsCards expenses={expenses} totalExpense={totalExpense} />

          {/* Chart */}
          <ExpenseChart expenses={expenses} />

          {/* Add Expense Form */}
          <ExpenseForm onExpenseAdded={handleExpenseAdded} />

          {/* Expense List */}
          <ExpenseList expenses={expenses} onExpenseDeleted={handleExpenseDeleted} />

          {/* AI Chat */}
          <AIChat />
        </div>
      </main>
    </div>
  )
}

export default Dashboard
