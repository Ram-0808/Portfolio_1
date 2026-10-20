import Backdrop from './components/layout/Backdrop'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Experience from './components/sections/Experience'
import Missions from './components/sections/Missions'
import Gallery from './components/sections/Gallery'
import Contact from './components/sections/Contact'

// Single-page composition (design §2/§6): fixed decorative Backdrop behind
// everything, the sticky Navbar, then <main> with each section in order, then
// the Footer. Each section owns its own <section id aria-labelledby> + <h2>
// (Hero owns #top), so App adds no extra wrappers or ids.
export default function App() {
  return (
    <>
      <Backdrop />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Missions />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
