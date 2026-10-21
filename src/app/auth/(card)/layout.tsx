export default function AuthCardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-linear-to-b from-primary/20 via-background to-primary/20 flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      {children}
    </div>
  )
}
