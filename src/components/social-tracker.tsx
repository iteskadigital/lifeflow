 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/components/social-tracker.tsx b/src/components/social-tracker.tsx
index 5c6692e7992f1fd7a7113a3632d09e18f53651a5..5badbacc3fffb8b54cecb4861de63f324d225282 100644
--- a/src/components/social-tracker.tsx
+++ b/src/components/social-tracker.tsx
@@ -1,61 +1,62 @@
 
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
+import type { LogType } from '@/lib/log-mappings';
 
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
-  addLogEntry: (type: string, description: string, value?: number) => void;
+  addLogEntry: (type: LogType, description: string, value?: number) => void;
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
 
EOF
)
