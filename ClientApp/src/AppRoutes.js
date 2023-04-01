import { Counter } from "./components/Counter";
import { Register } from "./components/Register";
import {EmailCode} from "./components/EmailCode";
import { Home } from "./components/Home";
import {Login } from "./components/Login";
import {Admin} from "./components/Admin/AdminDasdboard";
import {LockAccount} from "./components/LockAccount";
import { ContactOffice } from "./components/Admin/ContactOffice";
import {SesssionExpired} from "./components/SessionExpired";
import {LoginAdmin} from "./components/Admin/Login";

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
    path: "/adminstrationPortal",
    element: <Admin />
  },
  {
    path: "/secureAccount",
    element: <LockAccount />
  },
  {
    path: "/staffAccountLock",
    element: <ContactOffice />
  },
  {
    path: "/InvalidSession",
    element: <SesssionExpired />
  },
  {
    path: "/vjhl1bQlglXfN2z3JFrFlXq+LQFc7RcUSuL9l18KBlZ2EHtjpHQqqbQA/85QGa91jweQ6NMN3hdckQagE0PEjQ==",
    element: <LoginAdmin />
  }
];

export default AppRoutes;
// ?promptCode=vjhl1bQlglXfN2z3JFrFlXq+LQFc7RcUSuL9l18KBlZ2EHtjpHQqqbQA/85QGa91jweQ6NMN3hdckQagE0PEjQ==/