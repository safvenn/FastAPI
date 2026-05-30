import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Expense } from '../types'
import { Trash2, Calendar, DollarSign, Tag, FileText, Search, Clock } from 'lucide-react'
import { format, parseISO } from 'date-fns'

interface ExpenseListProps {
  expenses: Expense[]
  onExpenseDeleted: () => void
}

const categoryColors: { [key: string]: string } = {
  Food: 'border-green-500',
  Transportation: 'border-blue-500',
  Entertainment: 'border-purple-500',
  Shopping: 'border-pink-500',
  Bills: 'border-red-500',
  Healthcare: 'border-orange-500',
  Education: 'border-indigo-500',
  Other: 'border-gray-500',
}

const ExpenseList = ({ expenses, onExpenseDeleted }: ExpenseListProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const { token } = useAuth()

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return

    try {
      await axios.delete(`http://localhost:8000/delete?i=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      onExpenseDeleted()
    } catch (error) {
      console.error('Error deleting expense:', error)
    }
  }

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || expense.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['All', ...Array.from(new Set(expenses.map((e) => e.category)))]

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Expense History</h2>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
            placeholder="Search expenses..."
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Expense List */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No expenses found</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className={`expense-card ${categoryColors[expense.category] || 'border-gray-500'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{expense.title}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {expense.category}
                    </span>
                  </div>

                  {expense.discription && (
                    <p className="text-gray-600 text-sm mb-2">{expense.discription}</p>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold text-gray-900">${expense.amount}</span>
                    </div>
                    {expense.created_at && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(parseISO(expense.created_at), 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                    {expense.created_at && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{format(parseISO(expense.created_at), 'hh:mm a')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(expense.id)}
                  className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExpenseList
