
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassWater } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useMemo } from "react";
import type { LogEntry } from "./habit-dashboard";

const alcoholSchema = z.object({
  alcoholType: z.enum(["beer", "wine", "liquor"]),
  quantity: z.coerce.number().positive("Quantity must be a positive number."),
  linkedActivity: z.string().optional(),
});

const RECOMMENDED_LIMIT = 2;

interface AlcoholTrackerProps {
  addLogEntry: (type: string, description: string) => void;
  logEntries: LogEntry[];
}

export function AlcoholTracker({ addLogEntry, logEntries }: AlcoholTrackerProps) {
  const { toast } = useToast();
  const [consumedAlcohol, setConsumedAlcohol] = useState<"yes" | "no" | null>(null);

  const form = useForm<z.infer<typeof alcoholSchema>>({
    resolver: zodResolver(alcoholSchema),
    defaultValues: { alcoholType: "beer", quantity: 1, linkedActivity: "none" },
  });

  const relevantActivities = useMemo(() => {
    return logEntries.filter(
      (entry) => entry.type === "Nutrition" || entry.type === "Social"
    );
  }, [logEntries]);

  function handleConsumptionChoice(value: "yes" | "no") {
    setConsumedAlcohol(value);
    if (value === 'no') {
      addLogEntry("Alcohol", "Nessun consumo di alcol.");
      toast({
        title: "Log Saved",
        description: "Registrato nessun consumo di alcol per oggi.",
      });
      setConsumedAlcohol(null); 
    }
  }

  function onSubmit(values: z.infer<typeof alcoholSchema>) {
    let description = `${values.quantity} standard serving(s) of ${values.alcoholType}.`;
    if (values.linkedActivity && values.linkedActivity !== 'none') {
      const activity = relevantActivities.find(a => a.id.toString() === values.linkedActivity);
      if (activity) {
        description += ` Durante: ${activity.description.split(',')[0]}.`;
      }
    }
    
    addLogEntry("Alcohol", description);

    if (values.quantity >= RECOMMENDED_LIMIT) {
      toast({
        title: "Responsible Drinking Reminder",
        description: "You are nearing the recommended daily limit. Please drink responsibly.",
        duration: 5000,
      });
    } else {
      toast({
        title: "Drink Logged",
        description: `Logged ${description}`,
      });
    }
    form.reset({ alcoholType: "beer", quantity: 1, linkedActivity: "none" });
    setConsumedAlcohol(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GlassWater className="h-5 w-5 text-primary" />
          Alcohol Consumption
        </CardTitle>
        <CardDescription>Get warnings when you near daily limits.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormItem className="space-y-3">
                <FormLabel>Hai consumato alcolici oggi?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={handleConsumptionChoice}
                    value={consumedAlcohol || ""}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">Sì</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="no" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>

            {consumedAlcohol === 'yes' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="alcoholType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beer">Beer</SelectItem>
                            <SelectItem value="wine">Wine</SelectItem>
                            <SelectItem value="liquor">Liquor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="linkedActivity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collega a un pasto/uscita (opzionale)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || 'none'}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona un'attività" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Nessuno</SelectItem>
                          {relevantActivities.map(activity => (
                            <SelectItem key={activity.id} value={activity.id.toString()}>
                              {activity.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Log
                </Button>
              </>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
