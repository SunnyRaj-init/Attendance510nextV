import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Attendance",
  description: "Attendance for IFT 510 at ASU",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en " data-theme="dracula">
      {/* <Suspense fallback={<loading/>}> */}
      <body className={inter.className}>{children}</body>
      {/* </Suspense> */}
    </html>
  );
}
