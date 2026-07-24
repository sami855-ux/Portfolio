import { Toaster as Sonner } from "sonner"
import { CheckCircle2, AlertCircle, Info, Loader2, AlertTriangle } from "lucide-react"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="top-center"
      closeButton={false}
      className="toaster group"
      icons={{
        success: <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />,
        error: <AlertCircle className="w-5 h-5 text-green-500 shrink-0" />,
        info: <Info className="w-5 h-5 text-green-500 shrink-0" />,
        warning: <AlertTriangle className="w-5 h-5 text-green-500 shrink-0" />,
        loading: <Loader2 className="w-5 h-5 text-green-500 animate-spin shrink-0" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#141414] group-[.toaster]:text-white group-[.toaster]:border-[#262626] group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl font-inter text-sm border p-4 flex items-center gap-3 backdrop-blur-md",
          description: "group-[.toast]:text-gray-400 text-xs font-inter",
          actionButton:
            "group-[.toast]:bg-green-500 group-[.toast]:text-slate-950 text-xs font-semibold rounded-lg px-3 py-1.5 font-inter",
          cancelButton:
            "group-[.toast]:bg-zinc-800 group-[.toast]:text-gray-300 text-xs font-medium rounded-lg px-3 py-1.5 font-inter",
          icon: "group-[.toast]:text-green-500 text-green-500",
          error: "group-[.toaster]:border-red-500/30 group-[.toaster]:bg-[#141414] group-[.toaster]:text-white",
          success: "group-[.toaster]:border-green-500/30 group-[.toaster]:bg-[#141414] group-[.toaster]:text-white",
          info: "group-[.toaster]:border-blue-500/30 group-[.toaster]:bg-[#141414] group-[.toaster]:text-white",
          loading: "group-[.toaster]:border-amber-500/30 group-[.toaster]:bg-[#141414] group-[.toaster]:text-white",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
