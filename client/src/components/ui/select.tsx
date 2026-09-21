import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  defaultValue?: string
  placeholder?: string
  className?: string
}

const SelectContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}>({
  open: false,
  setOpen: () => {},
})

export function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = React.useState(false)
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen } = React.useContext(SelectContext)
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-11 w-full items-center justify-between rounded-xl border border-[#2a2a2a] bg-[#141414] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-green-500 transition-all cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform duration-200", open && "rotate-180")} />
    </button>
  )
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = React.useContext(SelectContext)
  return (
    <span className={cn("truncate font-medium", !value && "text-gray-500")}>
      {value || placeholder || "Select an option..."}
    </span>
  )
}

export function SelectContent({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const { open, setOpen } = React.useContext(SelectContext)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, setOpen])

  if (!open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-[#2a2a2a] bg-[#181818] p-1.5 shadow-2xl text-white animate-in fade-in-0 zoom-in-95",
        className
      )}
    >
      {children}
    </div>
  )
}

export function SelectItem({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  const { value: selectedValue, onValueChange, setOpen } = React.useContext(SelectContext)
  const isSelected = selectedValue === value

  return (
    <div
      onClick={() => {
        onValueChange?.(value)
        setOpen(false)
      }}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 px-3 text-xs font-semibold outline-none transition-colors hover:bg-green-500/10 hover:text-green-400",
        isSelected && "bg-green-500/20 text-green-400 font-bold",
        className
      )}
    >
      <span className="flex-1">{children}</span>
      {isSelected && <Check className="h-3.5 w-3.5 text-green-400 ml-2" />}
    </div>
  )
}
