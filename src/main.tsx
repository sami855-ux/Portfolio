import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import Contact from "./pages/Contact.tsx"

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  {
    path: "/contact",
    element: <Contact />,
  },
])

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
)
