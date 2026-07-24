import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  Loader2,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type AlertDialogVariant = "danger" | "warning" | "info" | "success" | "default"

export interface AlertDialogProps {
  /** Controls open state of the dialog */
  open: boolean
  /** Callback fired when the open state changes */
  onOpenChange?: (open: boolean) => void
  /** Title of the alert dialog */
  title?: React.ReactNode
  /** Description or subtitle text */
  description?: React.ReactNode
  /** Custom icon override */
  icon?: React.ReactNode
  /** Dialog variant theme (danger, warning, info, success, default) */
  variant?: AlertDialogVariant
  /** Primary action button label */
  confirmText?: string
  /** Secondary cancel button label */
  cancelText?: string
  /** Callback triggered when confirming action */
  onConfirm?: () => void | Promise<void>
  /** Callback triggered when canceling or closing */
  onCancel?: () => void
  /** Loading state indicator */
  isLoading?: boolean
  /** Custom text to display during loading state */
  loadingText?: string
  /** Error state indicator */
  isError?: boolean
  /** Error heading text */
  errorTitle?: string
  /** Detailed error message to display */
  errorMessage?: React.ReactNode
  /** Show/hide cancel button */
  showCancelButton?: boolean
  /** Show/hide confirm button */
  showConfirmButton?: boolean
  /** Show/hide top close button */
  showCloseButton?: boolean
  /** Enable closing when backdrop/overlay is clicked */
  closeOnOverlayClick?: boolean
  /** Custom footer node to override default buttons */
  customFooter?: React.ReactNode
  /** Custom children element rendered inside the dialog body */
  children?: React.ReactNode
  /** Additional container class names */
  className?: string
  /** Additional backdrop overlay class names */
  overlayClassName?: string
  /** Additional card content class names */
  contentClassName?: string
  /** Props forwarded to confirm button */
  confirmButtonProps?: React.ComponentProps<typeof Button>
  /** Props forwarded to cancel button */
  cancelButtonProps?: React.ComponentProps<typeof Button>
}

export function AlertDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description,
  icon,
  variant = "default",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  loadingText = "Processing...",
  isError = false,
  errorTitle = "Action Failed",
  errorMessage,
  showCancelButton = true,
  showConfirmButton = true,
  showCloseButton = true,
  closeOnOverlayClick = true,
  customFooter,
  children,
  className,
  overlayClassName,
  contentClassName,
  confirmButtonProps,
  cancelButtonProps,
}: AlertDialogProps) {
  const handleClose = React.useCallback(() => {
    if (isLoading) return
    onCancel?.()
    onOpenChange?.(false)
  }, [isLoading, onCancel, onOpenChange])

  const handleConfirm = React.useCallback(async () => {
    if (isLoading) return
    try {
      await onConfirm?.()
    } catch {
      // Error handling managed via isError or external state
    }
  }, [isLoading, onConfirm])

  // Handle escape key press
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        handleClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, handleClose])

  // Default variant styling map
  const variantStyles = {
    danger: {
      iconBg: "bg-red-500/10 text-red-500 border-red-500/20",
      icon: <AlertOctagonIcon className="w-6 h-6" />,
      confirmBtn: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20",
    },
    warning: {
      iconBg: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      icon: <AlertTriangle className="w-6 h-6" />,
      confirmBtn: "bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20",
    },
    success: {
      iconBg: "bg-green-500/10 text-green-400 border-green-500/20",
      icon: <CheckCircle2 className="w-6 h-6" />,
      confirmBtn: "bg-green-500 hover:bg-green-400 text-slate-950 font-bold shadow-lg shadow-green-500/20",
    },
    info: {
      iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      icon: <Info className="w-6 h-6" />,
      confirmBtn: "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20",
    },
    default: {
      iconBg: "bg-green-500/10 text-green-400 border-green-500/20",
      icon: <AlertCircle className="w-6 h-6" />,
      confirmBtn: "bg-green-500 hover:bg-green-400 text-slate-950 font-bold shadow-lg shadow-green-500/20",
    },
  }

  const currentVariant = variantStyles[variant] || variantStyles.default

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="alert-dialog-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
          onClick={() => closeOnOverlayClick && handleClose()}
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm select-none",
            className,
            overlayClassName
          )}
        >
          {/* Modal Dialog Content */}
          <motion.div
            key="alert-dialog-modal"
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative z-10 w-full max-w-md bg-[#1e1e1e] border border-[#2e2e2e] rounded-3xl p-6 shadow-2xl overflow-hidden space-y-5 text-white select-text",
              contentClassName
            )}
          >
            {/* Top Close Button */}
            {showCloseButton && !isLoading && (
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Header with Icon */}
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-inner",
                  currentVariant.iconBg
                )}
              >
                {icon || currentVariant.icon}
              </div>

              <div className="space-y-1 pr-6 flex-1 min-w-0">
                {title && <h3 className="text-lg font-bold leading-snug text-white">{title}</h3>}
                {description && (
                  <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
                )}
              </div>
            </div>

            {/* Body Children */}
            {children && <div className="text-xs text-gray-300">{children}</div>}

            {/* Error Banner State */}
            {isError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 space-y-1 text-red-400 text-xs font-medium"
              >
                <div className="font-bold text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorTitle}
                </div>
                {errorMessage && <div className="text-[11px] opacity-90 leading-relaxed">{errorMessage}</div>}
              </motion.div>
            )}

            {/* Loading Banner Overlay State */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center gap-3 text-green-400 text-xs font-semibold"
              >
                <Loader2 className="w-5 h-5 animate-spin shrink-0 text-green-400" />
                <span>{loadingText}</span>
              </motion.div>
            )}

            {/* Action Footer */}
            {customFooter ? (
              customFooter
            ) : (
              <div className="flex items-center justify-end gap-3 pt-2">
                {showCancelButton && (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    onClick={handleClose}
                    className="bg-[#262626] border-none hover:bg-[#303030] text-gray-300 rounded-2xl text-xs font-semibold px-4 h-10 cursor-pointer"
                    {...cancelButtonProps}
                  >
                    {cancelText}
                  </Button>
                )}

                {showConfirmButton && (
                  <Button
                    type="button"
                    disabled={isLoading}
                    onClick={handleConfirm}
                    className={cn(
                      "rounded-2xl text-xs font-semibold px-5 h-10 border-none transition-all cursor-pointer flex items-center gap-2",
                      currentVariant.confirmBtn,
                      confirmButtonProps?.className
                    )}
                    {...confirmButtonProps}
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
                    {confirmText}
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function AlertOctagonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}
