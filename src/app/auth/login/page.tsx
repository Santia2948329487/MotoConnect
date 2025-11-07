import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  // Clerk ya maneja la redirección post-login
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <SignIn 
        path="/login" 
        routing="path" 
        signUpUrl="/register"
        forceRedirectUrl="/routes" // A dónde ir después del login
      />
    </div>
  );
}