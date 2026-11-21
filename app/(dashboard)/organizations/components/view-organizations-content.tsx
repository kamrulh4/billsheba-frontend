"use client"

import {
  BadgeCheckIcon,
  BadgeXIcon,
  Clock,
  Globe,
  Mail,
  MapPin,
  Phone,
  XCircle,
} from "lucide-react"
import { Tx } from "@/components/tx"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useOrganizationsStore } from "@/stores/organizations-store"

export function ViewOrganizationsContent() {
  const { selectedOrganization } = useOrganizationsStore()

  if (!selectedOrganization.uid) {
    return (
      <div>
        <Tx>No organization selected</Tx>
      </div>
    )
  }

  const getStatusConfig = (status: string) => {
    const statusConfig = {
      ACTIVE: {
        className: "bg-emerald-500 text-white dark:bg-emerald-600",
        icon: BadgeCheckIcon,
        label: "Active",
      },
      EXPIRED: {
        className: "bg-red-500 text-white dark:bg-red-600",
        icon: BadgeXIcon,
        label: "Expired",
      },
      CANCELLED: {
        className: "bg-gray-500 text-white dark:bg-gray-600",
        icon: XCircle,
        label: "Cancelled",
      },
      PENDING: {
        className: "bg-yellow-500 text-white dark:bg-yellow-600",
        icon: Clock,
        label: "Pending",
      },
    }

    return statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
  }

  const statusConfig = getStatusConfig(selectedOrganization.subscription_status)
  const StatusIcon = statusConfig.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            {selectedOrganization.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{selectedOrganization.name}</h2>
            <p className="text-muted-foreground">{selectedOrganization.address}</p>
          </div>
        </div>
        <Badge className={statusConfig.className}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {statusConfig.label}
        </Badge>
      </div>

      <Separator />

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Tx>Basic Information</Tx>
          </CardTitle>
          <CardDescription>
            <Tx>Organization details and contact information</Tx>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  <Tx>Address</Tx>
                </span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                {selectedOrganization.address}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  <Tx>Phone</Tx>
                </span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                {selectedOrganization.phone}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  <Tx>Email</Tx>
                </span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                {selectedOrganization.email}
              </p>
            </div>

            {selectedOrganization.website && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    <Tx>Website</Tx>
                  </span>
                </div>
                <a
                  href={selectedOrganization.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline ml-6"
                >
                  {selectedOrganization.website}
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Information */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Tx>Subscription Information</Tx>
          </CardTitle>
          <CardDescription>
            <Tx>Subscription details and customer limits</Tx>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <span className="font-medium">
                <Tx>Subscription ID</Tx>
              </span>
              <p className="text-sm text-muted-foreground">
                {selectedOrganization.subscription || "Not assigned"}
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-medium">
                <Tx>Status</Tx>
              </span>
              <div>
                <Badge className={statusConfig.className}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig.label}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-medium">
                <Tx>Expires</Tx>
              </span>
              <p className="text-sm text-muted-foreground">
                {selectedOrganization.subscription_end_date
                  ? new Date(
                      selectedOrganization.subscription_end_date,
                    ).toLocaleDateString()
                  : "Not set"}
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-medium">
                <Tx>Billing Cycle</Tx>
              </span>
              <p className="text-sm text-muted-foreground">
                {selectedOrganization.billing_cycle}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                <Tx>Customer Capacity</Tx>
              </span>
              <span className="text-sm text-muted-foreground">
                {selectedOrganization.total_customer} /{" "}
                {selectedOrganization.allowed_customer}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min((selectedOrganization.total_customer / selectedOrganization.allowed_customer) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (selectedOrganization.total_customer /
                  selectedOrganization.allowed_customer) *
                  100,
              )}
              % capacity used
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Router Configuration */}
      {(selectedOrganization.router_ip || selectedOrganization.router_username) && (
        <Card>
          <CardHeader>
            <CardTitle>
              <Tx>Router Configuration</Tx>
            </CardTitle>
            <CardDescription>
              <Tx>Mikrotik router settings</Tx>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedOrganization.router_ip && (
                <div className="space-y-2">
                  <span className="font-medium">
                    <Tx>Router IP</Tx>
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrganization.router_ip}
                  </p>
                </div>
              )}

              {selectedOrganization.router_port && (
                <div className="space-y-2">
                  <span className="font-medium">
                    <Tx>Port</Tx>
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrganization.router_port}
                  </p>
                </div>
              )}

              {selectedOrganization.router_username && (
                <div className="space-y-2">
                  <span className="font-medium">
                    <Tx>Username</Tx>
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrganization.router_username}
                  </p>
                </div>
              )}

              {selectedOrganization.router_secret && (
                <div className="space-y-2">
                  <span className="font-medium">
                    <Tx>Secret</Tx>
                  </span>
                  <p className="text-sm text-muted-foreground">••••••••</p>
                </div>
              )}

              <div className="space-y-2">
                <span className="font-medium">
                  <Tx>SSL Enabled</Tx>
                </span>
                <p className="text-sm text-muted-foreground">
                  {selectedOrganization.router_ssl ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Tx>Timestamps</Tx>
          </CardTitle>
          <CardDescription>
            <Tx>Creation and last update information</Tx>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="font-medium">
                <Tx>Created</Tx>
              </span>
              <p className="text-sm text-muted-foreground">
                {new Date(selectedOrganization.created_at).toLocaleString()}
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-medium">
                <Tx>Last Updated</Tx>
              </span>
              <p className="text-sm text-muted-foreground">
                {new Date(selectedOrganization.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
