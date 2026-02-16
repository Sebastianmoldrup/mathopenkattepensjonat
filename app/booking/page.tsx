import { AuthButton } from '@/components/auth-button'
import { Calendar, Lock } from 'lucide-react'

const Page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mb-4 flex justify-center">
          <Calendar className="h-10 w-10 text-gray-800" />
        </div>

        <h1 className="mb-2 text-2xl font-semibold text-gray-900">
          Booking kommer snart
        </h1>

        <p className="mb-6 text-gray-600">
          Vi jobber med en ny og enkel bookingløsning. Følg med – lansering
          snart.
        </p>

        <div className="my-6 h-px bg-gray-200" />

        <AuthButton />
      </div>
    </div>
  )
}

export default Page
