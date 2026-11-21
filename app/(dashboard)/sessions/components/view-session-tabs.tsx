import { Tx } from "@/components/tx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SessionDetailsTab } from "./session-details-tab"

export function ViewSessionTabs() {
  return (
    <Tabs defaultValue="details">
      <TabsList>
        <TabsTrigger value="details">
          <Tx>Details</Tx>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <SessionDetailsTab />
      </TabsContent>
    </Tabs>
  )
}
