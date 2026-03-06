export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (

    <html lang="en">

      <body className="bg-gray-50 text-gray-900">

        <header className="bg-white shadow">

          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

            <h1 className="text-xl font-bold">
              Mortgage Tools
            </h1>

            <nav className="space-x-6 text-sm">

              <a href="/" className="hover:text-blue-600">
                Home
              </a>

              <a href="/mortgage" className="hover:text-blue-600">
                Calculator
              </a>

              <a href="/amortization" className="hover:text-blue-600">
                Amortization
              </a>

            </nav>

          </div>

        </header>

        <main>

          {children}

        </main>

        <footer className="mt-20 py-10 text-center text-sm text-gray-500">

          Mortgage Tools © {new Date().getFullYear()}

        </footer>

      </body>

    </html>

  )
}