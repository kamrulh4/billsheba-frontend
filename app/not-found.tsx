import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="font-bold text-6xl text-primary">404</p>
      <h1 className="font-semibold text-2xl">Page not found</h1>
      <p className="max-w-md text-muted-foreground">
        The page you are looking for does not exist or was moved. / আপনি যে পেজটি খুঁজছেন
        সেটি পাওয়া যায়নি।
      </p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  )
}
