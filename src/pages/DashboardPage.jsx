import React from "react";
import NavbarSecured from "../components/NavbarSecured";
import AdminLayout from "../dashboard/components/AdminLayout";
import Footer from "../components/Footer";

export default function DashboardPage() {
  return (
    <>
      <NavbarSecured />
      <AdminLayout />
      <Footer />
    </>
  );
}
