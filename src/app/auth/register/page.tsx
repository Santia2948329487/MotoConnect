import { SignUp } from '@clerk/nextjs';

export default function RegisterPage() {
  // Clerk ya maneja la redirección post-registro
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <SignUp 
        path="/register" 
        routing="path" 
        signInUrl="/login"
        forceRedirectUrl="/routes" // A dónde ir después del registro
      />
    </div>
  );
}