import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhyMessageYard from "@/components/WhyMessageYard";
import Capabilities from "@/components/Capabilities";
import Platform from "@/components/Platform";
import Channels from "@/components/Channels";
import Resources from "@/components/Resources";
import Sock from "@/components/Sock";
import SideNav from "@/components/SideNav";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <WhyMessageYard />
      <Capabilities />
      <Platform />
      <Channels />
      <Resources />
      <Sock />
      <SideNav />
      <BackToTop />
      <Footer />
    </>
  );
}
