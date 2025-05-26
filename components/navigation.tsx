// components/navigation.tsx

"use client";





import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  MessageSquare, 
  BarChart2, 
  Users, 
  BookOpen,
  Target
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Forum', href: '/forum', icon: MessageSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Learn', href: '/learn', icon: BookOpen },
  { name: 'Practice', href: '/practice', icon: Target },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1 px-2">
      {navigation.map((item) => {
        const isActive = pathname.startsWith(item.href)
        const Icon = item.icon
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
              isActive
                ? 'bg-cyber-primary/10 text-cyber-primary'
                : 'text-muted-foreground hover:bg-cyber-primary/5 hover:text-cyber-primary'
            )}
          >
            <Icon
              className={cn(
                'mr-3 h-5 w-5 flex-shrink-0',
                isActive ? 'text-cyber-primary' : 'text-muted-foreground group-hover:text-cyber-primary'
              )}
            />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
} 