
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Copy } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import Link from "next/link";
import { FormDescription } from "./ui/form";


const signupSchema = z.object({
  name: z.string().min(2, { message: "Il nome deve contenere almeno 2 caratteri." }),
  email: z.string().email({ message: "Inserisci un'email valida." }),
  password: z.string()
    .min(8, { message: "La password deve contenere almeno 8 caratteri." })
    .regex(/[A-Z]/, { message: "La password deve contenere almeno una lettera maiuscola." })
    .regex(/[a-z]/, { message: "La password deve contenere almeno una lettera minuscola." })
    .regex(/[0-9]/, { message: "La password deve contenere almeno un numero." })
    .regex(/[^A-Za-z0-9]/, { message: "La password deve contenere almeno un carattere speciale." }),
  confirmPassword: z.string(),
  privacyPolicy: z.boolean().refine(val => val === true, {
    message: "Devi accettare l'informativa sulla privacy per continuare.",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Le password non coincidono.",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  email: z.string().email({ message: "Inserisci un'email valida." }),
  password: z.string().min(1, { message: "La password è obbligatoria." }),
});

function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-12 w-12 text-primary"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M12 2a10 10 0 0 0-3.32 19.49" />
      <path d="M12 22a10 10 0 0 0 3.32-19.49" />
    </svg>
  );
}

export type SignupData = z.infer<typeof signupSchema> & { subscriptionType?: 'monthly' | 'annual' | 'lifetime', phone?: string, age: number, livingSituation: 'alone' | 'shared', alcoholConsumption: 'drinker' | 'abstainer', smokingHabit: 'smoker' | 'non-smoker', privacyPolicy: boolean, onboardingCompleted?: boolean, feedbackCompleted?: boolean };
export type PartialSignupData = Partial<SignupData>;

export function LoginForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", privacyPolicy: false },
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleCopyPassword = (value: string) => {
    if (value) {
      navigator.clipboard.writeText(value);
      toast({ title: "Password copiata!" });
    }
  };

  async function onSignupSubmit(values: z.infer<typeof signupSchema>) {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const initialUserData = {
        name: values.name,
        email: values.email,
        onboardingCompleted: false, // Explicitly set to false
        privacyPolicy: values.privacyPolicy,
      };
      await setDoc(userDocRef, initialUserData);
      
      // onAuthStateChanged in MainPage will handle the rest of the flow.
      // No need to show toast here, MainPage handles UX.
      
    } catch (error: any) {
      console.error(error);
      let description = "Si è verificato un errore imprevisto.";
      if (error.code === 'auth/email-already-in-use') {
        description = "Questa email è già stata registrata. Prova ad accedere.";
      }
      toast({
        variant: "destructive",
        title: "Errore di registrazione",
        description: description,
      });
    } finally {
      setLoading(false);
    }
  }

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      // The onAuthStateChanged in MainPage will handle the redirect
    } catch (error: any) {
      console.error("Login Error:", error.code);
      let description = "Email o password non corrette. Riprova.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          description = "Credenziali non valide. Controlla email e password e riprova.";
      }
      toast({
        variant: "destructive",
        title: "Errore di accesso",
        description: description,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div 
      className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat p-4"
      style={{backgroundImage: "url('https://picsum.photos/1920/1080')", backgroundSize: 'cover'}}
      data-ai-hint="metropolis autumn"
    >
       <div className="absolute inset-0 bg-black/50 z-0"></div>
       <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-white">
          <div className="flex justify-center items-center gap-2 mb-4">
              <Logo />
              <h1 className="text-3xl font-bold">LifeFlow</h1>
          </div>
          <Card className="w-full max-w-lg text-card-foreground">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Accedi</TabsTrigger>
                  <TabsTrigger value="signup">Registrati</TabsTrigger>
                </TabsList>
              <TabsContent value="login">
                <CardHeader>
                    <CardTitle>Bentornato!</CardTitle>
                    <CardDescription>Inserisci le tue credenziali per continuare.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField control={loginForm.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl><Input type="email" placeholder="mario.rossi@example.com" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={loginForm.control} name="password" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl><Input type="password" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                       <div className="flex items-center justify-between">
                         <Button variant="link" asChild className="px-0">
                           <Link href="/forgot-password">Password dimenticata?</Link>
                         </Button>
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Accesso in corso...' : 'Accedi'}</Button>
                    </form>
                  </Form>
                </CardContent>
              </TabsContent>
              <TabsContent value="signup">
                <CardHeader>
                    <CardTitle>Crea il tuo account</CardTitle>
                    <CardDescription>Compila i campi per iniziare a tracciare le tue abitudini.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                      <FormField control={signupForm.control} name="name" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl><Input placeholder="Mario Rossi" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={signupForm.control} name="email" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl><Input type="email" placeholder="mario.rossi@example.com" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={signupForm.control} name="password" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                              <div className="relative">
                                  <FormControl>
                                      <Input type="password" {...field} onChange={(e) => { field.onChange(e); setPassword(e.target.value); }} />
                                  </FormControl>
                                  <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => handleCopyPassword(password)}>
                                      <Copy className="h-4 w-4" />
                                  </Button>
                              </div>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={signupForm.control} name="confirmPassword" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Conferma Password</FormLabel>
                            <div className="relative">
                                <FormControl>
                                    <Input type="password" {...field} onChange={(e) => { field.onChange(e); setConfirmPassword(e.target.value); }} />
                                </FormControl>
                                <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => handleCopyPassword(confirmPassword)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField
                            control={signupForm.control}
                            name="privacyPolicy"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Accetto i termini e l'informativa sulla privacy.
                                        </FormLabel>
                                        <FormDescription>
                                            Leggi la nostra <Link href="/privacy" className="underline" target="_blank">informativa sulla privacy</Link>.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormMessage />
                      <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Registrazione...' : 'Registrati'}</Button>
                    </form>
                  </Form>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
      </div>
    </div>
  );
}
