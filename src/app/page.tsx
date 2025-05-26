"use client"

import Content from "../../components/layouts/Content";

export default function Home() {
  return (
    <main style={{
      height: '100% !important', // 100% de la altura de la ventana
      width: '100% !important',   // 100% del ancho de la ventana
    }}>
      <Content />
    </main>
  );
}