"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Login state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // Sign up state
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    netId: "",
    email: "",
    college: "",
    major: "",
    password: "",
    confirmPassword: "",
  })

  const colleges = [
    "College of Agriculture and Life Sciences",
    "College of Architecture, Art, and Planning",
    "College of Arts and Sciences",
    "Cornell SC Johnson College of Business",
    "College of Engineering",
    "College of Human Ecology",
    "School of Industrial and Labor Relations",
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("auth_token", data.token)
        localStorage.setItem("user_id", data.user_id)
        localStorage.setItem("user_role", data.role || "student")
        localStorage.setItem("user_name", data.name || "")
        router.push("/catalog")
      } else {
        alert("Login failed. Please check your credentials.")
      }
    } catch (error) {
      console.error("[v0] Login error:", error)
      alert("An error occurred during login.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!signupData.email.endsWith("@cornell.edu")) {
      alert("Please use your Cornell email address")
      return
    }

    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    if (signupData.password.length < 8) {
      alert("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: signupData.firstName,
          last_name: signupData.lastName,
          net_id: signupData.netId,
          email: signupData.email,
          college: signupData.college,
          major: signupData.major,
          password: signupData.password,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("auth_token", data.token)
        localStorage.setItem("user_id", data.user_id)
        localStorage.setItem("user_role", data.role || "student")
        localStorage.setItem("user_name", `${signupData.firstName} ${signupData.lastName}`)
        router.push("/catalog")
      } else {
        const error = await response.json()
        alert(error.detail || "Sign up failed. Please try again.")
      }
    } catch (error) {
      console.error("[v0] Signup error:", error)
      alert("An error occurred during sign up.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary">
            <span className="text-xl font-bold text-primary-foreground">CW</span>
          </div>
          <CardTitle className="text-2xl">Cornell Wardrobe</CardTitle>
          <CardDescription>Access your account or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Cornell Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="netid@cornell.edu"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Log In"}
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={signupData.firstName}
                      onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={signupData.lastName}
                      onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="netId">NetID</Label>
                  <Input
                    id="netId"
                    type="text"
                    placeholder="abc123"
                    value={signupData.netId}
                    onChange={(e) => setSignupData({ ...signupData, netId: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Cornell Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="netid@cornell.edu"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="college">College</Label>
                  <Select
                    value={signupData.college}
                    onValueChange={(value) => setSignupData({ ...signupData, college: value })}
                  >
                    <SelectTrigger id="college">
                      <SelectValue placeholder="Select your college" />
                    </SelectTrigger>
                    <SelectContent>
                      {colleges.map((college) => (
                        <SelectItem key={college} value={college}>
                          {college}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="major">Major</Label>
                  <Input
                    id="major"
                    type="text"
                    placeholder="e.g., Computer Science"
                    value={signupData.major}
                    onChange={(e) => setSignupData({ ...signupData, major: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}
