 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/components/habit-dashboard.tsx b/src/components/habit-dashboard.tsx
index a135d548cb9bd0181cbbb8a2a1743016f2c797e2..660f723c15d2c1a681cf7a39e3054ca805ab0279 100644
--- a/src/components/habit-dashboard.tsx
+++ b/src/components/habit-dashboard.tsx
@@ -1,69 +1,42 @@
 
 "use client";
 
 import { useState, useEffect } from 'react';
 import { DailyLog } from '@/components/daily-log';
 import { WeeklySummary } from '@/components/weekly-summary';
 import { Button } from '@/components/ui/button';
 import { Calendar, HelpCircle, Menu, Search, Plus, ListFilter, ListPlus, X, CheckSquare, Grid, Clock } from 'lucide-react';
 import { addDays, format, isSameDay } from 'date-fns';
 import { it } from 'date-fns/locale';
 import { cn } from '@/lib/utils';
 import type { SignupData } from './login-form';
 import Link from 'next/link';
 import { auth, db } from '@/lib/firebase';
 import { collection, query, onSnapshot, orderBy, doc, updateDoc, Timestamp } from 'firebase/firestore';
 
 
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
 export type LogEntry = {
   id: string; // Firestore document ID
   type: string;
   description: string;
   timestamp: Date;
   value?: number;
   category: 'Abitudine' | 'Compito';
   iconName: string; 
   color: string;
 };
 
 interface HabitDashboardProps {
     userData: SignupData;
     onLogout: () => void;
 }
 
 export function HabitDashboard({ userData, onLogout }: HabitDashboardProps) {
   const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
   const [selectedDate, setSelectedDate] = useState(new Date());
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     const currentUser = auth.currentUser;
     if (!currentUser) {
         setLoading(false);
 
EOF
)
