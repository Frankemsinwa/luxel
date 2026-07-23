import dynamic from 'next/dynamic';
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import HomeHero from "@/components/home/HomeHero";
import HomeServices from "@/components/home/HomeServices";
import HomeStats from "@/components/home/HomeStats";
import HomeWhyLuxel from "@/components/home/HomeWhyLuxel";
import TestimonialSection from "@/components/home/TestimonialSection";
import DestinationsSection from "@/components/home/DestinationsSection";
import HomeCTA from "@/components/home/HomeCTA";

// Dynamically import off-screen/heavy components to reduce initial JS payload
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950">
        <HomeHero />
        <SearchBar />
        <HomeServices />
        <HomeStats />
        <HomeWhyLuxel />
        <TestimonialSection />
        <DestinationsSection />
        <HomeCTA />
      </main>
      <Footer />
    </>
  );
}
