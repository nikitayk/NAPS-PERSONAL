"use client"

import Link from "next/link"
import { Bell, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { useAppContext } from "@/context/app-context"

export function Header() {
  const [showNotifications, setShowNotifications] = useState(false)
  const pathname = usePathname()
  const { user, notifications, isMenuOpen, toggleMenu, markNotificationAsRead } = useAppContext()

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="border-b border-cyber-primary/20 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-cyber-primary text-black font-bold text-xl p-1 rounded">NAPS</div>
            <span className="sr-only md:not-sr-only md:inline-block text-sm text-cyber-primary cyber-glow">
              Navigate and Plan Smartly
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {[
            { href: "/", label: "Home" },
            { href: "/learn", label: "Learn" },
            { href: "/practice", label: "Practice" },
            { href: "/community", label: "Community" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium ${
                pathname === item.href
                  ? "border-b-2 border-cyber-primary text-cyber-primary"
                  : "text-muted-foreground hover:text-cyber-primary transition-colors"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-cyber-primary">
              <span className="text-sm font-medium">{user.streak}</span>
              <span className="text-orange-500">🔥</span>
            </div>
            <div className="flex items-center gap-1 text-cyber-primary">
              <span className="text-sm font-medium">{user.gems}</span>
              <span className="text-purple-500">💎</span>
            </div>
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-cyber-primary text-black">
                  {unreadCount}
                </Badge>
              )}
            </Button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 cyber-card border-cyber-primary/30 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-cyber-primary/20">
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-cyber-primary/10">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 ${notification.read ? "" : "bg-cyber-primary/5"}`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="flex justify-between">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <span className="text-xs text-muted-foreground">{notification.date}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground text-sm">No notifications</div>
                  )}
                </div>
                <div className="p-2 border-t border-cyber-primary/20">
                  <Button variant="ghost" size="sm" className="w-full text-xs">
                    Mark all as read
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Avatar className="h-8 w-8 border border-cyber-primary animate-pulse-glow cursor-pointer">
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback className="bg-cyber-dark text-cyber-primary">{user.avatar}</AvatarFallback>
          </Avatar>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-cyber-primary/20 bg-black/90 backdrop-blur-md">
          <nav className="flex flex-col p-4 space-y-4">
            {[
              { href: "/", label: "Home" },
              { href: "/learn", label: "Learn" },
              { href: "/practice", label: "Practice" },
              { href: "/community", label: "Community" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium ${
                  pathname === item.href ? "text-cyber-primary" : "text-muted-foreground"
                }`}
                onClick={toggleMenu}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
