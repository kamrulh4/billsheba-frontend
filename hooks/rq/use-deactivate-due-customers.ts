import { useMutation } from "@tanstack/react-query"
import { toast } from "@/lib/toast"
import { httpV1 } from "@/lib/xior"

export function useDeactivateDueCustomersTask() {
  return useMutation({
    mutationFn: () => {
      return httpV1.request<{ queued?: boolean }>({
        method: "GET",
        url: "/tasks/deactive-due-customer",
      })
    },
    onSuccess: (res) => {
      toast.success(
        res.data?.queued
          ? "Deactivate due customers task started successfully!"
          : "Overdue customers suspended.",
      )
    },
    onError: (error) => {
      toast.error("Failed to deactivate due customers. Please try again.", {
        description: error.message,
      })
    },
  })
}
