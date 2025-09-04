 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/components/health-tracker.tsx b/src/components/health-tracker.tsx
index 9481beda4b7f7a5c8a4dfc054bc85ad5088aea1a..e0ed3abc3a33fd90c506614333eaad5a84fadcec 100644
--- a/src/components/health-tracker.tsx
+++ b/src/components/health-tracker.tsx
@@ -1,65 +1,66 @@
 
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
+import type { LogType } from '@/lib/log-mappings';
 
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
-  addLogEntry: (type: string, description: string) => void;
+  addLogEntry: (type: LogType, description: string) => void;
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
 
EOF
)
