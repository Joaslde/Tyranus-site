import React from 'react';
import HeroSlider from '@/components/HeroSlider';
import Statistics from '@/components/Statistics';
import ValuesSection from '@/components/ValuesSection';
import FormationCycles from '@/components/FormationCycles';
import AcademicYear from '@/components/AcademicYear';
import Testimonials from '@/components/Testimonials';
import EventsCalendar from '@/components/EventsCalendar';
import CTASection from '@/components/CTASection';

const Home = () => {
  return (
    <>
      <HeroSlider />
      <Statistics />
      <ValuesSection />
      <FormationCycles />
      <AcademicYear />
      <Testimonials />
      <EventsCalendar />
      <CTASection />
    </>
  );
};

export default Home;