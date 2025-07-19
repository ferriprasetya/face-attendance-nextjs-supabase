import { LoginForm } from '@/components/LoginForm'

export default function Page() {
  return (
    <div className='flex min-h-svh w-full flex-col items-center justify-center gap-8 p-6 md:p-10'>
      <h1 className='max-w-lg text-center text-4xl font-semibold'>
        Face Attendance Management System
      </h1>
      <div className='w-full max-w-lg'>
        <LoginForm />
      </div>
    </div>
  )
}
