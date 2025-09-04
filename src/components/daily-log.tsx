 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/components/daily-log.tsx b/src/components/daily-log.tsx
index fe1a74625f2e5a42f08b0275623443583233c1dd..e09c32e59d36f8808e4476cdac93cd8ce46e0b71 100644
--- a/src/components/daily-log.tsx
+++ b/src/components/daily-log.tsx
@@ -1,72 +1,60 @@
 
 "use client";
 
 import { Card, CardContent } from "@/components/ui/card";
 import type { LogEntry } from "./habit-dashboard";
 import { Button } from "./ui/button";
-import { MoreVertical, Bell, Activity, Bed, BookOpen, Brain, GlassWater, Home, Smartphone, Users, PenSquare, AlertCircle, Trash2 } from "lucide-react";
+import {
+  MoreVertical,
+  Bell,
+  Activity,
+  Bed,
+  BookOpen,
+  Brain,
+  GlassWater,
+  Home,
+  Smartphone,
+  Users,
+  PenSquare,
+  AlertCircle,
+  Trash2,
+} from "lucide-react";
+import BrainCircuit from "./icons/brain-circuit";
 import { Badge } from "./ui/badge";
 import { format } from 'date-fns';
 import { db, auth } from "@/lib/firebase";
 import { doc, deleteDoc } from "firebase/firestore";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu"
 import { useToast } from "@/hooks/use-toast";
 
 
-function BrainCircuit(props: React.SVGProps<SVGSVGElement>) {
-    return (
-        <svg
-            {...props}
-            xmlns="http://www.w3.org/2000/svg"
-            width="24"
-            height="24"
-            viewBox="0 0 24 24"
-            fill="none"
-            stroke="currentColor"
-            strokeWidth="2"
-            strokeLinecap="round"
-            strokeLinejoin="round"
-        >
-            <path d="M12 1a3 3 0 0 0-3 3v2" />
-            <path d="M12 1a3 3 0 0 1 3 3v2" />
-            <path d="M12 22a3 3 0 0 0 3-3v-2" />
-            <path d="M12 22a3 3 0 0 1-3-3v-2" />
-            <path d="M21 12a3 3 0 0 0-3-3h-2" />
-            <path d="M3 12a3 3 0 0 1 3-3h2" />
-            <path d="M21 12a3 3 0 0 1-3 3h-2" />
-            <path d="M3 12a3 3 0 0 0 3 3h2" />
-            <path d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" />
-        </svg>
-    )
-}
-
 const ICONS: { [key: string]: React.ReactNode } = {
     Activity: <Activity />,
     Sleep: <Bed />,
     Nutrition: <Brain />,
     Weight: <Home />,
     'Phone Usage': <Smartphone />,
     Meditation: <BrainCircuit />,
     Reading: <BookOpen />,
     Chore: <Home />,
     Social: <Users />,
     Alcohol: <GlassWater />,
     Journal: <PenSquare />,
     Workout: <Activity />,
     Podcast: <BookOpen />,
     'Telegram & Discord': <Users />,
     'Iteska Digital': <Users />,
     'Daily Plan': <PenSquare />,
     'Alcohol Free': <GlassWater />,
     'Home Food': <Brain />,
     'Limpiar Casa': <Home />,
 };
 
 
 interface DailyLogProps {
   logEntries: LogEntry[];
 
EOF
)
