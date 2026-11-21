export type Session = {
  id: number
  uid: string
  first_name: string
  last_name: string
  phone: string
  email: string
  gender: string
  image: string
  kind: string
  created_at: Date
  updated_at: Date
  /** null for the platform owner (super admin) */
  organization: Organization | null
}

export type Organization = {
  uid: string
  name: string
  phone: string
  email: string
  subscription_status: string
  subscription_end_date: string | null
  allowed_customer: number
  total_customer: number
}
