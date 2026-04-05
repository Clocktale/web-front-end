/** Cliente no formato JSON da API (snake_case). */
export interface ApiCustomer {
  id: string;
  customer_name: string;
  email_address: string;
  phone_number: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** Corpo enviado em POST/PUT de clientes. */
export interface ApiCustomerInput {
  customer_name: string;
  email_address: string;
  phone_number: string | null;
}
