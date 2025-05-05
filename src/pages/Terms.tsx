
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-w2d-cream">
      <Header />
      
      <main className="container px-4 pt-6 pb-20">
        <h1 className="text-3xl font-bold mb-6 text-primary">Terms and Conditions</h1>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-6">Last updated: May 5, 2025</p>
          
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using What2Do Bangalore's website and services, you agree to be bound by these Terms and Conditions. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3">2. Use of Our Services</h2>
            <p className="mb-3">
              You agree to use our services only for purposes that are permitted by these Terms and any applicable laws. 
              You may not:
            </p>
            <ul className="list-disc pl-5 mb-3 space-y-2">
              <li>Use our services in any way that could damage or disable them.</li>
              <li>Attempt to gain unauthorized access to any part of our services.</li>
              <li>Use our services for any illegal or unauthorized purpose.</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3">3. Content and Information</h2>
            <p>
              We strive to provide accurate and up-to-date information about activities and events in Bangalore. 
              However, we do not guarantee the accuracy, completeness, or reliability of any content. 
              You acknowledge that any reliance on such information is at your own risk.
            </p>
          </section>
          
          {/* More sections would be added in real terms and conditions */}
          
          <section>
            <h2 className="text-xl font-bold mb-3">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact us at terms@what2dobangalore.com.
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
