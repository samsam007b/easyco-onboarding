import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

    const variants = {
      default: "bg-owner-700 text-white hover:bg-owner-600 focus-visible:ring-owner-500",
      outline: "border-2 border-owner-500 text-owner-500 hover:bg-owner-50",
      ghost: "text-owner-500 hover:bg-owner-50",
      destructive: "bg-error-500 text-white hover:bg-red-700 focus-visible:ring-error-500"
    }

    const sizes = {
      default: "h-12 px-6 py-2",
      sm: "h-9 px-4 text-sm",
      lg: "h-14 px-8",
      icon: "h-10 w-10"
    }

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
