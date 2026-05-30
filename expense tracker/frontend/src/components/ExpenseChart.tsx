import { Expense } from '../types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts'
import { BarChart3, TrendingUp } from 'lucide-react'
import { format, parseISO, startOfDay, isValid } from 'date-fns'

interface ExpenseChartProps {
  expenses: Expense[]
}

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#6B7280']

const ExpenseChart = ({ expenses }: ExpenseChartProps) => {
  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find((item) => item.category === expense.category)
    if (existing) {
      existing.amount += expense.amount
    } else {
      acc.push({ category: expense.category, amount: expense.amount })
    }
    return acc
  }, [] as { category: string; amount: number }[])

  // Daily expenses data
  const dailyData = expenses
    .filter((expense) => expense.created_at)
    .reduce((acc, expense) => {
      try {
        const date = format(parseISO(expense.created_at!), 'MMM dd')
        const existing = acc.find((item) => item.date === date)
        if (existing) {
          existing.amount += expense.amount
        } else {
          acc.push({ date, amount: expense.amount })
        }
      } catch (error) {
        console.error('Error parsing date:', error)
      }
      return acc
    }, [] as { date: string; amount: number }[])
    .slice(-7) // Last 7 days

  if (expenses.length === 0) {
    return null
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-purple-100 p-2 rounded-lg">
          <BarChart3 className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Expense Analytics</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bar Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Trend */}
        {dailyData.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Daily Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExpenseChart
