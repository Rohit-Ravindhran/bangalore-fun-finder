
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would submit to an API
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-w2d-cream">
      <Header />
      
      <main className="container px-4 pt-6 pb-20">
        <h1 className="text-3xl font-bold mb-6 text-primary">Contact Us</h1>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          {isSubmitted ? (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-w2d-teal mb-4">Thank You!</h2>
              <p className="mb-4">Your message has been received. We'll get back to you soon.</p>
              <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
            </div>
          ) : (
            <>
              <p className="mb-6">
                Have questions, suggestions, or want to partner with us? 
                We'd love to hear from you! Fill out the form below and our team will get back to you as soon as possible.
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    className="w-full p-3 border rounded-lg" 
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    className="w-full p-3 border rounded-lg" 
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={5} 
                    className="w-full p-3 border rounded-lg" 
                    required
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
                
                <Button type="submit">Send Message</Button>
              </form>
            </>
          )}
          
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-bold mb-2">Connect With Us</h3>
            <p className="mb-2">Email: hello@what2dobangalore.com</p>
            <p>WhatsApp: +91 9876543210</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
