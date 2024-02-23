import { http, HttpResponse } from "msw";
import mock_data from "./MOCK_DATA.json";
import { CustomerDetails, CustomerDetailsWithID } from "../src/typings";
import uuid from "react-uuid";

let mockData: CustomerDetailsWithID[] = mock_data as CustomerDetailsWithID[];

type CustomersParam = {
  page: string;
  pageSize: string;
};

export const handlers = [
  // Handles POST a new customer request
  http.post<any, CustomerDetails, any, "/customers">(
    "/customers",
    async ({ params, request }) => {
      const cus = await request.json();

      const customer = { id: uuid(), ...cus };
      mockData.unshift(customer);
      return HttpResponse.json({ message: "Customer creation successful!" });
    }
  ),

  // Handles POST to update customer request
  http.post<any, CustomerDetailsWithID, any, "/customers/:customerId">(
    "/customers/:customerId",
    async ({ params, request }) => {
      const customer = await request.json();
      const customerId = customer.id;
      const index = mockData.findIndex((d) => d.id === customerId);
      if (index < 0) return HttpResponse.error();
      mockData.splice(index, 1);
      mockData.unshift(customer);
      return HttpResponse.json({ message: "Customer update successful!" });
    }
  ),

  // Handles DELETE a customer request
  http.delete<any, any, any, "/customers/:customerId">(
    "/customers/:customerId",
    async ({ params }) => {
      const { customerId } = params;
      const index = mockData.findIndex((d) => d.id === customerId);
      if (index < 0) return HttpResponse.error();
      mockData.splice(index, 1);
      return HttpResponse.json({ message: "Customer deletion successful!" });
    }
  ),

  // Handles GET customers request
  http.get<CustomersParam, any, any, "/customers">(
    "/customers",
    ({ request }) => {
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get("page") ?? "");
      const pageSize = parseInt(url.searchParams.get("pageSize") ?? "");
      const start = page * pageSize;
      const limit = pageSize + start;

      return HttpResponse.json({
        customers: mockData.slice(start, limit),
        page,
        pageSize,
        totalCount: mockData.length,
      });
    }
  ),

  // Handles GET a customer request
  http.get<{ customerId: string }, any, any, "/customers/:customerId">(
    "/customers/:customerId",
    ({ params }) => {
      const customerId = params.customerId;
      const customerDetails = mockData.find((d) => d.id === customerId);
      return customerDetails
        ? HttpResponse.json(customerDetails)
        : HttpResponse.error();
    }
  ),
];
