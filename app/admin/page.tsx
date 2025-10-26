"use client"

import { useState } from "react"
import { Users, Shield, FlaskConical, TrendingUp, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "analytics">("overview")

  const stats = [
    { label: "Total Users", value: "247", icon: Users, color: "text-chart-1" },
    { label: "Active Assessments", value: "42", icon: Clock, color: "text-chart-2" },
    { label: "Completed Frameworks", value: "89", icon: CheckCircle2, color: "text-chart-3" },
    { label: "Pending Reviews", value: "12", icon: AlertCircle, color: "text-chart-4" },
  ]

  const recentActivity = [
    {
      user: "Dr. Sarah Chen",
      persona: "Data Custodian",
      action: "Completed Step 3",
      project: "Emergency Department Synthetic Data",
      time: "2 hours ago",
    },
    {
      user: "Prof. Michael Torres",
      persona: "Data Requestor",
      action: "Started Framework",
      project: "Mental Health Research Dataset",
      time: "5 hours ago",
    },
    {
      user: "Dr. Emma Wilson",
      persona: "Data Scientist",
      action: "Completed Risk Assessment",
      project: "Diabetes Patient Cohort",
      time: "1 day ago",
    },
    {
      user: "Dr. James Park",
      persona: "Data Custodian",
      action: "Approved Data Sharing",
      project: "Cancer Registry Synthetic Data",
      time: "2 days ago",
    },
  ]

  const stepCompletionRates = [
    { step: "Step 1: Use Case", completion: 92 },
    { step: "Step 2: Source Data", completion: 78 },
    { step: "Step 3: Generation", completion: 65 },
    { step: "Step 4: Re-ID Risk", completion: 54 },
    { step: "Step 5: Safety", completion: 48 },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor framework usage, user activity, and governance compliance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "overview"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "users"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          User Management
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "analytics"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-4 border-b last:border-0">
                  <div className="p-2 rounded-lg bg-muted">
                    {activity.persona === "Data Custodian" && <Shield className="w-4 h-4" />}
                    {activity.persona === "Data Requestor" && <Users className="w-4 h-4" />}
                    {activity.persona === "Data Scientist" && <FlaskConical className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{activity.user}</div>
                    <div className="text-sm text-muted-foreground">
                      {activity.action} • {activity.project}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step Completion Rates */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Step Completion Rates</h2>
            <div className="space-y-4">
              {stepCompletionRates.map((item) => (
                <div key={item.step}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{item.step}</span>
                    <span className="text-sm text-muted-foreground">{item.completion}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-chart-2 h-2 rounded-full transition-all"
                      style={{ width: `${item.completion}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-chart-1/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-chart-1" />
                </div>
                <div>
                  <div className="font-medium">Dr. Sarah Chen</div>
                  <div className="text-sm text-muted-foreground">Data Custodian • Active</div>
                </div>
              </div>
              <Link
                href="#"
                className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors text-sm font-medium"
              >
                View Profile
              </Link>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-chart-2/20 flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <div className="font-medium">Prof. Michael Torres</div>
                  <div className="text-sm text-muted-foreground">Data Requestor • Active</div>
                </div>
              </div>
              <Link
                href="#"
                className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors text-sm font-medium"
              >
                View Profile
              </Link>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-chart-3/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-chart-3" />
                </div>
                <div>
                  <div className="font-medium">Dr. Emma Wilson</div>
                  <div className="text-sm text-muted-foreground">Data Scientist • Active</div>
                </div>
              </div>
              <Link
                href="#"
                className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors text-sm font-medium"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Persona Distribution</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-chart-1" />
                  <span className="text-sm">Data Requestors</span>
                </div>
                <span className="font-semibold">124 (50%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-chart-2" />
                  <span className="text-sm">Data Custodians</span>
                </div>
                <span className="font-semibold">86 (35%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-chart-3" />
                  <span className="text-sm">Data Scientists</span>
                </div>
                <span className="font-semibold">37 (15%)</span>
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Framework Completion Trends</h2>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-chart-2" />
              <span className="text-2xl font-bold">+23%</span>
              <span className="text-sm text-muted-foreground">vs last month</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Framework completion rates have increased significantly, with more users successfully completing all five
              steps.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
