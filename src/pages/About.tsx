
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-w2d-cream">
      <Header />
      
      <main className="container px-4 pt-6 pb-20">
        <h1 className="text-3xl font-bold mb-6 text-primary">About Us</h1>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">What is What2Do Bangalore?</h2>
          <p className="mb-4">
            What2Do Bangalore is your personal city guide to discover hidden gems and trending experiences in Bangalore. 
            We curate unique activities, events, and places that locals love but tourists often miss.
          </p>
          
          <h2 className="text-xl font-bold mb-4">Our Mission</h2>
          <p className="mb-4">
            Our mission is to help everyone discover the soul of Bangalore through authentic, local experiences. 
            We believe that the best way to experience a city is through the eyes of those who call it home.
          </p>
          
          <h2 className="text-xl font-bold mb-4">How We Curate</h2>
          <p className="mb-4">
            Our team of local enthusiasts constantly explores the city to find unique activities. 
            We personally verify each listing to ensure quality and authenticity. 
            From hidden cafes to underground music scenes, we bring you the best of Bangalore.
          </p>
          
          <h2 className="text-xl font-bold mb-4">Join Our Community</h2>
          <p>
            Have a suggestion? Found a hidden gem? We'd love to hear from you! 
            Contact us to share your discoveries and help us build a more vibrant community.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
