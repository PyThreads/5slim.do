"use client"
import { AdminProvider } from "../../../context/AdminContext";
import EmotionProvider from "../providers/EmotionProvider";

export default function LayoutAdmin({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <AdminProvider>
            <EmotionProvider>
                {children}
            </EmotionProvider>
        </AdminProvider>
    )
}