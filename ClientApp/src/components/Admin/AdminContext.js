import { createContext, useState } from "react";
import { Utility } from "../Utility/utils";

const AdminContext = createContext(undefined);

export default AdminContext;

export const AdminProvider = ({children}) => {
    const methods = {
        loggedIn: false,

    }
    return (
        <AdminContext.Provider value={methods}>{children}</AdminContext.Provider>
    )
}