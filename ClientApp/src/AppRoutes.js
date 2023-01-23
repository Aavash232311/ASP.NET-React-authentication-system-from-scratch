import { Counter } from "./components/Counter";
import { Register } from "./components/Register";
import {EmailCode} from "./components/EmailCode";
import { Home } from "./components/Home";
import {Login } from "./components/Login";
import {AdminLogin} from "./components/Admin/AdminLogin";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: "/emailCode",
    element: <EmailCode />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/adminstration_portal",
    element: <AdminLogin />
  }
];

export default AppRoutes;
