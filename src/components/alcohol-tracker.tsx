 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/components/alcohol-tracker.tsx b/src/components/alcohol-tracker.tsx
index bd59d5230299b3c4dcd880c41af5b3de4c9e2430..bb6af41f01dacd5c45f38c81b8467c351ce4b990 100644
--- a/src/components/alcohol-tracker.tsx
+++ b/src/components/alcohol-tracker.tsx
@@ -1,52 +1,53 @@
 
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
+import type { LogType } from '@/lib/log-mappings';
 
 const alcoholSchema = z.object({
   alcoholType: z.enum(["beer", "wine", "liquor"]),
   quantity: z.coerce.number().positive("Quantity must be a positive number."),
   linkedActivity: z.string().optional(),
 });
 
 const RECOMMENDED_LIMIT = 2;
 
 interface AlcoholTrackerProps {
-  addLogEntry: (type: string, description: string) => void;
+  addLogEntry: (type: LogType, description: string) => void;
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
 
EOF
)
