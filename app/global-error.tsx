"use client"

/** Last-resort boundary (errors in the root layout itself). Must render its own <html>. */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "4rem 1rem",
        }}
      >
        <h1>Something went wrong</h1>
        <p>Please reload the page. / পেজটি রিলোড করুন।</p>
        <button
          type="button"
          onClick={reset}
          style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
