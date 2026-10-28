import { AuthLayout } from '../features/auth/components/AuthLayout.jsx'
import { ForgotPasswordForm } from '../features/auth/forgot-password/ForgotPasswordForm.jsx'

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
