"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Default credentials - in production, these should be stored securely
  const validCredentials = [
    { username: "admin", password: "kashmir2025", role: "admin" },
    { username: "manager", password: "manager123", role: "manager" },
    { username: "user", password: "user123", role: "user" }
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const user = validCredentials.find(
      cred => cred.username === credentials.username && cred.password === credentials.password
    )

    if (user) {
      // Store user session
      localStorage.setItem("kashmir_user", JSON.stringify({
        username: user.username,
        role: user.role,
        loginTime: new Date().toISOString()
      }))
      
      // Redirect to dashboard
      router.push("/")
    } else {
      setError("Invalid username or password")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kashmir Carpentry LLC</h1>
          <p className="text-gray-600 mt-2">Project Management System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 text-sm text-gray-600">
          <h3 className="font-semibold mb-2">Demo Credentials:</h3>
          <div className="space-y-1">
            <p><strong>Admin:</strong> admin / kashmir2025</p>
            <p><strong>Manager:</strong> manager / manager123</p>
            <p><strong>User:</strong> user / user123</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
