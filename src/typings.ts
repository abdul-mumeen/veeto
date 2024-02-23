export type CustomersResponse = {
  customers: CustomerDetailsWithID[];
  page: number;
  pageSize: number;
  totalCount: number;
};

export type CustomerDetails = {
  firstName: string;
  lastName?: string;
  email: string;
  phoneNumber: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
};

export type CustomerDetailsWithID = CustomerDetails & { id: string };
