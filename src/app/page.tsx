import { Header, MobileBar, Preloader } from "@/components/Chrome";
import Providers from "@/components/Providers";
import { BookSection, Contact, Faq, Footer } from "@/components/sections/Closing";
import Hero from "@/components/sections/Hero";
import { Marquee, Statement } from "@/components/sections/Intro";
import Patients from "@/components/sections/Patients";
import { ClinicBand, Doctors, Process, Team } from "@/components/sections/People";
import Results from "@/components/sections/Results";
import Treatments from "@/components/sections/Treatments";

export default function Home() {
  return (
    <Providers>
      <Preloader />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Statement />
        <Treatments />
        <Results />
        <Patients />
        <Doctors />
        <Team />
        <ClinicBand />
        <Process />
        <Faq />
        <BookSection />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
    </Providers>
  );
}
