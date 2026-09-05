import type { Metadata } from "next";
import "./nominal-theme.css";

export const metadata: Metadata = {
  title: "MessageYard • The Marketing Cloud with Real Infrastructure Underneath",
  description:
    "Plan campaigns, build customer journeys, and segment your audience — then send it all through the same messaging infrastructure that powers 12 billion conversations a year.",
  icons: {
    icon: "/assets/messageyard-icon.png",
  },
};

import ScrollWithoutHash from "@/components/ScrollWithoutHash";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ScrollWithoutHash />
        {children}
      </body>
    </html>
  );
}
