
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const faqs = [
    {
        question: "Come posso tracciare una nuova abitudine?",
        answer: "Per tracciare una nuova abitudine, vai alla dashboard principale e cerca il tracker corrispondente (es. 'Health & Wellness', 'Productivity'). Compila i campi richiesti e clicca su 'Log' per salvare l'attività.",
    },
    {
        question: "Posso modificare un'attività che ho già registrato?",
        answer: "Sì, puoi modificare la data e l'ora di qualsiasi attività registrata. Nella sezione 'Daily Log' della dashboard, clicca sul pulsante 'Edit' accanto all'attività che desideri modificare, aggiorna il timestamp e clicca su 'Update'.",
    },
    {
        question: "Come funziona il riepilogo settimanale?",
        answer: "Il riepilogo settimanale mostra come hai distribuito il tuo tempo tra le varie attività negli ultimi 7 giorni. Il grafico a torta ti dà una visione immediata delle categorie a cui hai dedicato più tempo, aiutandoti a bilanciare i tuoi sforzi.",
    },
    {
        question: "È possibile annullare il mio abbonamento?",
        answer: "Sì, puoi gestire il tuo abbonamento in qualsiasi momento dalla pagina del tuo profilo. L'annullamento sarà effettivo alla fine del periodo di fatturazione corrente.",
    },
    {
        question: "Come viene garantita la privacy dei miei dati?",
        answer: "La tua privacy è la nostra priorità. Tutti i tuoi dati sono memorizzati in modo sicuro e non vengono condivisi con terze parti. Per maggiori dettagli, consulta la nostra informativa sulla privacy.",
    },
];

export function FaqPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <CardTitle>Domande Frequenti (FAQ)</CardTitle>
                    </div>
                    <CardDescription>
                        Trova le risposte alle domande più comuni sulla nostra applicazione.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem value={`item-${index + 1}`} key={index}>
                                <AccordionTrigger>{faq.question}</AccordionTrigger>
                                <AccordionContent>
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
