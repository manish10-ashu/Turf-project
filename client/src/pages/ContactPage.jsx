import React, { useState, useEffect } from 'react';
import { contactAPI } from '../services/api';
import SectionHeading from '../components/ui/SectionHeading';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Phone, Mail, MapPin, CheckCircle, MessageSquare } from 'lucide-react';
import { adminAPI } from '../services/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({});
  useEffect(() => {
  const loadSettings = async () => {
    try {
      const { data } = await adminAPI.getSettings();

      if (data.success) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error(err);
    }
  };

  loadSettings();
}, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { data } = await contactAPI.submitInquiry(formData);
      if (data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-40 md:pt-32 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeading title="Get in Touch" subtitle="Contact Us" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Business Details Cards */}
          <div className="lg:col-span-1 space-y-6">
            <Card hoverEffect={false} className="p-6 flex items-start space-x-4">
              <div className="p-3 bg-brand-emerald/10 text-brand-emerald rounded-xl">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Our Location</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Shree Krishna Vihar, Near Gupta Bhusa Store, Balawala, Dehradun, Uttarakhand 248001
                </p>
              </div>
            </Card>

            <Card hoverEffect={false} className="p-6 flex items-start space-x-4">
              <div className="p-3 bg-brand-emerald/10 text-brand-emerald rounded-xl">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Call Owner</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                {settings?.contactNumber || 'Not Available'} </p>
                <p className="text-xs text-slate-500 mt-1">Available 9:00 AM - 9:00 PM</p>
              </div>
            </Card>

            <Card hoverEffect={false} className="p-6 flex items-start space-x-4">
              <div className="p-3 bg-brand-emerald/10 text-brand-emerald rounded-xl">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Email Us</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                 {settings?.email || 'Not Available'}
                </p>
              </div>
            </Card>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-2">
            <Card hoverEffect={false} className="p-8">
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-6 flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-brand-emerald" />
                <span>Send a Message</span>
              </h3>

              {success && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-5 w-5" />
                  <span>Inquiry sent successfully! We will get back to you shortly.</span>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="E.g. Vikram"
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="vikram@gmail.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                  <Input
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Tournament, Slot Query, etc."
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 pl-1">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter details about your inquiry..."
                    rows="4"
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:border-transparent text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <Button variant="primary" type="submit" loading={loading} className="w-full md:w-auto px-8">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* Map Integration */}
        <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 h-96">
          <iframe
            title="Homeground Turf Balawala Map Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3445.6983769165565!2d78.07727147610058!3d30.27415137480749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390921a2c9bbffbf%3A0xc4eb7fb9be797305!2sBalawala%2C%20Dehradun%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1780673000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
