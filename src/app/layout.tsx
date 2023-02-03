import "../styles/globals.css";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { Providers } from "./providers";
import { Footer } from "../components/Footer";
import { SecondarySidebar } from "../components/SecondarySidebar/SecondarySidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head />
      <body className="m-auto flex justify-center">
        <Providers>
          <Sidebar />
          <main className="w-full max-w-[600px] border-l border-gray-medium sm:border-r">
            {children}
          </main>
          <SecondarySidebar />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
