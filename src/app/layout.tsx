import "./globals.css"; // si está dentro de src/

export const metadata = {
  title: "Sistema Escolar",
  description: "Gestión Escolar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
