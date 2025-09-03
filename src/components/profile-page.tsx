
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SignupData } from "./login-form";
import Link from "next/link";
import { ArrowLeft, Gift, Copy, Trash2 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "next/navigation";
import { Label } from "./ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { auth, db } from "@/lib/firebase";
import { signOut, onAuthStateChanged, User, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, writeBatch } from "firebase/firestore";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Il nome deve contenere almeno 2 caratteri." }),
  email: z.string().email({ message: "Inserisci un'email valida." }),
  age: z.coerce.number().min(18, { message: "Devi avere almeno 18 anni." }).max(120, { message: "L'età non può superare 120 anni." }),
});

const EMAIL_CHANGE_COOLDOWN_DAYS = 30;

function generateReferralCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function ProfilePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<Omit<SignupData, 'password'|'confirmPassword'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailChangeAllowed, setEmailChangeAllowed] = useState(true);
  const [daysUntilNextEmailChange, setDaysUntilNextEmailChange] = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const [passwordToDelete, setPasswordToDelete] = useState('');

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    setReferralCode(generateReferralCode());
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            setCurrentUser(user);
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const dbData = userDoc.data();
                const combinedData = {
                    ...dbData,
                    email: user.email,
                    name: user.displayName || dbData.name,
                };
                setUserData(combinedData as SignupData);
                form.reset(combinedData);

                const emailLastChangedStr = dbData.emailLastChanged;
                if (emailLastChangedStr) {
                    const lastChangedDate = new Date(emailLastChangedStr);
                    const now = new Date();
                    const diffTime = now.getTime() - lastChangedDate.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    if (diffDays < EMAIL_CHANGE_COOLDOWN_DAYS) {
                        setEmailChangeAllowed(false);
                        setDaysUntilNextEmailChange(EMAIL_CHANGE_COOLDOWN_DAYS - diffDays);
                    }
                }
            } else {
                 // Handle case where user exists in Auth but not Firestore
                 // This can happen if Firestore doc creation failed during signup
            }
        } else {
            setCurrentUser(null);
            setUserData(null);
            router.push('/login');
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, [form, router]);

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    if (!currentUser || !userData) return;
    
    // In a real app, updating email would require re-authentication.
    // We'll just update the other profile data in Firestore.
    const userDocRef = doc(db, 'users', currentUser.uid);
    const updatedData = { ...userData, name: values.name, age: values.age };

    try {
        await setDoc(userDocRef, updatedData, { merge: true });
        setUserData(updatedData);
        toast({
          title: "Profilo aggiornato!",
          description: "Le tue informazioni sono state salvate con successo.",
        });
        router.push('/');
    } catch (error) {
        console.error("Error updating profile:", error);
        toast({
            variant: "destructive",
            title: "Errore",
            description: "Impossibile aggiornare il profilo.",
        });
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({ title: "Codice copiato!" });
  };
  
  const handleLogout = () => {
    signOut(auth).then(() => {
        router.push('/');
    }).catch((error) => {
        console.error("Logout Error:", error);
        toast({ variant: "destructive", title: "Logout failed" });
    });
  };
  
  const handleDeleteAccount = async () => {
    if (!currentUser || !passwordToDelete) {
        toast({ variant: "destructive", title: "Password richiesta" });
        return;
    }

    try {
        const credential = EmailAuthProvider.credential(currentUser.email!, passwordToDelete);
        await reauthenticateWithCredential(currentUser, credential);
        
        const batch = writeBatch(db);

        // Delete user's log entries
        const logEntriesRef = collection(db, 'users', currentUser.uid, 'logEntries');
        const logEntriesSnap = await getDocs(logEntriesRef);
        logEntriesSnap.forEach(doc => batch.delete(doc.ref));

        // Delete user's main document
        const userDocRef = doc(db, 'users', currentUser.uid);
        batch.delete(userDocRef);

        // Commit all deletions
        await batch.commit();

        // Finally, delete the user from Firebase Auth
        await deleteUser(currentUser);

        toast({
            title: "Account eliminato con successo",
            description: "Ci dispiace vederti andare via.",
        });
        router.push('/');

    } catch (error: any) {
        console.error("Error deleting account:", error);
        let description = "Si è verificato un errore.";
        if (error.code === 'auth/wrong-password') {
            description = "La password inserita non è corretta.";
        }
        toast({
            variant: "destructive",
            title: "Eliminazione fallita",
            description: description,
        });
    } finally {
        setPasswordToDelete('');
    }
  }


  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-10 w-24" />
                </CardFooter>
            </Card>
        </div>
    );
  }
  
  if (!userData || !currentUser) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
              <p className="mb-4">Per visualizzare questa pagina devi prima effettuare l'accesso.</p>
              <Button asChild>
                  <Link href="/">Torna alla Home</Link>
              </Button>
          </div>
      )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="w-full max-w-lg space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Button variant="outline" size="icon" asChild>
                                    <Link href="/">
                                        <ArrowLeft className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <div className="flex-grow">
                                    <CardTitle>Il tuo profilo</CardTitle>
                                    <CardDescription>Visualizza e aggiorna le tue informazioni personali.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} disabled />
                                        </FormControl>
                                        <p className="text-xs text-muted-foreground">
                                          La modifica dell'email non è attualmente supportata.
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="age"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Età</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter>
                           <Button type="submit" className="w-full">Salva Modifiche</Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-primary" />
                        Invita un amico
                    </CardTitle>
                    <CardDescription>Invita i tuoi amici e ricevi un mese extra gratuito per ogni amico che si iscrive (fino ad un massimo di 3).</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">Copia il tuo codice di referral:</p>
                    <div
                        className="relative flex items-center justify-between w-full rounded-md border border-input bg-background px-3 py-2 text-base cursor-pointer hover:bg-muted"
                        onClick={handleCopyCode}
                    >
                        <span className="font-mono tracking-widest">{referralCode}</span>
                        <Copy className="h-4 w-4 text-muted-foreground" />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Area di Pericolo</CardTitle>
                    <CardDescription>
                        Le azioni in questa sezione sono permanenti e non possono essere annullate.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                     <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold">Esci dall'app</p>
                            <p className="text-sm text-muted-foreground">Verrai disconnesso dal tuo account.</p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleLogout}
                        >
                            Esci
                        </Button>
                    </div>
                     <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold">Elimina Account</p>
                            <p className="text-sm text-muted-foreground">Il tuo account e tutti i dati verranno eliminati.</p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Elimina
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Sei assolutamente sicuro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                   Questa azione è irreversibile. Il tuo account e tutti i dati ad esso associati (incluse le attività registrate) verranno eliminati definitivamente.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="space-y-2">
                                  <Label htmlFor="password-delete" className="text-sm font-medium">Per favore, inserisci la tua password per confermare.</Label>
                                  <Input 
                                      id="password-delete" 
                                      type="password"
                                      placeholder="La tua password"
                                      value={passwordToDelete}
                                      onChange={(e) => setPasswordToDelete(e.target.value)}
                                  />
                                </div>
                                <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setPasswordToDelete('')}>Annulla</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAccount}>
                                    Elimina il mio account
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>

        </div>
    </div>
);
}
