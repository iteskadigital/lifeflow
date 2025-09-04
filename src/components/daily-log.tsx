 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/components/daily-log.tsx b/src/components/daily-log.tsx
index fe1a74625f2e5a42f08b0275623443583233c1dd..84a6f53f37307c2063c379048729a82849edae46 100644
--- a/src/components/daily-log.tsx
+++ b/src/components/daily-log.tsx
@@ -1,33 +1,32 @@
 
 "use client";
 
 import { Card, CardContent } from "@/components/ui/card";
 import type { LogEntry } from "./habit-dashboard";
 import { Button } from "./ui/button";
 import { MoreVertical, Bell, Activity, Bed, BookOpen, Brain, GlassWater, Home, Smartphone, Users, PenSquare, AlertCircle, Trash2 } from "lucide-react";
-import { Badge } from "./ui/badge";
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
 
 
 function BrainCircuit(props: React.SVGProps<SVGSVGElement>) {
     return (
         <svg
             {...props}
             xmlns="http://www.w3.org/2000/svg"
             width="24"
             height="24"
             viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             strokeWidth="2"
             strokeLinecap="round"
             strokeLinejoin="round"
 
EOF
)
