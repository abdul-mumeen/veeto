import axios from "axios";
import { CustomerDetails, CustomerDetailsWithID } from "./typings";

type CustomersQueryRequest = {
  queryKey: Array<string | number>;
};

export const getCustomers = async ({
  queryKey: [_, page, pageSize],
}: CustomersQueryRequest) =>
  (await axios.get("/customers", { params: { page, pageSize } })).data;

export const getCustomer = async ({
  queryKey: [_, customerId],
}: CustomersQueryRequest) => {
  return (await axios.get(`/customers/${customerId}`)).data;
};

export const createOrUpdateCustomer = async (
  customerDetails: CustomerDetailsWithID | CustomerDetails
) => {
  return "id" in customerDetails && !!customerDetails.id
    ? (await axios.post(`/customers/${customerDetails.id}`, customerDetails))
        .data
    : (await axios.post(`/customers`, customerDetails)).data;
};

export const deleteCustomer = async (customerId: string) =>
  (await axios.delete(`/customers/${customerId}`)).data;
