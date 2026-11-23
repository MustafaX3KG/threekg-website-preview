import { MotionConfig } from "motion/react";
import About from "./components/About";
import Clients from "./components/Clients";
import Disciplines from "./components/Disciplines";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Team from "./components/Team";
import Work from "./components/Work";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Loader />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Disciplines />
        <Work />
        <Clients />
        <Team />
      </main>
      <Footer />
    </MotionConfig>
  );
}
