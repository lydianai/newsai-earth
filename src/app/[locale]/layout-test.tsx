export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <h1>Test Layout - Çalışıyor!</h1>
        {children}
      </body>
    </html>
  );
}
