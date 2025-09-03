
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const feedbackSchema = z.object({
  source: z.string({ required_error: "Seleziona un'opzione." }),
  otherSource: z.string().optional(),
  usedSimilarApps: z.enum(["yes", "no"], { required_error: "Seleziona un'opzione." }),
  experience: z.enum(["bad", "normal", "good"], { required_error: "Seleziona un'opzione." }),
}).refine(data => {
    if (data.source === 'altro' && !data.otherSource) {
        return false;
    }
    return true;
}, {
    message: "Specifica dove ci hai conosciuto.",
    path: ["otherSource"],
});


interface FeedbackFormProps {
    onSubmit: () => void;
}

export function FeedbackForm({ onSubmit }: FeedbackFormProps) {
  const { toast } = useToast();
  const [showOtherSource, setShowOtherSource] = useState(false);

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      otherSource: "",
    },
  });

  function onFormSubmit(values: z.infer<typeof feedbackSchema>) {
    console.log("Feedback received:", values);
    toast({
      title: "Grazie per il tuo feedback!",
    });
    onSubmit();
  }

  return (
     <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle>Un'ultima cosa...</CardTitle>
                <CardDescription>
                    Aiutaci a migliorare rispondendo a queste brevi domande.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="source"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dove ci hai conosciuto?</FormLabel>
                                    <Select 
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setShowOtherSource(value === 'altro');
                                        }} 
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleziona un'opzione" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="instagram">Instagram</SelectItem>
                                            <SelectItem value="youtube">YouTube</SelectItem>
                                            <SelectItem value="passaparola">Passaparola</SelectItem>
                                            <SelectItem value="ads">Pubblicità</SelectItem>
                                            <SelectItem value="altro">Altro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {showOtherSource && (
                           <FormField
                                control={form.control}
                                name="otherSource"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Specifica dove</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Es. Un amico, un blog, ..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="usedSimilarApps"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Hai già usato app simili in passato?</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col sm:flex-row gap-4"
                                        >
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl><RadioGroupItem value="yes" /></FormControl>
                                                <FormLabel className="font-normal">Sì</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl><RadioGroupItem value="no" /></FormControl>
                                                <FormLabel className="font-normal">No</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="experience"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>La tua esperienza di registrazione è stata:</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col sm:flex-row gap-4"
                                        >
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl><RadioGroupItem value="good" /></FormControl>
                                                <FormLabel className="font-normal">Buona</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl><RadioGroupItem value="normal" /></FormControl>
                                                <FormLabel className="font-normal">Normale</FormLabel>
                                            </FormItem>
                                             <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl><RadioGroupItem value="bad" /></FormControl>
                                                <FormLabel className="font-normal">Pessima</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
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
