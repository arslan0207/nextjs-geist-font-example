"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth/AuthProvider"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  
  const navigation = [
    { name: "Dashboard", href: "/" },
    { name: "Customers", href: "/customers" },
    { name: "Invoices", href: "/invoices" },
    { name: "Quotations", href: "/quotations" },
    { name: "LPO", href: "/lpo" },
    { name: "Projects", href: "/projects" },
    { name: "Labor", href: "/labor" },
    { name: "Materials", href: "/materials" },
    { name: "Reports", href: "/reports" },
  ]

  // Don't show navbar on login page
  if (pathname === "/login") {
    return null
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Kashmir Carpentry
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-gray-900 text-white"
                      : "text-gray-900 hover:bg-gray-100"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, {user.username} ({user.role})
                </span>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
