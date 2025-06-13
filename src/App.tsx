import Header from "./components/Header"
import { About } from "./pages/About"
import { ClientMarqueeRow } from "./pages/Client"
import { Footer } from "./pages/Footer"
import Home from "./pages/Home"
import Projects from "./pages/Projects"
import Skills from "./pages/Skills"

const App = () => {
  return (
    <>
      <Header />
      <Home />
      <Skills />
      <About />
      <section className="py-16">
        <h2 className="text-center text-3xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
          Trusted By
        </h2>
        <ClientMarqueeRow />
      </section>
      <Projects />
      <Footer />
    </>
  )
}

export default App
