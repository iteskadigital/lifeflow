
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, CreditCard, Ticket } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionFormProps {
    onSubmit: (plan: 'monthly' | 'annual' | 'lifetime') => void;
}

export function SubscriptionForm({ onSubmit }: SubscriptionFormProps) {
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | 'lifetime'>('annual');
    const [codeApplied, setCodeApplied] = useState(false);
    const [friendCode, setFriendCode] = useState('');
    const { toast } = useToast();
    
    const handleApplyCode = () => {
        if (!friendCode) {
            toast({
                variant: "destructive",
                title: "Codice non valido",
                description: "Per favore, inserisci un codice amico.",
            });
            return;
        }

        if (selectedPlan === 'monthly') {
            setCodeApplied(true);
            toast({
                title: "Codice applicato!",
                description: "Ottimo! Paghi un mese e ne ricevi uno gratis.",
            });
        } else {
            setCodeApplied(false);
            toast({
                variant: "destructive",
                title: "Codice non applicabile",
                description: "Questo codice è valido solo per l'abbonamento mensile.",
            });
        }
    };


    const plans = [
        {
            id: 'monthly',
            title: 'Mensile',
            price: '€2.99',
            originalPrice: '€4.99',
            description: '1 mese di prova gratuito.',
            bestValue: false,
        },
        {
            id: 'annual',
            title: 'Annuale',
            price: '€29.99',
            originalPrice: '€39.99',
            description: '2 mesi gratuiti! Risparmi il 16%.',
            bestValue: true,
        },
        {
            id: 'lifetime',
            title: 'Lifetime',
            price: '€59.99',
            originalPrice: '€99.99',
            description: 'Accesso a vita con un unico pagamento.',
            bestValue: false,
        }
    ] as const;

    const handleFormSubmit = () => {
        toast({
            title: "Abbonamento attivato!",
            description: "Benvenuto in LifeFlow Premium!",
        });
        onSubmit(selectedPlan);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">Scegli il tuo piano</CardTitle>
                    <CardDescription>
                        Sblocca tutto il potenziale di LifeFlow e raggiungi i tuoi obiettivi.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={selectedPlan}
                        onValueChange={(value: 'monthly' | 'annual' | 'lifetime') => {
                            setSelectedPlan(value);
                            setCodeApplied(false);
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                    >
                        {plans.map((plan) => (
                             <Label 
                                key={plan.id}
                                htmlFor={plan.id}
                                className={cn(
                                    "relative block rounded-lg border-2 p-4 cursor-pointer focus:outline-none",
                                    selectedPlan === plan.id ? "border-primary ring-2 ring-primary" : "border-muted hover:border-muted-foreground/50",
                                    plan.bestValue && "border-primary",
                                    "transition-all"
                                )}
                            >
                                {plan.bestValue && (
                                    <div className="absolute -top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                                        PIÙ SCELTO
                                    </div>
                                )}
                                <RadioGroupItem value={plan.id} id={plan.id} className="sr-only" />
                                <div className="text-center">
                                    <h3 className="text-lg font-bold">{plan.title}</h3>
                                    <p className="mt-2">
                                        <span className="text-4xl font-extrabold">{plan.price}</span>
                                        <span className="text-sm text-muted-foreground line-through ml-2">{plan.originalPrice}</span>
                                    </p>
                                    <p className="mt-4 text-sm text-muted-foreground h-12">{plan.description}</p>
                                </div>
                                {selectedPlan === plan.id && (
                                     <div className="absolute top-2 right-2 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4"/>
                                    </div>
                                )}
                            </Label>
                        ))}
                    </RadioGroup>

                    <div className="border-t pt-6 space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Ticket className="h-5 w-5" />Codice Amico</h3>
                            <div className="flex gap-2">
                                <Input 
                                    placeholder="Inserisci il codice amico" 
                                    value={friendCode}
                                    onChange={(e) => setFriendCode(e.target.value)}
                                />
                                <Button type="button" onClick={handleApplyCode}>Applica</Button>
                            </div>
                            {codeApplied && selectedPlan === 'monthly' && (
                                <p className="text-sm text-green-600 mt-2">Fantastico! Hai sbloccato l'offerta: paghi un mese e ne ricevi uno gratis.</p>
                            )}
                        </div>
                        
                        <Button onClick={handleFormSubmit} className="w-full md:w-1/2 mx-auto flex" type="button">
                            Inizia ora
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col items-center">
                     <p className="text-xs text-muted-foreground mt-4">
                        Annullamento soggetto alle condizioni di vendita.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
