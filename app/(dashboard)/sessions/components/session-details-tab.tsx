import { Tx } from "@/components/tx"
import { Badge } from "@/components/ui/badge"
import { cn, formatUptime } from "@/lib/utils"
import { useSessionsStore } from "@/stores/sessions-store"

export function SessionDetailsTab() {
  const { selectedSession } = useSessionsStore()

  return (
    <div className="grid md:grid-cols-2 gap-4 text-sm">
      <div>
        <span className="font-medium">
          <Tx>Username:</Tx>
        </span>
        <p>{selectedSession.name}</p>
      </div>
      <div>
        <span className="font-medium">
          <Tx>IP Address:</Tx>
        </span>
        <p className="font-mono">{selectedSession.address}</p>
      </div>
      <div>
        <span className="font-medium">
          <Tx>MAC Address:</Tx>
        </span>
        <p className="font-mono">{selectedSession["caller-id"]}</p>
      </div>
      <div>
        <span className="font-medium">
          <Tx>Session ID:</Tx>
        </span>
        <p className="font-mono text-xs">{selectedSession["session-id"]}</p>
      </div>
      <div>
        <span className="font-medium">
          <Tx>Service:</Tx>
        </span>
        <Badge
          variant="secondary"
          className={cn(
            selectedSession.service === "pppoe"
              ? "bg-blue-500 text-white dark:bg-blue-600"
              : "bg-gray-500 text-white dark:bg-gray-600",
          )}
        >
          {selectedSession.service.toUpperCase()}
        </Badge>
      </div>
      <div>
        <span className="font-medium">
          <Tx>Uptime:</Tx>
        </span>
        <p>{formatUptime(selectedSession.uptime)}</p>
      </div>
      <div>
        <span className="font-medium">
          <Tx>Encoding:</Tx>
        </span>
        <p>{selectedSession.encoding}</p>
      </div>
      <div>
        <span className="font-medium">
          <Tx>Radius:</Tx>
        </span>
        <p>{selectedSession.radius}</p>
      </div>
      <div>
        <span className="font-medium">
          <Tx>Limit Bytes In:</Tx>
        </span>
        <p>{selectedSession["limit-bytes-in"]}</p>
      </div>
      <div>
        <span className="font-medium">
          <Tx>Limit Bytes Out:</Tx>
        </span>
        <p>{selectedSession["limit-bytes-out"]}</p>
      </div>
    </div>
  )
}
