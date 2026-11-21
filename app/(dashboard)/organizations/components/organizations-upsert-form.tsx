"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Save, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod/v3"
import { Tx } from "@/components/tx"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useCreateOrganization,
  useUpdateOrganization,
} from "@/hooks/rq/use-organizations-query"
import { useOrganizationsStore } from "@/stores/organizations-store"

export const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required").max(20),
  email: z.string().email("Invalid email").max(254),
  website: z.union([z.literal(""), z.string().url("Invalid URL").max(200)]).optional(),
  subscription: z.string().optional(),
  subscription_status: z
    .enum(["TRIAL", "ACTIVE", "EXPIRED", "CANCELLED", "PENDING"])
    .optional(),
  allowed_customer: z.number().min(0).optional(),
  total_customer: z.number().min(0).optional(),
  router_ip: z.string().max(64).optional(),
  router_username: z.string().max(150).optional(),
  router_password: z.string().max(128).optional(),
  router_port: z.number().min(1).max(65535).optional(),
  router_secret: z.string().max(150).optional(),
  router_ssl: z.boolean().optional(),
})

export function OrganizationsUpsertForm() {
  const { setIsUpsertOrganizationDialogOpen, organizationMutationType } =
    useOrganizationsStore()

  const { mutate: triggerCreateOrganization, isPending: isCreateOrganizationPending } =
    useCreateOrganization()
  const { mutate: triggerUpdateOrganization, isPending: isUpdateOrganizationPending } =
    useUpdateOrganization()

  const { selectedOrganization } = useOrganizationsStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: selectedOrganization.name || "",
      address: selectedOrganization.address || "",
      phone: selectedOrganization.phone || "",
      email: selectedOrganization.email || "",
      website: selectedOrganization.website || "",
      subscription: selectedOrganization.subscription?.toString() || "",
      subscription_status: selectedOrganization.subscription_status || "PENDING",
      allowed_customer: selectedOrganization.allowed_customer || 0,
      total_customer: selectedOrganization.total_customer || 0,
      router_ip: selectedOrganization.router_ip || "",
      router_username: selectedOrganization.router_username || "",
      router_password: selectedOrganization.router_password || "",
      router_port: selectedOrganization.router_port || 8728,
      router_secret: selectedOrganization.router_secret || "",
      router_ssl: selectedOrganization.router_ssl || false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      ...values,
      subscription: values.subscription ? +values.subscription : null,
    }

    if (organizationMutationType === "edit") {
      // Send only what was changed. A full save would overwrite fields this form never loaded
      // (the router settings) or that the browser autofilled (login name / password).
      const dirty = form.formState.dirtyFields as Record<string, unknown>
      const changed: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(payload)) {
        if (dirty[key]) changed[key] = value
      }
      if (Object.keys(changed).length === 0) {
        setIsUpsertOrganizationDialogOpen(false)
        return
      }
      triggerUpdateOrganization(
        { payload: changed as typeof payload, uid: selectedOrganization.uid },
        {
          onSuccess: () => setIsUpsertOrganizationDialogOpen(false),
        },
      )
    } else {
      triggerCreateOrganization(payload, {
        onSuccess: () => setIsUpsertOrganizationDialogOpen(false),
      })
    }
  }

  const isLoading = isCreateOrganizationPending || isUpdateOrganizationPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Tx>Basic Information</Tx>
              </CardTitle>
              <CardDescription>
                <Tx>Enter the basic details of the organization.</Tx>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter organization name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Tx>Website</Tx>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Subscription Information */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Tx>Subscription Information</Tx>
              </CardTitle>
              <CardDescription>
                <Tx>Configure subscription and customer limits.</Tx>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="subscription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Tx>Subscription ID</Tx>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter subscription ID"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subscription_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Tx>Status</Tx>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TRIAL">
                          <Tx>Trial</Tx>
                        </SelectItem>
                        <SelectItem value="ACTIVE">
                          <Tx>Active</Tx>
                        </SelectItem>
                        <SelectItem value="EXPIRED">
                          <Tx>Expired</Tx>
                        </SelectItem>
                        <SelectItem value="CANCELLED">
                          <Tx>Cancelled</Tx>
                        </SelectItem>
                        <SelectItem value="PENDING">
                          <Tx>Pending</Tx>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allowed_customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Tx>Allowed Customers</Tx>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter allowed customers"
                        {...field}
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total_customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Tx>Total Customers</Tx>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter total customers"
                        {...field}
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Router Configuration */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                <Tx>Router Configuration</Tx>
              </CardTitle>
              <CardDescription>
                <Tx>Configure Mikrotik router settings for this organization.</Tx>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="router_ip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Tx>Router IP</Tx>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="192.168.1.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="router_port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Tx>Router Port</Tx>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="8728"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="router_username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Tx>Router Username</Tx>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="admin" autoComplete="off" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="router_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Tx>Router Password</Tx>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter password"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="router_secret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Tx>Router Secret</Tx>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter secret" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="router_ssl"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          <Tx>Use SSL</Tx>
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsUpsertOrganizationDialogOpen(false)}
          >
            <X />
            <Tx>Cancel</Tx>
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save />
            {isLoading
              ? "Saving..."
              : organizationMutationType === "add"
                ? "Create"
                : "Update"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
