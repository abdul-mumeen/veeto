import { Outlet, createBrowserRouter } from "react-router-dom";

import Home from "./home.tsx";
import NavBar from "./NavBar.tsx";
import Customers from "./Customers.tsx";
import Customer from "./Customer.tsx";

const router = createBrowserRouter([
  {
    element: (
      <>
        <NavBar />
        <Outlet />
      </>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/customers/:customerId",
        element: <Customer />,
      },
      {
        path: "/customers",
        element: <Customers />,
      },
    ],
  },
]);

export default router;
