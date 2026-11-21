import { useMutation } from "@tanstack/react-query"
import { toast } from "@/lib/toast"
import { httpV1 } from "@/lib/xior"

export function useBillGeneration() {
  return useMutation({
    mutationFn: () => {
      return httpV1.request<{ queued?: boolean }>({
        method: "POST",
        url: "/customers/bills/generate",
      })
    },
    onSuccess: (res) => {
      // queued on Celery: the numbers arrive later; with no worker it ran now
      toast.success(
        res.data?.queued
          ? "Bill generation started. It finishes in the background."
          : "Bills generated successfully!",
      )
    },
    onError: (error) => {
      toast.error("Failed to generate bills. Please try again.")
      console.error("Bill generation error:", error)
    },
  })
}

export function useBillGenerationTask() {
  return useMutation({
    mutationFn: () => {
      return httpV1.request<{ queued?: boolean }>({
        method: "GET",
        url: "/tasks/generate-bills",
      })
    },
    onSuccess: (res) => {
      // queued on Celery: the numbers arrive later; with no worker it ran now
      toast.success(
        res.data?.queued
          ? "Bill generation started. It finishes in the background."
          : "Bills generated successfully!",
      )
    },
    onError: (error) => {
      toast.error("Failed to generate bills. Please try again.")
      console.error("Bill generation error:", error)
    },
  })
}
