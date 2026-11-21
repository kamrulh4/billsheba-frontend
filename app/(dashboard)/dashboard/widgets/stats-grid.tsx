import { getDashboardData } from "@/lib/apis/auth"
import { StatsCards } from "./stats-cards"

export async function StatsGrid() {
  const data = await getDashboardData()
  return <StatsCards data={data} />
}
