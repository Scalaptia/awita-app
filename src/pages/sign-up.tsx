import { SignUp as ClerkSignUp } from '@clerk/clerk-react'

export default function SignUp() {
    return (
        <div className="flex items-center justify-center min-h-dvh bg-background">
            <ClerkSignUp signInUrl="/sign-in" />
        </div>
    )
}
