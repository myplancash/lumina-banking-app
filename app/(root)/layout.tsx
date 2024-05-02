export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      {/*TODO: Sidebar */}
      {children}
    </main>
  );
}
