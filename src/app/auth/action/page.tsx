
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { applyActionCode, checkActionCode, confirmPasswordReset } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

function ActionHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'resetPassword'>('loading');
  const [message, setMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oobCode, setOobCode] = useState<string | null>(null);

  useEffect(() => {
    const mode = searchParams.get('mode');
    const code = searchParams.get('oobCode');

    if (!mode || !code) {
      setStatus('error');
      setMessage('Parametri non validi. Impossibile completare l\'azione.');
      return;
    }

    setOobCode(code);

    const handleAction = async () => {
      try {
        const actionCodeInfo = await checkActionCode(auth, code);

        switch (mode) {
          case 'verifyEmail':
            await applyActionCode(auth, code);
            setStatus('success');
            setMessage('La tua email è stata verificata con successo! Ora puoi accedere.');
            break;
          case 'resetPassword':
            // We just verified the code, now we show the form to reset the password.
            setStatus('resetPassword');
            setMessage('Inserisci la tua nuova password.');
            break;
          case 'recoverEmail':
            // This case handles recovering a user's email address.
            // The user is not signed in, so we just confirm the action.
            await applyActionCode(auth, code);
            setStatus('success');
            setMessage('Il tuo indirizzo email è stato ripristinato con successo.');
            break;
          case 'verifyAndChangeEmail':
             // This case handles email change verification.
             await applyActionCode(auth, code);
             setStatus('success');
             setMessage(`Il tuo indirizzo email è stato aggiornato con successo a ${actionCodeInfo.data.email}.`);
             break;
           case 'revertSecondFactorAddition':
              await applyActionCode(auth, code);
              setStatus('success');
              setMessage('L\'autenticazione a più fattori è stata rimossa dal tuo account come richiesto. Se non sei stato tu, ti consigliamo di cambiare la password.');
              break;
          default:
            setStatus('error');
            setMessage('Azione non supportata.');
        }
      } catch (error: any) {
        setStatus('error');
        let userMessage = 'Il link non è valido o è scaduto. Riprova.';
        if (error.code === 'auth/invalid-action-code') {
            userMessage = 'Il codice di azione non è valido. Questo può accadere se il codice è stato già utilizzato, è scaduto o è malformato.';
        }
        setMessage(userMessage);
      }
    };

    handleAction();
  }, [searchParams]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode || !newPassword) {
      toast({ variant: 'destructive', title: 'Errore', description: 'La password non può essere vuota.' });
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setStatus('success');
      setMessage('La tua password è stata cambiata con successo. Ora puoi accedere con la nuova password.');
    } catch (error: any) {
      setStatus('error');
      let userMessage = 'Impossibile reimpostare la password. Riprova.';
       if (error.code === 'auth/weak-password') {
            userMessage = 'La password è troppo debole. Deve contenere almeno 6 caratteri.';
        }
      setMessage(userMessage);
    }
  };


  if (status === 'loading') {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  if (status === 'resetPassword') {
    return (
       <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reimposta Password</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nuova Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">Salva Nuova Password</Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <CardTitle>{status === 'success' ? 'Successo!' : 'Errore'}</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href="/login">Torna al Login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}


export default function AuthActionPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Suspense fallback={<div>Loading...</div>}>
                <ActionHandler />
            </Suspense>
        </div>
    )
}
