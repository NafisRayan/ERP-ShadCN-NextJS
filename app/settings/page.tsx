"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/")
      return
    }

    setIsAuthenticated(true)
    setUser(JSON.parse(userData))
  }, [router])

  if (!isAuthenticated) return null

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6 lg:gap-8 lg:p-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Manage your account and system preferences
            </p>
          </div>

          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="organization">Organization</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Update your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" defaultValue={user?.email} />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input defaultValue={user?.department} />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input type="password" />
                  </div>
                  <Button>Update Password</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable 2FA</p>
                      <p className="text-sm text-muted-foreground">Require a code when signing in</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order Notifications</p>
                      <p className="text-sm text-muted-foreground">Get notified about new orders</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Inventory Alerts</p>
                      <p className="text-sm text-muted-foreground">Low stock warnings</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment Reminders</p>
                      <p className="text-sm text-muted-foreground">Invoice payment due dates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">System Updates</p>
                      <p className="text-sm text-muted-foreground">Important system announcements</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="organization" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Settings</CardTitle>
                  <CardDescription>Manage organization-wide settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Organization Name</Label>
                    <Input defaultValue="Your Company Name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Input defaultValue="Manufacturing" />
                  </div>
                  <div className="space-y-2">
                    <Label>Fiscal Year Start</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Input defaultValue="USD" />
                  </div>
                  <Button>Save Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
