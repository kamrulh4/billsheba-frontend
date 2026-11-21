"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Save, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod/v3"
import { Tx } from "@/components/tx"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "@/hooks/rq/use-auth-query"
import { useCreatePayment, useUpdatePayment } from "@/hooks/rq/use-payment-query"
import { cn } from "@/lib/utils"
import { usePaymentsStore } from "@/stores/payments-store"
import { months, paymentMethods } from "../data/data"
import { CustomerSelect } from "./customer-select-form"

const formSchema = z.object({
  customer_id: z.number({
    required_error: "Please select a customer.",
  }),
  billing_month: z.string().optional(),
  payment_method: z.string().optional(),
  bill_amount: z.string().optional(),
  amount: z.string().optional(),
  discount: z.string().optional(),
  transaction_id: z.string().optional(),
  payment_date: z
    .date({
      required_error: "Payment date is required",
    })
    .optional(),
  note: z.string().optional(),
})

export function PaymentsUpsertForm() {
  const { setIsUpsertPaymentDialogOpen, paymentMutationType, selectedPayment } =
    usePaymentsStore()
  const { mutate: triggerCreatePayment, isPending: isCreatePaymentPending } =
    useCreatePayment()
  const { mutate: triggerUpdatePayment, isPending: isUpdatePaymentPending } =
    useUpdatePayment()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_id: selectedPayment?.customer?.id,
      billing_month: selectedPayment?.billing_month || "JANUARY",
      payment_method: selectedPayment?.payment_method || "CASH",
      bill_amount: selectedPayment?.bill_amount,
      amount: selectedPayment?.amount,
      discount:
        selectedPayment?.discount && Number(selectedPayment.discount) > 0
          ? selectedPayment.discount
          : "",
      transaction_id: selectedPayment?.transaction_id,
      payment_date: selectedPayment?.payment_date
        ? new Date(selectedPayment.payment_date)
        : new Date(),
      note: selectedPayment?.note || "",
    },
  })

  // only an admin or manager may waive money; staff just do not see the field
  const { data: session } = useSession()
  const canDiscount = ["ADMIN", "OWNER", "MANAGER", "SUPER_ADMIN"].includes(
    session?.kind ?? "",
  )

  function onSubmit(formValues: z.infer<typeof formSchema>) {
    // "paid" is decided by the server: it is paid once amount + discount covers the bill
    const values = { ...formValues, discount: formValues.discount || undefined }
    if (paymentMutationType === "edit" && selectedPayment?.uid) {
      triggerUpdatePayment(
        { payload: values, uid: selectedPayment.uid },
        {
          onSuccess: () => setIsUpsertPaymentDialogOpen(false),
        },
      )
      return
    }
    triggerCreatePayment(values, {
      onSuccess: () => setIsUpsertPaymentDialogOpen(false),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomerSelect />

          <FormField
            control={form.control}
            name="billing_month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Tx>Billing Month</Tx>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        <m.icon /> {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payment_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Tx>Payment Method</Tx>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentMethods.map((pm) => (
                      <SelectItem key={pm.value} value={pm.value}>
                        <pm.icon /> {pm.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Tx>Amount</Tx>
                </FormLabel>
                <FormControl>
                  {/* <Input type="number" step="0.01" placeholder="500.00" {...field} /> */}
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>৳</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      placeholder="0.00"
                      type="number"
                      step="1"
                      min={0}
                      {...field}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>
                        <Tx>BDT</Tx>
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {canDiscount && (
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Tx>Discount (optional)</Tx>
                  </FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <InputGroupText>৳</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder="0"
                        type="number"
                        step="1"
                        min={0}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </InputGroup>
                  </FormControl>
                  <p className="text-muted-foreground text-xs">
                    <Tx>
                      The bill is paid once amount + discount covers it. Write the reason
                      in Notes.
                    </Tx>
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="payment_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Tx>Payment Date</Tx>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "MM/dd/yyyy")
                        ) : (
                          <span>
                            <Tx>Pick a date</Tx>
                          </span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="transaction_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Tx>Transaction ID</Tx>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter transaction ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Tx>Notes</Tx>
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Additional notes about the payment" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsUpsertPaymentDialogOpen(false)
            }}
          >
            <X />
            <Tx>Cancel</Tx>
          </Button>
          <Button
            type="submit"
            loading={isCreatePaymentPending || isUpdatePaymentPending}
            disabled={isCreatePaymentPending || isUpdatePaymentPending}
          >
            <Save />
            {paymentMutationType === "edit" ? "Update Payment" : "Create Payment"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
