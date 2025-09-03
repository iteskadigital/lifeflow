
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BrainCircuit, Smartphone, BookOpen } from "lucide-react";

// Schemas
const phoneSchema = z.object({
  usage: z.coerce.number().min(0).max(24, "Invalid usage hours"),
});
const meditationSchema = z.object({
  duration: z.coerce.number().positive("Duration must be positive"),
});
const readingSchema = z.object({
  title: z.string().min(1, "Book title is required"),
  pages: z.coerce.number().int().positive("Pages must be a positive number"),
  duration: z.coerce.number().positive("Duration must be positive"),
});

type FormType = "Phone Usage" | "Meditation" | "Reading";

interface ProductivityTrackerProps {
  addLogEntry: (type: string, description: string) => void;
}

export function ProductivityTracker({ addLogEntry }: ProductivityTrackerProps) {
  const { toast } = useToast();

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { usage: 2 },
  });
  const meditationForm = useForm<z.infer<typeof meditationSchema>>({
    resolver: zodResolver(meditationSchema),
    defaultValues: { duration: 15 },
  });
  const readingForm = useForm<z.infer<typeof readingSchema>>({
    resolver: zodResolver(readingSchema),
    defaultValues: { title: "", pages: 0, duration: 30 },
  });

  function onSubmit(values: any, type: FormType) {
    let description = '';
    switch (type) {
        case 'Reading':
            description = `Read "${values.title}" for ${values.duration} min (${values.pages} pages).`;
            addLogEntry(type, description);
            readingForm.reset();
            break;
        case 'Meditation':
            description = `Meditated for ${values.duration} min.`;
            addLogEntry(type, description);
            meditationForm.reset();
            break;
        case 'Phone Usage':
            description = `Phone usage: ${values.usage} hours.`;
            addLogEntry(type, description);
            phoneForm.reset();
            break;
    }
    
    toast({
      title: "Log Saved",
      description: `Your ${type.toLowerCase()} has been successfully logged.`,
    });
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          Productivity
        </CardTitle>
        <CardDescription>Track your personal development goals.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <Tabs defaultValue="reading" className="w-full flex flex-col flex-grow">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reading"><BookOpen className="mr-2 h-4 w-4" />Reading</TabsTrigger>
            <TabsTrigger value="meditation"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 1a3 3 0 0 0-3 3v2M12 1a3 3 0 0 1 3 3v2"/><path d="M12 22a3 3 0 0 0 3-3v-2M12 22a3 3 0 0 1-3-3v-2"/><path d="M21 12a3 3 0 0 0-3-3h-2M3 12a3 3 0 0 1 3-3h2"/><path d="M21 12a3 3 0 0 1-3 3h-2M3 12a3 3 0 0 0 3 3h2"/><path d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/></svg>Meditation</TabsTrigger>
            <TabsTrigger value="phone"><Smartphone className="mr-2 h-4 w-4" />Phone</TabsTrigger>
          </TabsList>

          <TabsContent value="reading" className="flex-grow">
            <Form {...readingForm}>
              <form onSubmit={readingForm.handleSubmit((data) => onSubmit(data, "Reading"))} className="space-y-4 pt-4">
                <div className="space-y-4">
                  <FormField control={readingForm.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Book Title</FormLabel>
                      <FormControl><Input placeholder="e.g., The Alchemist" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={readingForm.control} name="pages" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pages Read</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={readingForm.control} name="duration" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (min)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
                <Button type="submit" className="w-full">Log</Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="meditation" className="flex-grow">
            <Form {...meditationForm}>
              <form onSubmit={meditationForm.handleSubmit((data) => onSubmit(data, "Meditation"))} className="space-y-4 pt-4">
                <FormField control={meditationForm.control} name="duration" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meditation Duration (min)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full">Log</Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="phone" className="flex-grow">
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit((data) => onSubmit(data, "Phone Usage"))} className="space-y-4 pt-4">
                <FormField control={phoneForm.control} name="usage" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Usage (hours)</FormLabel>
                    <FormControl><Input type="number" step="0.5" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full">Log</Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
