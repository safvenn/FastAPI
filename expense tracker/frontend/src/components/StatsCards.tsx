import { Expense } from '../types'
import { DollarSign, TrendingUp, ShoppingBag, Calendar } from 'lucide-react'

interface StatsCardsProps {
  expenses: Expense[]
  totalExpense: number
}

const StatsCards = ({ expenses, totalExpense }: StatsCardsProps) => {
  const thisMonthExpenses = expenses.length
  const avgExpense = expenses.length > 0 ? Math.round(totalExpense / expenses.length) : 0
  
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as { [key: string]: number })

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]

  const stats = [
    {
      title: 'Total Expenses',
      value: `$${totalExpense}`,
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'This Month',
      value: thisMonthExpenses,
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Average Expense',
      value: `$${avgExpense}`,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Top Category',
      value: topCategory ? topCategory[0] : 'N/A',
      icon: ShoppingBag,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="card hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`${stat.bgColor} p-3 rounded-lg`}>
              <stat.icon className={`w-8 h-8 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards
