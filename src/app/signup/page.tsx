
"use client";

import { LoginForm } from '@/components/login-form';

export default function SignupPage() {
    // This page might still be accessed via direct URL,
    // so we render the main login/signup form.
    return <LoginForm />;
}
