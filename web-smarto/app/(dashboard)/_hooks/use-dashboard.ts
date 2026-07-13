"use client"

import { useCallback, useEffect, useState } from "react"
import { getDashboardData } from "../_lib/dashboard.api"
import { DashboardData } from "@/types/ui/dashboard"
import { toast } from "sonner"

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getDashboardData()
      
      const dashboardData: DashboardData = {
        totalUser: result.data.total_user,
        totalPenyuluh: result.data.total_penyuluh,
        totalPetani: result.data.total_petani,
        totalNode: result.data.total_node,
        totalNodeActive: result.data.total_node_active,
        totalNodeInactive: result.data.total_node_inactive,
        totalRuleBase: result.data.total_rule_base,
      }
      setData(dashboardData)
      console.log("Data dashboard berhasil diambil:", dashboardData)
    } catch (err) {
      const message = (err as Error).message
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return { data, isLoading, error, refetch: fetchDashboard }
}
