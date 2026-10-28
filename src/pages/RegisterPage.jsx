import { AuthLayout } from '../features/auth/components/AuthLayout.jsx'
import { RegisterForm } from '../features/auth/register/RegisterForm.jsx'

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  )
}
