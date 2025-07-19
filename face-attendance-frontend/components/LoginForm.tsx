'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from '@/actions/auth.actions'
import { useFormState, useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type='submit'
      className='w-full'
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? 'Logging in...' : 'Login'}
    </Button>
  )
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const initialState = {
    success: false,
    message: '',
  }

  // useFormState handles the return value of the server action
  const [state, formAction] = useFormState(login, initialState)

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-3'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='m@example.com'
                  required
                />
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  placeholder='Enter your password'
                  required
                />
              </div>
              {state && !state.success && state.message && (
                <p className='text-center text-sm text-red-500'>
                  {state.message}
                </p>
              )}
              <div className='flex flex-col gap-3'>
                <SubmitButton />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
