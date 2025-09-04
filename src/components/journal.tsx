 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/components/journal.tsx b/src/components/journal.tsx
index 0aa54745708da246b8a27431b8cd3ef10d5aafcc..87ad8d301a964502bae32a58039c2619065ce339 100644
--- a/src/components/journal.tsx
+++ b/src/components/journal.tsx
@@ -1,59 +1,60 @@
 
 "use client";
 
 import { useForm } from "react-hook-form";
 import { zodResolver } from "@hookform/resolvers/zod";
 import * as z from "zod";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
 import { Textarea } from "@/components/ui/textarea";
 import { Button } from "@/components/ui/button";
 import { useToast } from "@/hooks/use-toast";
 import { PenSquare } from "lucide-react";
 import { Checkbox } from "@/components/ui/checkbox";
+import type { LogType } from '@/lib/log-mappings';
 
 const moodOptions = [
     { id: 'produttiva', label: 'Produttiva' },
     { id: 'rilassante', label: 'Rilassante' },
     { id: 'stressante', label: 'Stressante' },
     { id: 'felice', label: 'Felice' },
     { id: 'triste', label: 'Triste' },
     { id: 'energica', label: 'Energica' },
     { id: 'stanca', label: 'Stanca' },
     { id: 'creativa', label: 'Creativa' },
 ];
 
 const journalSchema = z.object({
   entry: z.string().min(10, { message: "Journal entry must be at least 10 characters long." }),
   moods: z.array(z.string()).refine((value) => value.some((item) => item), {
     message: "You have to select at least one mood.",
   }),
 });
 
 interface JournalProps {
-  addLogEntry: (type: string, description: string) => void;
+  addLogEntry: (type: LogType, description: string) => void;
 }
 
 export function Journal({ addLogEntry }: JournalProps) {
   const { toast } = useToast();
 
   const form = useForm<z.infer<typeof journalSchema>>({
     resolver: zodResolver(journalSchema),
     defaultValues: {
       entry: "",
       moods: [],
     },
   });
 
   function onSubmit(values: z.infer<typeof journalSchema>) {
     let description = `Umore: ${values.moods.join(', ')}. ${values.entry}`;
     addLogEntry("Journal", description);
     toast({
       title: "Entry Saved",
       description: "Your thoughts have been recorded.",
     });
     form.reset();
   }
 
   return (
     <Card>
 
EOF
)
