import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="text-primary animate-spin" size={40} />
      <p className="text-text-secondary font-medium animate-pulse">{message}</p>
    </div>
  )
}
