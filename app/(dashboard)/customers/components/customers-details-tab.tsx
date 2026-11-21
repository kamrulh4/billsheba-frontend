import { Tx } from "@/components/tx"
import { Badge } from "@/components/ui/badge"
import { useCustomersStore } from "@/stores/customers-store"

export function CustomersDetailsTab() {
  const { selectedCustomer } = useCustomersStore()

  return (
    <div className="grid  md:grid-cols-2 gap-4 text-sm">
      <div>
        <span className="font-medium">
          <Tx>Phone:</Tx>
        </span>
        <p>{selectedCustomer.phone}</p>
      </div>
      <div>
        <span className="font-medium">
          <Tx>Address:</Tx>
        </span>
        <p>{selectedCustomer.address || "N/A"}</p>
      </div>
      <div>
        <span className="font-medium">
          <Tx>NID:</Tx>
        </span>
        <p>{selectedCustomer.nid}</p>
      </div>
      <div>
        <span className="font-medium">
          <Tx>Connection Start:</Tx>
        </span>
        <p>{selectedCustomer.connection_start_date || "Not set"}</p>
      </div>
      <div>
        <span className="font-medium mr-2">
          <Tx>Status:</Tx>
        </span>
        <Badge variant={selectedCustomer.is_active ? "default" : "secondary"}>
          {selectedCustomer.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>
      <div>
        <span className="font-medium">
          <Tx>IP Address:</Tx>
        </span>
        <p>{selectedCustomer.ip_address}</p>
      </div>
      <div>
        <span className="font-medium">
          <Tx>MAC Address:</Tx>
        </span>
        <p>{selectedCustomer.mac_address}</p>
      </div>
      <div>
        <span className="font-medium">
          <Tx>Username:</Tx>
        </span>
        <p>{selectedCustomer.username}</p>
      </div>
      <div>
        <span className="font-medium">
          <Tx>Password:</Tx>
        </span>
        <p className="font-mono tracking-wider">{selectedCustomer.password}</p>
      </div>
      <div>
        <span className="font-medium mr-2">
          <Tx>Connection Type:</Tx>
        </span>
        <Badge>{selectedCustomer.connection_type}</Badge>
      </div>
    </div>
  )
}
