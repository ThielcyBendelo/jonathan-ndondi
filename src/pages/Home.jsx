import React from 'react';
import NavbarSecured from '../components/NavbarSecured';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import FAQSection from '../components/FAQSection';

export default function Home() {
  return (
    <>
      <NavbarSecured />
        <Hero />
        <FAQSection />
      <Footer />
    </>
  );
}
