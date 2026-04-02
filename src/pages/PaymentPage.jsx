import React from "react";
import NavbarSecured from "../components/NavbarSecured";
import PaymentManagement from "../dashboard/pages/PaymentManagement";
import Footer from "../components/Footer";

export default function PaymentPage() {
  return (
    <>
      <NavbarSecured />
      <PaymentManagement />
      <Footer />
    </>
  );
}
