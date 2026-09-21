import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      <AnimatePresence>{open && children}</AnimatePresence>
    </SheetContext.Provider>
  )
}

interface SheetContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextType>({
  open: false,
  onOpenChange: () => {},
})

export function useSheet() {
  return React.useContext(SheetContext)
}

export interface SheetContentProps {
  side?: "right" | "left" | "top" | "bottom"
  className?: string
  overlayClassName?: string
  children: React.ReactNode
  showCloseButton?: boolean
}

export function SheetContent({
  side = "right",
  className,
  overlayClassName,
  children,
  showCloseButton = true,
}: SheetContentProps) {
  const { onOpenChange } = useSheet()

  const handleClose = () => onOpenChange(false)

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const sideVariants = {
    right: {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "100%" },
      containerClass: "right-0 top-0 bottom-0 w-full max-w-lg border-l",
    },
    left: {
      initial: { x: "-100%" },
      animate: { x: 0 },
      exit: { x: "-100%" },
      containerClass: "left-0 top-0 bottom-0 w-full max-w-lg border-r",
    },
    top: {
      initial: { y: "-100%" },
      animate: { y: 0 },
      exit: { y: "-100%" },
      containerClass: "top-0 left-0 right-0 max-h-[85vh] border-b",
    },
    bottom: {
      initial: { y: "100%" },
      animate: { y: 0 },
      exit: { y: "100%" },
      containerClass: "bottom-0 left-0 right-0 max-h-[85vh] border-t",
    },
  }

  const variant = sideVariants[side] || sideVariants.right

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop Overlay */}
      <motion.div
        key="sheet-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleClose}
        className={cn(
          "fixed inset-0 bg-black/80 backdrop-blur-sm z-40 cursor-pointer",
          overlayClassName
        )}
      />

      {/* Slide-over Sheet Content */}
      <motion.div
        key="sheet-panel"
        initial={variant.initial}
        animate={variant.animate}
        exit={variant.exit}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className={cn(
          "fixed z-50 bg-[#1e1e1e] border-[#2e2e2e] text-white shadow-2xl p-6 overflow-y-auto flex flex-col justify-between",
          variant.containerClass,
          className
        )}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-[#2c2c2c] transition-colors cursor-pointer"
            title="Close Sheet"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="space-y-6 flex-1">{children}</div>
      </motion.div>
    </div>
  )
}

export function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("space-y-1.5 text-left border-b border-[#2e2e2e] pb-4 pr-8", className)}
      {...props}
    />
  )
}

export function SheetTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-xl font-bold text-white tracking-tight", className)}
      {...props}
    />
  )
}

export function SheetDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-gray-400 leading-relaxed", className)}
      {...props}
    />
  )
}

export function SheetFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("pt-4 border-t border-[#2e2e2e] flex flex-row items-center justify-end gap-3 mt-6", className)}
      {...props}
    />
  )
}

export function SheetClose({
  children,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { onOpenChange } = useSheet()
  return (
    <button
      type="button"
      onClick={(e) => {
        onClick?.(e)
        onOpenChange(false)
      }}
      {...props}
    >
      {children}
    </button>
  )
}
