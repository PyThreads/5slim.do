"use client"
import EmotionProvider from "../providers/EmotionProvider";

export default function LayoutAdmin({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (

        <EmotionProvider>
            {children}
        </EmotionProvider>
    )
}