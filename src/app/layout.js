import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/context/authcontext";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Attendance",
  description: "Attendance for IFT 510 at ASU",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en " data-theme="dracula">
      {/* <Suspense fallback={<loading/>}> */}
      <body className={inter.className}>
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
      {/* </Suspense> */}
    </html>
  );
}
