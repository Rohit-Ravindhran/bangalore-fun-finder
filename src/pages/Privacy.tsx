
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-w2d-cream">
      <Header />
      
      <main className="container px-4 pt-6 pb-20">
        <h1 className="text-3xl font-bold mb-6 text-primary">Privacy Policy</h1>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-6">Last updated: May 5, 2025</p>
          
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3">1. Introduction</h2>
            <p>
              What2Do Bangalore ("we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3">2. Information We Collect</h2>
            <p className="mb-3">We may collect information about you in various ways, including:</p>
            <ul className="list-disc pl-5 mb-3 space-y-2">
              <li>Information you provide when using our services, such as your name, email address, and phone number.</li>
              <li>Information about your device, including IP address, browser type, and operating system.</li>
              <li>Your activity on our platform, including pages visited and features used.</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">We may use the information we collect for various purposes, including:</p>
            <ul className="list-disc pl-5 mb-3 space-y-2">
              <li>Providing and improving our services.</li>
              <li>Communicating with you about our services, updates, and promotional offers.</li>
              <li>Analyzing usage patterns to enhance user experience.</li>
              <li>Protecting our rights and preventing fraud.</li>
            </ul>
          </section>
          
          {/* More sections would be added in a real privacy policy */}
          
          <section>
            <h2 className="text-xl font-bold mb-3">9. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy, please contact us at privacy@what2dobangalore.com.
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
