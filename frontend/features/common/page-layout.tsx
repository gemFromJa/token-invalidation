import React from "react";
import Header from "./header";
import Sidebar from "./sidebar";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden md:p-2">
      <Sidebar />
      <main>
        <Header />
        {children}
      </main>
    </div>
  );
}
