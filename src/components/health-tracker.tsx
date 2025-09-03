
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
import { HeartPulse, Dumbbell, Bed, Apple, Scale } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

// Schemas
const activitySchema = z.object({
  exerciseType: z.string().min(1, "Il tipo di esercizio è obbligatorio"),
  duration: z.coerce.number().positive("La durata deve essere positiva"),
  calories: z.coerce.number().positive("Le calorie devono essere positive"),
  location: z.string().optional(),
  company: z.enum(["Da solo", "In compagnia"]),
});
const sleepSchema = z.object({
  hours: z.coerce.number().min(0).max(24, "Ore di sonno non valide"),
});
const nutritionSchema = z.object({
  mealType: z.enum(["Colazione", "Pranzo", "Cena", "Spuntino", "Merenda"]),
  food: z.string().min(1, "La descrizione del pasto è obbligatoria"),
  calories: z.coerce.number().positive("Le calorie devono essere positive"),
});
const weightSchema = z.object({
  weight: z.coerce.number().positive("Il peso deve essere un numero positivo."),
});

type FormType = "Activity" | "Sleep" | "Nutrition" | "Weight";

interface HealthTrackerProps {
  addLogEntry: (type: string, description: string) => void;
}


export function HealthTracker({ addLogEntry }: HealthTrackerProps) {
  const { toast } = useToast();

  const activityForm = useForm<z.infer<typeof activitySchema>>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      exerciseType: "",
      duration: 30,
      calories: 300,
      location: "",
      company: "Da solo",
    },
  });
  const sleepForm = useForm<z.infer<typeof sleepSchema>>({
    resolver: zodResolver(sleepSchema),
    defaultValues: { hours: 8 },
  });
  const nutritionForm = useForm<z.infer<typeof nutritionSchema>>({
    resolver: zodResolver(nutritionSchema),
    defaultValues: { mealType: "Pranzo", food: "", calories: 500 },
  });
  const weightForm = useForm<z.infer<typeof weightSchema>>({
    resolver: zodResolver(weightSchema),
    defaultValues: { weight: 70 },
  });

  function onSubmit(values: any, type: FormType) {
    let description = '';
    switch (type) {
      case 'Activity':
        description = `${values.exerciseType} per ${values.duration} min, bruciate ${values.calories} calorie.`;
        if (values.location) {
          description += ` Luogo: ${values.location}.`;
        }
        description += ` ${values.company}.`;
        addLogEntry('Activity', description);
        activityForm.reset();
        break;
      case 'Sleep':
        description = `Dormito per ${values.hours} ore.`;
        addLogEntry('Sleep', description);
        sleepForm.reset();
        break;
      case 'Nutrition':
        description = `${values.mealType}: ${values.food}, ${values.calories} calorie.`;
        addLogEntry('Nutrition', description);
        nutritionForm.reset();
        break;
      case 'Weight':
        description = `Peso: ${values.weight} kg.`;
        addLogEntry('Weight', description);
        weightForm.reset();
        break;
    }
    toast({
      title: "Log Salvato",
      description: `Il tuo ${type.toLowerCase()} è stato registrato con successo.`,
    });
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HeartPulse className="h-5 w-5 text-primary" />
          Salute & Benessere
        </CardTitle>
        <CardDescription>Registra le tue metriche di salute giornaliere.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <Tabs defaultValue="activity" className="w-full flex flex-col flex-grow">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="activity"><Dumbbell className="mr-2 h-4 w-4" />Allenamento</TabsTrigger>
            <TabsTrigger value="sleep"><Bed className="mr-2 h-4 w-4" />Sonno</TabsTrigger>
            <TabsTrigger value="nutrition"><Apple className="mr-2 h-4 w-4" />Pasti</TabsTrigger>
            <TabsTrigger value="weight"><Scale className="mr-2 h-4 w-4" />Peso</TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity" className="flex-grow">
            <Form {...activityForm}>
              <form onSubmit={activityForm.handleSubmit((data) => onSubmit(data, "Activity"))} className="space-y-4 pt-4">
                <div className="space-y-4">
                  <FormField control={activityForm.control} name="exerciseType" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Che attività?</FormLabel>
                      <FormControl><Input placeholder="Es. Corsa, Palestra" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={activityForm.control} name="duration" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durata (minuti)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={activityForm.control} name="calories" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kcal Bruciate</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={activityForm.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Luogo (opzionale)</FormLabel>
                      <FormControl><Input placeholder="Es. Palestra, Parco" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={activityForm.control} name="company" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>In compagnia o da solo?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Da solo" />
                            </FormControl>
                            <FormLabel className="font-normal">Da solo</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="In compagnia" />
                            </FormControl>
                            <FormLabel className="font-normal">In compagnia</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <Button type="submit" className="w-full">Log</Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="sleep" className="flex-grow">
            <Form {...sleepForm}>
              <form onSubmit={sleepForm.handleSubmit((data) => onSubmit(data, "Sleep"))} className="space-y-4 pt-4">
                <FormField control={sleepForm.control} name="hours" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ore di Sonno</FormLabel>
                    <FormControl><Input type="number" step="0.5" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full">Log</Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="nutrition" className="flex-grow">
            <Form {...nutritionForm}>
              <form onSubmit={nutritionForm.handleSubmit((data) => onSubmit(data, "Nutrition"))} className="space-y-4 pt-4">
                <div className="space-y-4">
                    <FormField
                      control={nutritionForm.control}
                      name="mealType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo di Pasto</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleziona un tipo di pasto" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Colazione">Colazione</SelectItem>
                              <SelectItem value="Pranzo">Pranzo</SelectItem>
                              <SelectItem value="Cena">Cena</SelectItem>
                              <SelectItem value="Spuntino">Spuntino</SelectItem>
                              <SelectItem value="Merenda">Merenda</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={nutritionForm.control} name="food" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cosa hai mangiato?</FormLabel>
                        <FormControl><Input placeholder="Es. Insalata di pollo, pasta al pesto" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />
                    <FormField control={nutritionForm.control} name="calories" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Calorie Stimate</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />
                </div>
                <Button type="submit" className="w-full">Log</Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="weight" className="flex-grow">
            <Form {...weightForm}>
              <form onSubmit={weightForm.handleSubmit((data) => onSubmit(data, "Weight"))} className="space-y-4 pt-4">
                <FormField control={weightForm.control} name="weight" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (kg)</FormLabel>
                    <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
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
