import { Tx } from "@/components/tx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomersDetailsTab } from "./customers-details-tab"
import { CustomersPaymentHistoryTab } from "./customers-payment-history-tab"

export function ViewCustomerTabs() {
  return (
    <Tabs defaultValue="details">
      <TabsList>
        <TabsTrigger value="details">
          <Tx>Details</Tx>
        </TabsTrigger>
        <TabsTrigger value="history">
          <Tx>Payment History</Tx>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <CustomersDetailsTab />
      </TabsContent>
      <TabsContent value="history">
        <CustomersPaymentHistoryTab />
      </TabsContent>
    </Tabs>
  )
}
