export interface Expense {
  id: number
  title: string
  amount: number
  category: string
  discription?: string
  created_at?: string
  updated_at?: string
}

export interface User {
  id: number
  username: string
  email: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

export interface UserExpensesResponse {
  username: string
  total_expense: number
  expenses: Expense[]
}
