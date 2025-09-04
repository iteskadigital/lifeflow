 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/components/chores-tracker.tsx b/src/components/chores-tracker.tsx
index d8ff634d59fa86d97300c99ac63ea54a825cdb31..b116e9ed82701fb01d03f10d9a0f80fe5ecde485 100644
--- a/src/components/chores-tracker.tsx
+++ b/src/components/chores-tracker.tsx
@@ -1,73 +1,74 @@
 
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
+import type { LogType } from '@/lib/log-mappings';
 
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
-  addLogEntry: (type: string, description: string, value?: number) => void;
+  addLogEntry: (type: LogType, description: string, value?: number) => void;
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
 
EOF
)
