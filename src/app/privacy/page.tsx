
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4 md:p-8">
            <Card className="w-full max-w-4xl">
                 <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <CardTitle>Informativa sulla Privacy</CardTitle>
                    </div>
                    <CardDescription>
                       Ultimo aggiornamento: 25 Luglio 2024
                    </CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                    <h2>Introduzione</h2>
                    <p>
                        Benvenuto in LifeFlow. La tua privacy è importante per noi. Questa Informativa sulla Privacy spiega come raccogliamo, utilizziamo, divulghiamo e proteggiamo le tue informazioni quando utilizzi la nostra applicazione.
                    </p>

                    <h2>Informazioni che raccogliamo</h2>
                    <p>
                        Potremmo raccogliere informazioni su di te in vari modi. Le informazioni che possiamo raccogliere sull'App includono:
                    </p>
                    <ul>
                        <li>
                            <strong>Dati Personali:</strong> Informazioni di identificazione personale, come il tuo nome e indirizzo email, che ci fornisci volontariamente quando ti registri all'App.
                        </li>
                        <li>
                            <strong>Dati Derivati:</strong> Informazioni che i nostri server raccolgono automaticamente quando accedi all'App, come le azioni che intraprendi.
                        </li>
                        <li>
                            <strong>Dati da Dispositivi Mobili:</strong> Informazioni sul dispositivo, come l'ID, il modello e il produttore del tuo dispositivo mobile, e informazioni sulla posizione del tuo dispositivo, se accedi all'App da un dispositivo mobile.
                        </li>
                    </ul>

                    <h2>Utilizzo delle tue informazioni</h2>
                    <p>
                        Avere informazioni accurate su di te ci permette di offrirti un'esperienza fluida, efficiente e personalizzata. Nello specifico, potremmo utilizzare le informazioni raccolte su di te tramite l'App per:
                    </p>
                    <ul>
                        <li>Creare e gestire il tuo account.</li>
                        <li>Inviarti email riguardanti il tuo account o ordine.</li>
                        <li>Abilitare la comunicazione tra utenti.</li>
                        <li>Compilare dati statistici anonimi e analisi per uso interno o con terze parti.</li>
                        <li>Aumentare l'efficienza e il funzionamento dell'App.</li>
                    </ul>

                    <h2>Divulgazione delle tue informazioni</h2>
                    <p>
                        Non condivideremo le informazioni che abbiamo raccolto su di te con terze parti, salvo quanto descritto in questa Informativa sulla Privacy.
                    </p>

                    <h2>Sicurezza delle tue informazioni</h2>
                    <p>
                        Utilizziamo misure di sicurezza amministrative, tecniche e fisiche per proteggere le tue informazioni personali. Sebbene abbiamo adottato misure ragionevoli per proteggere le informazioni personali che ci fornisci, ti preghiamo di essere consapevole che nessuna misura di sicurezza è perfetta o impenetrabile e nessun metodo di trasmissione dei dati può essere garantito contro qualsiasi intercettazione o altro tipo di uso improprio.
                    </p>
                    
                    <h2>Contattaci</h2>
                    <p>
                        Se hai domande o commenti su questa Informativa sulla Privacy, ti preghiamo di contattarci a: [Inserire indirizzo email di contatto]
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
