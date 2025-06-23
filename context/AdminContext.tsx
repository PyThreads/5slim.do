import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { IAdmin } from "../interfaces";
import SimpleSnackbar from "../components/notifications/SimpleSnackbar";
import { eventBus } from "../src/app/utils/broadcaster";
import SplashScreen from "../src/app/providers/SplashScreen";

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
  const [loading, setLoading] = useState(false);

  const [notify, setNotify] = useState({
    message: "",
    open: false,
    type: "success" as "success" | "error",
    title: ""
  })

  const me = async () => {
    try {

      setLoading(true)
      const accessToken: string | null = localStorage.getItem("TKN-5SL-M0");

      if (!accessToken) {
        signOut()
      }

      const user = await whoAmI(accessToken!);
      setCurrentAdmin(user);

      return user;
    } catch (e: any) {
      signOut()
    } finally {
      setLoading(false)
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


  const value: any = {
    currentAdmin,
    setNotify
  };

  return (
    <AdminContext.Provider value={value}>
      <SimpleSnackbar title={notify.title} message={notify.message} type={notify.type} open={notify.open}
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
