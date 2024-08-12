
import Content from "../../components/layouts/Content";

export default function Home() {
  return (
    <main style={{
      height: '100vh', // 100% de la altura de la ventana
      width: '100%',   // 100% del ancho de la ventana
      overflowY: 'auto' // Agrega scroll vertical si es necesario
    }}>
      <Content />
    </main>
  );
}