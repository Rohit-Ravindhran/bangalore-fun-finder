'use client'


import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/ui-kit';
import { supabase } from '@/integrations/supabase/client';
import { CONTACT, CONTACT_PAGE } from '@/constants';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastSubmitTime < 30_000) {
      alert(CONTACT_PAGE.rateLimit);
      return;
    }
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
        alert(CONTACT_PAGE.submitError);
        setIsSubmitting(false);
        return;
      }

      // Create mailto link
      const subject = encodeURIComponent(CONTACT_PAGE.mailSubject);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail/Phone: ${formData.emailOrPhone}\n\n${formData.message}`
      );

      window.location.href = `mailto:${CONTACT.connectEmail}?subject=${subject}&body=${body}`;

      setIsSubmitted(true);
      setLastSubmitTime(Date.now());
      setFormData({ name: '', emailOrPhone: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(CONTACT_PAGE.submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-w2d-cream">
      <Header />

      <main className="container px-4 pt-6 pb-20">
        <h1 className="text-3xl font-bold mb-6 text-primary">{CONTACT_PAGE.title}</h1>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          {isSubmitted ? (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-w2d-teal mb-4">{CONTACT_PAGE.successTitle}</h2>
              <p className="mb-4">{CONTACT_PAGE.successBody}</p>
              <Button onClick={() => setIsSubmitted(false)}>{CONTACT_PAGE.sendAnother}</Button>
            </div>
          ) : (
            <>
              <p className="mb-6">{CONTACT_PAGE.intro}</p>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium mb-1">{CONTACT_PAGE.fields.name}</label>
                  <input
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
                  <label htmlFor="emailOrPhone" className="block text-sm font-medium mb-1">{CONTACT_PAGE.fields.emailOrPhone}</label>
                  <input
                    id="emailOrPhone"
                    name="emailOrPhone"
                    className="w-full p-3 border rounded-lg"
                    required
                    value={formData.emailOrPhone}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder={CONTACT_PAGE.fields.emailOrPhonePlaceholder}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium mb-1">{CONTACT_PAGE.fields.message}</label>
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
                  {isSubmitting ? CONTACT_PAGE.submitting : CONTACT_PAGE.submit}
                </Button>
              </form>
            </>
          )}

          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-bold mb-2">{CONTACT_PAGE.connectHeading}</h3>
            <p className="mb-2">{CONTACT_PAGE.emailLabel(CONTACT.connectEmail)}</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
