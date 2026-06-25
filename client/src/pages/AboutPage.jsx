import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Compass, Target, Heart, Eye } from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';
import Card from '../components/ui/Card';

const AboutPage = () => {
  return (
    <div className="pt-40 md:pt-32 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeading title="About Homeground Turf" subtitle="Our Journey" />

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl h-[400px]"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/turf-aerial.png')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <h3 className="text-2xl md:text-3xl font-bold font-display text-slate-900 dark:text-white">
              Dehradun's Premium Sports Arena
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Founded in Balawala, Dehradun, Homeground Turf is a state-of-the-art sports arena designed for football and box cricket enthusiasts. Our vision is to cultivate an active sporting culture by providing accessible, top-tier venues that players of all ages can enjoy.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We understand that players deserve the best playing surface to prevent injury and play at their peak. That is why we invested in premium synthetic grass with high-density shock absorbers, combined with professional stadium lighting to enable premium night play.
            </p>
          </motion.div>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <Card className="flex flex-col p-8 hover:shadow-xl transition-shadow">
            <div className="p-4 bg-brand-emerald/10 text-brand-emerald rounded-2xl w-14 h-14 flex items-center justify-center mb-6">
              <Target className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-4">Our Mission</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              To provide a safe, modern, and high-performance arena that encourages active recreation, healthy lifestyles, and fosters a collaborative community among local sports teams and players in Dehradun.
            </p>
          </Card>

          <Card className="flex flex-col p-8 hover:shadow-xl transition-shadow">
            <div className="p-4 bg-brand-emerald/10 text-brand-emerald rounded-2xl w-14 h-14 flex items-center justify-center mb-6">
              <Eye className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-4">Our Vision</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              To become the leading sports facility ecosystem in Uttarakhand, known for premium turf conditions, seamless digital bookings, and organizing Dehradun's most competitive amateur tournaments.
            </p>
          </Card>
        </div>

        {/* Policies Section */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 lg:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-emerald/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-1">
              <span className="text-xs font-bold text-brand-emerald uppercase tracking-wider bg-brand-emerald/10 px-3 py-1 rounded-full mb-3 inline-block">
                ⚠️ IMPORTANT RULES
              </span>
              <h3 className="text-2xl md:text-3xl font-black font-display mb-4">Arena Guidelines</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                To maintain the high quality of our artificial turf and protect players from injury, we enforce the following rules:
              </p>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3.5">
                <div className="p-2 bg-red-500/10 text-red-500 rounded-xl mt-1">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base mb-1">No Metal Cleats</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Only turf shoes, molded studs, or flat-sole trainers are allowed. Metal spikes damage the backing.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2 bg-red-500/10 text-red-500 rounded-xl mt-1">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base mb-1">No Barefoot Play</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Appropriate socks and athletic footwear must be worn at all times to prevent injury.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2 bg-red-500/10 text-red-500 rounded-xl mt-1">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base mb-1">No Chewing Gum / Drinks</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Chewing gum and sugary drinks damage synthetic fibers. Water is always allowed.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2 bg-red-500/10 text-red-500 rounded-xl mt-1">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base mb-1">Timing Adherence</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Please empty the pitch promptly at the end of your slot so the next group can begin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
