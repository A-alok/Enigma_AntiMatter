"use client"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Heart, Bell, Settings, LogOut, User, HelpCircle, Stethoscope } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { clearClinicalSession } from "@/lib/clinical-auth"

interface ClinicalNavigationProps {
  provider: {
    name: string
    specialty: string
    license: string
    hospital: string
  }
}

export function ClinicalNavigation({ provider }: ClinicalNavigationProps) {
  const router = useRouter()

  const handleLogout = () => {
    clearClinicalSession()
    router.push('/auth/login')
  }

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/clinical" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">VitalCircle</span>
            <Badge variant="outline" className="ml-2">
              Clinical
            </Badge>
          </Link>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Provider" />
                    <AvatarFallback>
                      <Stethoscope className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{provider.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {provider.specialty} • {provider.license}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">{provider.hospital}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
