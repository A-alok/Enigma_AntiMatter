import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Heart, Shield, Users, TrendingUp, Brain, Activity } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">VitalCircle</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/auth/login" className="text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Button asChild>
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 gradient-bg-subtle">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6">
            Predictive Chronic Care Platform
          </Badge>
          <h1 className="text-5xl font-bold mb-6 text-balance">
            Predictive Healthcare to Power the Future of{" "}
            <span className="gradient-bg bg-clip-text text-transparent">Chronic Care</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Transform reactive chronic disease management into proactive, AI-driven care with predictive risk scoring,
            personalized recommendations, and integrated clinical support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/register">
                Start Your Journey <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">View Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Chronic Care Ecosystem</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Integrate patient monitoring, predictive analytics, clinical collaboration, and community support in one
              unified platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Predictive Risk Engine</CardTitle>
                <CardDescription>
                  AI-driven Stability Score forecasts potential health risks with 48-hour predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Real-time risk assessment</li>
                  <li>• Trend analysis from vitals</li>
                  <li>• Early intervention alerts</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-success" />
                </div>
                <CardTitle>Context-Aware Nudges</CardTitle>
                <CardDescription>
                  Personalized prompts and recommendations based on your current health status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Medication reminders</li>
                  <li>• Lifestyle recommendations</li>
                  <li>• Stress management tips</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-warning" />
                </div>
                <CardTitle>Clinical Dashboard</CardTitle>
                <CardDescription>
                  Secure portal for healthcare providers with AI-suggested protocols and interventions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Patient risk prioritization</li>
                  <li>• Cross-clinic data access</li>
                  <li>• Automated care protocols</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-chart-2" />
                </div>
                <CardTitle>Community Support</CardTitle>
                <CardDescription>
                  Moderated forums and peer support groups for shared experiences and encouragement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Peer-to-peer support</li>
                  <li>• Condition-specific groups</li>
                  <li>• Professional moderation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-chart-3" />
                </div>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>
                  Visual journey maps showing symptom stability, medication adherence, and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Interactive dashboards</li>
                  <li>• Goal tracking</li>
                  <li>• Historical analysis</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-destructive" />
                </div>
                <CardTitle>Centralized Records</CardTitle>
                <CardDescription>Unique patient ID system enabling seamless cross-clinic data sharing</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• HIPAA compliant</li>
                  <li>• Universal patient ID</li>
                  <li>• Secure data sharing</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 gradient-bg-subtle">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-8">Trusted by Healthcare Professionals</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-lg font-semibold">Mayo Clinic</div>
            <div className="text-lg font-semibold">Johns Hopkins</div>
            <div className="text-lg font-semibold">Cleveland Clinic</div>
            <div className="text-lg font-semibold">Kaiser Permanente</div>
            <div className="text-lg font-semibold">Mount Sinai</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Transform Your Chronic Care Journey Today</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of patients and healthcare providers using VitalCircle to improve health outcomes through
            predictive, proactive care management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/register">
                Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">VitalCircle</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Predictive chronic care ecosystem for proactive health outcomes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/features">Features</Link>
                </li>
                <li>
                  <Link href="/pricing">Pricing</Link>
                </li>
                <li>
                  <Link href="/security">Security</Link>
                </li>
                <li>
                  <Link href="/integrations">Integrations</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/docs">Documentation</Link>
                </li>
                <li>
                  <Link href="/support">Support</Link>
                </li>
                <li>
                  <Link href="/blog">Blog</Link>
                </li>
                <li>
                  <Link href="/community">Community</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about">About</Link>
                </li>
                <li>
                  <Link href="/careers">Careers</Link>
                </li>
                <li>
                  <Link href="/privacy">Privacy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2025 VitalCircle. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
