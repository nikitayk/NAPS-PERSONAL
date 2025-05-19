import { useState, useEffect } from "react"
import axios from "axios"

// Adjust these types to match your backend response structure
export type ChartDatum = {
  label: string
  value: number
  color?: string
}

export type BudgetDatum = {
  category: string
  allocated: number
  spent: number
  color?: string
}

interface FinancialData {
  chartData: ChartDatum[]
  budgetData: BudgetDatum[]
  loading: boolean
  error: string | null
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

const useFinancialData = (): FinancialData => {
  const [chartData, setChartData] = useState<ChartDatum[]>([])
  const [budgetData, setBudgetData] = useState<BudgetDatum[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("No authentication token found.")
          setLoading(false)
          return
        }
        const [chartRes, budgetRes] = await Promise.all([
          axios.get(`${API_URL}/finance/overview`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/finance/budget`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])
        setChartData(chartRes.data.data || [])
        setBudgetData(budgetRes.data.data || [])
      } catch (err: any) {
        setError("Failed to fetch financial data.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { chartData, budgetData, loading, error }
}

export default useFinancialData
