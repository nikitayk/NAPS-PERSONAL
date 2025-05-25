import { MessageSquare, Trophy, BookOpen, Target } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "forum",
    title: "Posted in 'Getting Started with NAPS'",
    timestamp: "2 hours ago",
    icon: MessageSquare,
  },
  {
    id: 2,
    type: "achievement",
    title: "Earned 'Quick Learner' badge",
    timestamp: "5 hours ago",
    icon: Trophy,
  },
  {
    id: 3,
    type: "lesson",
    title: "Completed 'Basic Financial Terms'",
    timestamp: "1 day ago",
    icon: BookOpen,
  },
  {
    id: 4,
    type: "practice",
    title: "Finished Practice Set #3",
    timestamp: "2 days ago",
    icon: Target,
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity) => {
        const Icon = activity.icon
        return (
          <div key={activity.id} className="flex items-start space-x-4">
            <div className="relative mt-1">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                {activity.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {activity.timestamp}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
} 