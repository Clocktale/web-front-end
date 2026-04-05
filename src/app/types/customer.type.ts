export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerInput {
  name: string;
  email: string;
  phone?: string;
}
