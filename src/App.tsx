import Header from "./components/Header"
import { About } from "./pages/About"
import Collab from "./components/Collab"
import { Footer } from "./components/Footer"
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
      <Collab />
      <Footer />
    </>
  )
}

export default App
