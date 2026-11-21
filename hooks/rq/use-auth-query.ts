import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { useSyncExternalStore } from "react"
import { XiorError } from "xior"
import { toast } from "@/lib/toast"
import { httpV1 } from "@/lib/xior"
import { Session } from "@/types/auth"
import { LoginResponse } from "@/types/logins"
import { RegisterPayload, RegisterResponse } from "@/types/register"
import { getDashboardDataOptions } from "./use-dashboard-query"

export function useLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["login"],
    mutationFn: (payload: { phone: string; password: string }) => {
      return httpV1
        .request<LoginResponse>({
          method: "post",
          url: "/users/login",
          data: payload,
        })
        .then((res) => res.data)
    },
    onSuccess: async (data) => {
      toast.success("Successfully logged in")
      queryClient.invalidateQueries({ queryKey: ["signed-in"] })

      router.refresh()
      // The platform owner has no ISP, so their home is the platform page.
      router.push(data.user.kind === "SUPER_ADMIN" ? "/platform" : "/dashboard")
    },
  })
}

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      if (typeof window !== "undefined") {
        localStorage.clear()
        await fetch("/api/auth/logout", { method: "POST" })
      }
    },
    onSuccess: () => {
      queryClient.clear()
      toast.success("Successfully logged out")
      // router.push("/")

      window.location.href = "/"
    },
    onError: () => {
      toast.error("Logout failed")
    },
  })
}

export function useRegister() {
  const router = useRouter()
  return useMutation({
    mutationKey: ["register"],
    mutationFn: (payload: RegisterPayload) => {
      return httpV1
        .request<RegisterResponse>({
          method: "post",
          url: "/users/register",
          data: payload,
        })
        .then((res) => res.data)
    },
    onSuccess: () => {
      router.push("/dashboard")
    },
    onError: (error) => {
      if (error instanceof XiorError) {
        toast.error("Registration failed. Please try again", {
          description: error.message,
        })
      }
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: (payload: {
      phone: string
      otp?: string
      password?: string
      confirm_password?: string
    }) => {
      return httpV1
        .request<{
          phone: string
          otp: string
        }>({
          method: "post",
          url: "/users/forget-password",
          data: payload,
        })
        .then((res) => res.data)
    },
  })
}

export function sessionOptions() {
  return queryOptions({
    queryKey: ["session"],
    queryFn: () => {
      return httpV1
        .request<Session>({ method: "GET", url: "/users/me" })
        .then((res) => res.data)
    },
    staleTime: 10 * 60 * 1000,
    retry: 0,
    refetchOnWindowFocus: false,
  })
}

const noopSubscribe = () => () => {}

/**
 * The signed-in user, safe to branch the UI on.
 *
 * The sidebar hydrates first and puts the session in the shared query cache, so a page section that
 * hydrates a moment later would see data the server HTML never had (React error #418).
 * `useSyncExternalStore` returns `false` during hydration and `true` right after, so every
 * consumer renders the same "no session yet" markup as the server first, then the real data.
 */
export function useSession() {
  const query = useQuery(sessionOptions())
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
  return hydrated ? query : ({ ...query, data: undefined } as typeof query)
}

export function useSuspenseSession() {
  return useSuspenseQuery(sessionOptions())
}

export type SignupPayload = {
  organization_name: string
  first_name: string
  last_name?: string
  phone: string
  email: string
  address?: string
  password: string
  confirm_password: string
}

/** Self-service ISP signup: creates the organization on a free trial and signs in. */
export function useSignup() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["signup"],
    mutationFn: (payload: SignupPayload) =>
      httpV1
        .request<LoginResponse>({ method: "post", url: "/auth/signup", data: payload })
        .then((res) => res.data),
    onSuccess: () => {
      toast.success("Account created — your free trial has started")
      queryClient.invalidateQueries({ queryKey: ["signed-in"] })
      router.refresh()
      router.push("/dashboard")
    },
  })
}
