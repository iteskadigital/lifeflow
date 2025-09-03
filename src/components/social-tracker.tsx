
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import type { LogEntry } from "./habit-dashboard";
import { useMemo, useState, useEffect } from "react";
import { Label } from "@/components/ui/label";

const socialOutingOptions = [
  "Colazione",
  "Brunch",
  "Pranzo",
  "Aperitivo",
  "Cena",
  "Cocktail Bar",
  "Terrazza",
  "Discoteca",
] as const;

const socialSchema = z.object({
  outing: z.enum(socialOutingOptions),
  spent: z.coerce.number().min(0, "L'importo speso non può essere negativo"),
});

interface SocialTrackerProps {
  addLogEntry: (type: string, description: string, value?: number) => void;
  logEntries: LogEntry[];
}

export function SocialTracker({ addLogEntry, logEntries }: SocialTrackerProps) {
  const { toast } = useToast();
  const [spendingGoal, setSpendingGoal] = useState(150);

  const socialSpendingData = useMemo(() => {
    return logEntries
      .filter((entry) => entry.type === "Social")
      .map((entry) => ({
        date: new Date(entry.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        spent: entry.value || 0,
      }))
      .reverse();
  }, [logEntries]);

  const socialForm = useForm<z.infer<typeof socialSchema>>({
    resolver: zodResolver(socialSchema),
    defaultValues: { outing: "Cena", spent: 0 },
  });

  const handleSocialSubmit = (values: z.infer<typeof socialSchema>) => {
    const description = `Uscita: ${values.outing}, speso €${values.spent}`;
    addLogEntry('Social', description, values.spent);
    socialForm.reset();
  };
  
  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklySpending = logEntries
      .filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entry.type === 'Social' && entryDate >= startOfWeek;
      })
      .reduce((sum, entry) => sum + (entry.value || 0), 0);

    if (logEntries.some(e => e.type === 'Social' && new Date(e.timestamp) >= startOfWeek)) {
        const remaining = spendingGoal - weeklySpending;
        if (weeklySpending > spendingGoal) {
            toast({
                title: "Obiettivo di spesa superato",
                description: `Hai superato il tuo obiettivo settimanale di €${Math.abs(remaining).toFixed(2)}.`,
                variant: "destructive",
            });
        } else if (remaining <= spendingGoal * 0.2 && remaining > 0) {
            toast({
                title: "Obiettivo di spesa quasi raggiunto",
                description: `Ti restano solo €${remaining.toFixed(2)} per questa settimana. Riduci le spese!`,
            });
        }
    }
}, [logEntries, spendingGoal, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Vita Sociale
        </CardTitle>
        <CardDescription>Tieni traccia degli eventi sociali e delle tue spese settimanali.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-4 font-semibold text-lg flex items-center gap-2"><Users className="h-5 w-5" />Uscite Sociali</h3>
            <Form {...socialForm}>
              <form onSubmit={socialForm.handleSubmit(handleSocialSubmit)} className="space-y-4">
                <FormField
                  control={socialForm.control}
                  name="outing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo di Uscita</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona un'uscita" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {socialOutingOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={socialForm.control} name="spent" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spesa (€)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full">Log</Button>
              </form>
            </Form>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Tracciamento Spese</h4>
            <div className="mb-4">
              <Label htmlFor="spending-goal">Obiettivo Settimanale (€)</Label>
              <Input
                id="spending-goal"
                type="number"
                value={spendingGoal}
                onChange={(e) => setSpendingGoal(Number(e.target.value))}
                className="mt-1"
              />
            </div>
             <ResponsiveContainer width="100%" height={200}>
              <LineChart data={socialSpendingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                  }}
                  formatter={(value: number) => `€${value}`}
                />
                <Line type="monotone" dataKey="spent" stroke="hsl(var(--primary))" strokeWidth={2} name="Speso (€)" />
                <ReferenceLine y={spendingGoal} label={{ value: `Obiettivo: €${spendingGoal}`, position: 'insideTopLeft' }} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
