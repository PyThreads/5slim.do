import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import SimpleSnackbar from "../components/notifications/SimpleSnackbar";
import { eventBus } from "../src/app/utils/broadcaster";
import SplashScreen from "../src/app/providers/SplashScreen";
import { IAdmin } from "../api/src/interfaces";

const AdminContext = createContext({});

export function useAdminAuth() {
  return useContext(AdminContext);
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const whoAmI = async (token: string) => {
  const config = {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const { data } = await axios(`${API_URL}/admin/private/me`, config);
    return data.data;
  } catch (e: any) {
    throw new Error(e.message);
  }
};

export function AdminProvider({ children }: Readonly<{ children: React.ReactNode; }>) {
  const [currentAdmin, setCurrentAdmin] = useState<IAdmin | null>(null);

  const [notify, setNotify] = useState({
    message: "",
    open: false,
    type: "success" as "success" | "error",
    title: "",
    delay: 6000
  })

  const me = async () => {
    try {

      const accessToken: string | null = localStorage.getItem("TKN-5SL-M0");

      if (!accessToken) {
        signOut()
      }

      const user = await whoAmI(accessToken!);
      setCurrentAdmin(user);

      return user;

    } finally {
      return;
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


  useEffect(() => {
    eventBus.on("notify", (data: any) => {
      setNotify(data)
    })

    return () => {
      eventBus.off("notify", (data: any) => {
        setNotify(data)
      })
    }
  }, [])


  const refreshAdmin = async () => {
    try {
      const accessToken: string | null = localStorage.getItem("TKN-5SL-M0");
      if (accessToken) {
        const user = await whoAmI(accessToken);
        setCurrentAdmin(user);
        return user;
      }
    } catch (error) {
      console.error('Error refreshing admin:', error);
    }
  };

  const value: any = {
    currentAdmin,
    setCurrentAdmin,
    refreshAdmin,
    setNotify,
    signOut
  };

  return (
    <AdminContext.Provider value={value}>
      <SimpleSnackbar title={notify.title} message={notify.message} type={notify.type} open={notify.open} delay={notify.delay}
        setOpen={
          () => {
            setNotify({ ...notify, open: false })
          }
        }
      />
      {
        !currentAdmin ? <SplashScreen />
          :
          children
      }

    </AdminContext.Provider>
  );
}
