import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { IAdmin } from "../interfaces";

const AdminContext = createContext({});

export function useAdminAuth() {
  return useContext(AdminContext);
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const whoAmI = async (token:string) => {
  const config = {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const { data } = await axios(`${API_URL}/admin/private/me`, config);
    return data.data;
  } catch (e:any) {
    throw new Error(e.message);
  }
};

export function AdminProvider({ children }: Readonly<{ children: React.ReactNode; }>) {
  const [currentAdmin, setCurrentAdmin] = useState<IAdmin | null>(null);


  const me = async () => {
    try {


      const accessToken: string | null = localStorage.getItem("TKN-5SL-M0");
      
      if(!accessToken){
        signOut()
      }

      const user = await whoAmI(accessToken!);
      setCurrentAdmin(user);

      return user;
    } catch (e:any) {
      signOut()
    }
  };

  const signOut = () => {
    localStorage.removeItem("TKN-5SL-M0");
    window.location.href = "/admin/login"
    return undefined
  };

  useEffect(() => {
    me();
  }, []);


  const value: any = {
    currentAdmin
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
