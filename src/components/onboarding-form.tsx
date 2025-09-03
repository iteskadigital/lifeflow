
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { PartialSignupData } from "./login-form";
import { Progress } from "./ui/progress";
import { ArrowLeft } from "lucide-react";

const onboardingSchema = z.object({
  livingSituation: z.enum(["alone", "shared"], { required_error: "Seleziona una situazione abitativa." }),
  alcoholConsumption: z.enum(["drinker", "abstainer"], { required_error: "Seleziona un'opzione per il consumo di alcol." }),
  smokingHabit: z.enum(["smoker", "non-smoker"], { required_error: "Seleziona un'opzione per il fumo." }),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

interface OnboardingFormProps {
    onSubmit: (data: OnboardingData) => void;
    onBack: () => void;
}

export function OnboardingForm({ onSubmit, onBack }: OnboardingFormProps) {
    const form = useForm<OnboardingData>({
        resolver: zodResolver(onboardingSchema),
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                        <Button variant="outline" size="icon" onClick={onBack}>
                           <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Progress value={33} className="w-full" />
                    </div>
                    <CardTitle>Parlaci di te</CardTitle>
                    <CardDescription>
                        Queste informazioni ci aiuteranno a personalizzare la tua esperienza.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                           <FormField
                                control={form.control}
                                name="livingSituation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vivi da solo o condividi casa?</FormLabel>
                                        <FormControl>
                                            <div className="grid grid-cols-2 gap-4 pt-2">
                                                <Button
                                                    type="button"
                                                    variant={field.value === 'alone' ? 'default' : 'outline'}
                                                    onClick={() => field.onChange('alone')}
                                                >
                                                    Vivo da solo
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant={field.value === 'shared' ? 'default' : 'outline'}
                                                    onClick={() => field.onChange('shared')}
                                                >
                                                    Condivido casa
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="alcoholConsumption"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bevi alcolici?</FormLabel>
                                        <FormControl>
                                             <div className="grid grid-cols-2 gap-4 pt-2">
                                                <Button
                                                    type="button"
                                                    variant={field.value === 'drinker' ? 'default' : 'outline'}
                                                    onClick={() => field.onChange('drinker')}
                                                >
                                                    Sì
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant={field.value === 'abstainer' ? 'default' : 'outline'}
                                                    onClick={() => field.onChange('abstainer')}
                                                >
                                                    No
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="smokingHabit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fumi?</FormLabel>
                                        <FormControl>
                                             <div className="grid grid-cols-2 gap-4 pt-2">
                                                <Button
                                                    type="button"
                                                    variant={field.value === 'smoker' ? 'default' : 'outline'}
                                                    onClick={() => field.onChange('smoker')}
                                                >
                                                    Sì
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant={field.value === 'non-smoker' ? 'default' : 'outline'}
                                                    onClick={() => field.onChange('non-smoker')}
                                                >
                                                    No
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">Continua</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
