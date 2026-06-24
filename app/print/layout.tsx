export default function PrintLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <link rel="stylesheet" href="/print/label.css" />
      {children}
    </>
  )
}
