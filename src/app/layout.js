// ============================================================
// OpenUp - Root Layout
// ============================================================
// Wraps every page. Add global providers here.
// ============================================================

import { Playfair_Display, DM_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/layout/AuthProvider";
import "./globals.css";

// --------------------------------------------------------
// Fonts
// --------------------------------------------------------
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400","500","600","700","800"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300","400","500","600","700"],
  display: "swap",
});

export const metadata = {
  title: { default: "OpenUp — Write. Share. Inspire.", template: "%s | OpenUp" },
  description: "OpenUp is a creative writing platform for writers, poets, and thinkers.",
  keywords: ["writing","poetry","stories","creative writing","platform"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* Theme init script — prevents flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const theme = localStorage.getItem('openup_theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (theme === 'dark' || (!theme && prefersDark)) {
              document.documentElement.classList.add('dark');
            }
          } catch(e) {}
        `}} />
      </head>
      <body className="font-sans antialiased">
        {/* Auth initialization wrapper */}
        <AuthProvider>
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: "#2D2420",
                color: "#FFF8F3",
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                borderRadius: "12px",
                border: "1px solid rgba(255,107,53,0.2)",
                boxShadow: "0 8px 30px rgba(45,36,32,0.3)",
              },
              success: { iconTheme: { primary: "#FF6B35", secondary: "#FFF8F3" } },
              error:   { iconTheme: { primary: "#ef4444", secondary: "#FFF8F3" } },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
