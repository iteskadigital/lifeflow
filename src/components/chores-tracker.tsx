
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Home, Shirt, Sparkles } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

// Schemas
const laundrySchema = z.object({
  loads: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});
const cleaningSchema = z.object({
  tasks: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

const cleaningOptions = [
  { id: 'camera-da-letto', label: 'Camera da letto' },
  { id: 'cucina', label: 'Cucina' },
  { id: 'bagno', label: 'Bagno' },
  { id: 'sala', label: 'Sala' },
  { id: 'corridoio', label: 'Corridoio' },
  { id: 'balcone', label: 'Balcone' },
];

const laundryOptions = [
    { id: 'vestiti-sportive', label: 'Vestiti sportive' },
    { id: 'lenzuola', label: 'Lenzuola' },
    { id: 'tappeti', label: 'Tappeti' },
    { id: 'bianchi', label: 'Bianchi' },
    { id: 'scuri', label: 'Scuri' },
    { id: 'colorati', label: 'Colorati' },
    { id: 'camice', label: 'Camice' },
    { id: 'piumone', label: 'Piumone' },
];

interface ChoresTrackerProps {
  addLogEntry: (type: string, description: string, value?: number) => void;
}

export function ChoresTracker({ addLogEntry }: ChoresTrackerProps) {
  const { toast } = useToast();

  const laundryForm = useForm<z.infer<typeof laundrySchema>>({
    resolver: zodResolver(laundrySchema),
    defaultValues: { loads: [] },
  });
  const cleaningForm = useForm<z.infer<typeof cleaningSchema>>({
    resolver: zodResolver(cleaningSchema),
    defaultValues: { tasks: [] },
  });

  function onLaundrySubmit(data: z.infer<typeof laundrySchema>) {
    const description = `Laundry: ${data.loads.join(', ')}`;
    addLogEntry('Chore', description);
    toast({ title: "Task Logged", description: "Your task has been logged." });
    laundryForm.reset({ loads: [] });
  }

  function onCleaningSubmit(data: z.infer<typeof cleaningSchema>) {
    const description = `Cleaning: ${data.tasks.join(', ')}`;
    addLogEntry('Chore', description);
    toast({ title: "Task Logged", description: "Your task has been logged." });
    cleaningForm.reset({ tasks: [] });
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5 text-primary" />
          Household Chores
        </CardTitle>
        <CardDescription>Keep track of household chores.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <Tabs defaultValue="laundry" className="w-full flex flex-col flex-grow">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="laundry"><Shirt className="mr-2 h-4 w-4" />Laundry</TabsTrigger>
            <TabsTrigger value="cleaning"><Sparkles className="mr-2 h-4 w-4" />Cleaning</TabsTrigger>
          </TabsList>
          <TabsContent value="laundry" className="flex-grow">
            <Form {...laundryForm}>
              <form onSubmit={laundryForm.handleSubmit(onLaundrySubmit)} className="space-y-4 pt-4">
                <FormField
                  control={laundryForm.control}
                  name="loads"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                        {laundryOptions.map((item) => (
                          <FormField
                            key={item.id}
                            control={laundryForm.control}
                            name="loads"
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
                <Button type="submit" className="w-full">Log</Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="cleaning" className="flex-grow">
            <Form {...cleaningForm}>
              <form onSubmit={cleaningForm.handleSubmit(onCleaningSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={cleaningForm.control}
                  name="tasks"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                        {cleaningOptions.map((item) => (
                          <FormField
                            key={item.id}
                            control={cleaningForm.control}
                            name="tasks"
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
                <Button type="submit" className="w-full">Log</Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
