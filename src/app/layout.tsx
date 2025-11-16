import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Fitness Planner - One Stop Solution for Your Workout Needs",
  description: "Your personal workout companion. Track exercises, monitor progress, and achieve your fitness goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
       <div className="p-4">
        <Providers>{children}</Providers>
       </div>
        
      </body>
    </html>
  );
}
