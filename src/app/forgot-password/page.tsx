
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { auth, actionCodeSettings } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Inserisci un'email valida." }),
});

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, values.email, actionCodeSettings);
      setSubmitted(true);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile inviare l'email. Controlla che l'indirizzo sia corretto.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/login">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <CardTitle>Recupera la tua password</CardTitle>
          <CardDescription>
            {submitted
              ? `Se un account con questo indirizzo email esiste, abbiamo inviato le istruzioni per reimpostare la password.`
              : "Inserisci il tuo indirizzo email e ti invieremo un link per reimpostare la password."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!submitted ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="mario.rossi@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Invio in corso..." : "Invia link di recupero"}
                </Button>
              </form>
            </Form>
          ) : (
            <Button className="w-full" asChild>
                <Link href="/login">Torna al Login</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
