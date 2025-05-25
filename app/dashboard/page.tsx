"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, Target, Trophy } from "lucide-react"
import { BarChart } from "@/components/ui/bar-chart"
import { RecentActivity } from "@/components/recent-activity"

export default function DashboardPage() {
  // Sample data - in a real app, this would come from your backend
  const stats = [
    {
      name: "Total Progress",
      value: "67%",
      icon: Activity,
      description: "Course completion rate",
    },
    {
      name: "Community Rank",
      value: "#42",
      icon: Trophy,
      description: "Out of 1,234 users",
    },
    {
      name: "Learning Streak",
      value: "7 days",
      icon: Target,
      description: "Current streak",
    },
    {
      name: "Forum Activity",
      value: "12",
      icon: Users,
      description: "Posts this week",
    },
  ]

  const chartData = [
    { name: "Mon", value: 400 },
    { name: "Tue", value: 300 },
    { name: "Wed", value: 500 },
    { name: "Thu", value: 280 },
    { name: "Fri", value: 450 },
    { name: "Sat", value: 600 },
    { name: "Sun", value: 350 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your progress.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.name}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={chartData} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 