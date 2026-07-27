import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import Contact from "./pages/Contact.tsx"
import { MainProjects } from "./pages/MainProjects.tsx"
import AdminLogin from "./pages/admin/AdminLogin.tsx"
import AdminResetPassword from "./pages/admin/AdminResetPassword.tsx"
import { ProtectedAdminRoute } from "./components/admin/ProtectedAdminRoute.tsx"
import AdminLayout from "./components/admin/AdminLayout.tsx"

// Modular Admin Pages
import AdminOverview from "./pages/admin/AdminOverview.tsx"
import AdminProfile from "./pages/admin/AdminProfile.tsx"
import AdminProjects from "./pages/admin/AdminProjects.tsx"
import AdminSkills from "./pages/admin/AdminSkills.tsx"
import AdminJourney from "./pages/admin/AdminJourney.tsx"
import AdminLinks from "./pages/admin/AdminLinks.tsx"
import AdminMessages from "./pages/admin/AdminMessages.tsx"

import { Toaster } from "@/components/ui/sonner"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { queryClient } from "@/lib/queryClient"

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/projects",
    element: <MainProjects />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/reset-password",
    element: <AdminResetPassword />,
  },
  {
    path: "/admin",
    element: <ProtectedAdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminOverview /> },
          { path: "profile", element: <AdminProfile /> },
          { path: "projects", element: <AdminProjects /> },
          { path: "skills", element: <AdminSkills /> },
          { path: "journey", element: <AdminJourney /> },
          { path: "links", element: <AdminLinks /> },
          { path: "messages", element: <AdminMessages /> },
        ],
      },
    ],
  },
])

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <Toaster position="top-center" closeButton={false} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
)
