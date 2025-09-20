"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      // Redirect based on user type
    }, 2000)
  }

  return (
    <div className="min-h-screen gradient-bg-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">VitalCircle</span>
          </div>
          <p className="text-muted-foreground">Welcome back to your health journey</p>
        </div>

        <Tabs defaultValue="patient" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patient">Patient</TabsTrigger>
            <TabsTrigger value="clinician">Clinician</TabsTrigger>
          </TabsList>

          <TabsContent value="patient">
            <Card>
              <CardHeader>
                <CardTitle>Patient Sign In</CardTitle>
                <CardDescription>Access your health dashboard and track your progress</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-email">Email</Label>
                    <Input id="patient-email" type="email" placeholder="patient@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-password">Password</Label>
                    <Input id="patient-password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                  <Link href="/auth/forgot-password" className="text-primary hover:underline">
                    Forgot your password?
                  </Link>
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/auth/register" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clinician">
            <Card>
              <CardHeader>
                <CardTitle>Clinician Sign In</CardTitle>
                <CardDescription>Access your clinical dashboard and patient management tools</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="clinician-email">Professional Email</Label>
                    <Input id="clinician-email" type="email" placeholder="doctor@hospital.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clinician-password">Password</Label>
                    <Input id="clinician-password" type="password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license-number">Medical License Number</Label>
                    <Input id="license-number" type="text" placeholder="License verification" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Sign In"}
                  </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                  <Link href="/auth/forgot-password" className="text-primary hover:underline">
                    Forgot your password?
                  </Link>
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Need access?{" "}
                  <Link href="/auth/clinician-request" className="text-primary hover:underline">
                    Request account
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
