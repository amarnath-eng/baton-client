import { AuthLayout } from '../features/auth/components/AuthLayout.jsx'
import { LoginForm } from '../features/auth/login/LoginForm.jsx'

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}
