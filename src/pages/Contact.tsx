
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to database
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formData.name,
          email_or_phone: formData.emailOrPhone,
          message: formData.message
        }]);

      if (error) {
        console.error('Error saving contact submission:', error);
        alert('There was an error submitting your message. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Create mailto link
      const subject = encodeURIComponent('Message from Happenings Bangalore');
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail/Phone: ${formData.emailOrPhone}\n\n${formData.message}`
      );

      window.location.href = `mailto:connect@happeningsbangalore.com?subject=${subject}&body=${body}`;

      setIsSubmitted(true);
      setFormData({ name: '', emailOrPhone: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
              <p className="mb-4">Your message has been submitted and we've opened your email app. Feel free to edit and send your message.</p>
              <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
            </div>
          ) : (
            <>
              <p className="mb-6">
                Have questions, suggestions, or want to partner with us? 
                We'd love to hear from you! Fill out the form below and your email client will open with the message pre-filled.
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
                    disabled={isSubmitting}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="emailOrPhone" className="block text-sm font-medium mb-1">Email or Phone</label>
                  <input 
                    type="text" 
                    id="emailOrPhone" 
                    name="emailOrPhone" 
                    className="w-full p-3 border rounded-lg" 
                    required
                    value={formData.emailOrPhone}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="your.email@example.com or +91 98765 43210"
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
                    disabled={isSubmitting}
                  />
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </>
          )}

          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-bold mb-2">Connect With Us</h3>
            <p className="mb-2">Email: connect@happeningsbangalore.com</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
