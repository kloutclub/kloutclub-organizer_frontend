// Layout.tsx
import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router";
import { GlobalProvider } from "../GlobalContext";

const Layout: React.FC<React.PropsWithChildren<{}>> = () => {
  return (
    <GlobalProvider> {/* Wrap the layout with the provider */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Navbar */}
          <Navbar />

          {/* Content */}
          <main className="flex-1 bg-gray-100 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </GlobalProvider>
  );
};

export default Layout;
