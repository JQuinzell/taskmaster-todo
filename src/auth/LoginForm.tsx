import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from './AuthContext'
import { useNavigate } from '@tanstack/react-router'

export function LoginForm() {
  const navigate = useNavigate()
  const { signIn } = useAuth()

  function handleSubmit(formData: FormData) {
    const username = formData.get('username') as string
    signIn({
      id: username,
      name: username,
    })
    navigate({ to: '/' })
  }

  return (
    <div className={cn('flex flex-col gap-6 w-[500px] m-auto mt-5')}>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='email'>Username</FieldLabel>
                <Input
                  id='username'
                  name='username'
                  type='text'
                  placeholder='Username'
                  required
                />
              </Field>
              {/* <Field>
                <div className='flex items-center'>
                  <FieldLabel htmlFor='password'>Password</FieldLabel>
                </div>
                <Input id='password' name='password' type='password' required />
              </Field> */}
              <Field>
                <Button type='submit'>Login</Button>
                {/* <FieldDescription className='text-center'>
                  Don&apos;t have an account? <a href='#'>Sign up</a>
                </FieldDescription> */}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
