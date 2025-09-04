 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/components/productivity-tracker.tsx b/src/components/productivity-tracker.tsx
index 10a58982f59b9473469188beec3b66083fe96268..5500edb7b6c7a9215d97edec24d0fc2eb10e5534 100644
--- a/src/components/productivity-tracker.tsx
+++ b/src/components/productivity-tracker.tsx
@@ -1,56 +1,57 @@
 
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
+import type { LogType } from '@/lib/log-mappings';
 
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
-  addLogEntry: (type: string, description: string) => void;
+  addLogEntry: (type: LogType, description: string) => void;
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
 
EOF
)
