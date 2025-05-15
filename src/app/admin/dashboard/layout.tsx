"use client";
import { Box, Container } from "@mui/material";
import AdminSidebar from "../../../../components/layouts/AdminSidebar";
import { AdminProvider } from "../../../../context/AdminContext";


export default function LayoutAdminDashboard({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <AdminProvider>
            <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
                <AdminSidebar />
                <Box sx={{ width: "100% !important", height: "100% !important"}}>
                    <Container sx={{ ...styles.cont }}>
                        {children}
                    </Container>
                </Box>
            </Box>
        </AdminProvider>
    )
}

const styles = {
    cont: {
        minWidth: "100% !important",
        height: "100% !important",
        paddingTop: 5,
        marginLeft: 0,
        margingRight: 0,

    },

}