/*
TODO:
  - Set tweets on the sidebar component (maybe use a context)
  - Show session user on the sidebar
  - Fix search bar UI on the secondary sidebar
*/

import "../styles/globals.css";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { AuthProvider } from "./AuthProvider";
import { Footer } from "../components/Footer";
import { SecondarySidebar } from "../components/SecondarySidebar/SecondarySidebar";
import { ClientProvider } from "../client/trpcClient";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientProvider>
      <html>
        <head />
        <body className="m-auto flex justify-center">
          <AuthProvider>
            <Sidebar />
            <main className="w-full max-w-[600px] border-l border-gray-medium sm:border-r">
              {children}
            </main>
            <SecondarySidebar />
            <Footer />
          </AuthProvider>
        </body>
      </html>
    </ClientProvider>
  );
}
