import Header from "./components/Header"
import { About } from "./pages/About"
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
      <Projects />
      <Footer />
    </>
  )
}

export default App
