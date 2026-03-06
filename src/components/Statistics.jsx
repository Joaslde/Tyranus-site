import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, GraduationCap } from 'lucide-react';

const StatCard = ({ icon: Icon, value, label, delay }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const target = parseInt(value.replace(/\D/g, ''));
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-[#D4AF37]" />
      </div>
      <div className="text-4xl font-serif font-bold text-[#1A237E] mb-2">
        +{count}
      </div>
      <p className="text-gray-600 text-center">{label}</p>
    </motion.div>
  );
};

const Statistics = () => {
  return (
    <section className="py-20 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard
            icon={Users}
            value="500"
            label="Étudiants Formés"
            delay={0}
          />
          <StatCard
            icon={Calendar}
            value="22"
            label="Ans d'existence"
            delay={0.2}
          />
          <StatCard
            icon={GraduationCap}
            value="20"
            label="Formateurs Expérimentés"
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
};

export default Statistics;