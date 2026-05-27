'use client';

// This is the password entry screen for multi-step login
// For now, we're using the SSO screen as the main login
// but keeping this for backwards compatibility

export function LoginPasswordScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-2 text-gray-600">Please use the main login page to continue</p>
      </div>
    </div>
  );
}
