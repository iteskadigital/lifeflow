
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PenSquare } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const moodOptions = [
    { id: 'produttiva', label: 'Produttiva' },
    { id: 'rilassante', label: 'Rilassante' },
    { id: 'stressante', label: 'Stressante' },
    { id: 'felice', label: 'Felice' },
    { id: 'triste', label: 'Triste' },
    { id: 'energica', label: 'Energica' },
    { id: 'stanca', label: 'Stanca' },
    { id: 'creativa', label: 'Creativa' },
];

const journalSchema = z.object({
  entry: z.string().min(10, { message: "Journal entry must be at least 10 characters long." }),
  moods: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one mood.",
  }),
});

interface JournalProps {
  addLogEntry: (type: string, description: string) => void;
}

export function Journal({ addLogEntry }: JournalProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof journalSchema>>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      entry: "",
      moods: [],
    },
  });

  function onSubmit(values: z.infer<typeof journalSchema>) {
    let description = `Umore: ${values.moods.join(', ')}. ${values.entry}`;
    addLogEntry("Journal", description);
    toast({
      title: "Entry Saved",
      description: "Your thoughts have been recorded.",
    });
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenSquare className="h-5 w-5 text-primary" />
          Personal Journal
        </CardTitle>
        <CardDescription>Jot down your thoughts, emotions, or significant events.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="moods"
              render={() => (
                <FormItem>
                    <div className="mb-4">
                        <FormLabel>Come ti sei sentito oggi?</FormLabel>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {moodOptions.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="moods"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.label)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), item.label])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.label
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                    </div>
                   <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="entry"
              render={({ field }) => (
                <FormItem>
                   <FormLabel>Daily Entry</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What's on your mind today?" className="min-h-[120px] resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Log</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
