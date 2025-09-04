 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/components/habit-dashboard.tsx b/src/components/habit-dashboard.tsx
index a135d548cb9bd0181cbbb8a2a1743016f2c797e2..f8a01d0f5e65896bdd57a8623657105198d2e3c6 100644
--- a/src/components/habit-dashboard.tsx
+++ b/src/components/habit-dashboard.tsx
@@ -1,29 +1,29 @@
 
 "use client";
 
-import { useState, useEffect } from 'react';
+import { useState, useEffect, useMemo } from 'react';
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
diff --git a/src/components/habit-dashboard.tsx b/src/components/habit-dashboard.tsx
index a135d548cb9bd0181cbbb8a2a1743016f2c797e2..f8a01d0f5e65896bdd57a8623657105198d2e3c6 100644
--- a/src/components/habit-dashboard.tsx
+++ b/src/components/habit-dashboard.tsx
@@ -89,51 +89,54 @@ export function HabitDashboard({ userData, onLogout }: HabitDashboardProps) {
             });
         });
         setLogEntries(entries);
         setLoading(false);
     }, (error) => {
         console.error("Error fetching log entries: ", error);
         setLoading(false);
     });
 
     return () => unsubscribe();
   }, []);
 
 
   const updateLogEntryTimestamp = async (id: string, newTimestamp: Date) => {
     const currentUser = auth.currentUser;
     if (!currentUser) return;
     
     const entryDocRef = doc(db, 'users', currentUser.uid, 'logEntries', id);
     try {
         await updateDoc(entryDocRef, { timestamp: newTimestamp });
     } catch (error) {
         console.error("Error updating timestamp: ", error);
     }
   };
   
-  const dates = Array.from({ length: 10 }).map((_, i) => addDays(new Date(), i - 5));
+  const dates = useMemo(
+    () => Array.from({ length: 10 }).map((_, i) => addDays(new Date(), i - 5)),
+    []
+  );
 
   const filteredLogEntries = logEntries.filter(entry => isSameDay(new Date(entry.timestamp), selectedDate));
 
   return (
     <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
       <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border/20 bg-background/95 px-4 backdrop-blur-sm md:px-6">
         <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon">
             <Menu className="h-6 w-6" />
           </Button>
           <h1 className="text-2xl font-bold">Oggi</h1>
         </div>
         <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon">
             <Search className="h-5 w-5" />
           </Button>
           <Button variant="ghost" size="icon">
             <Calendar className="h-5 w-5" />
           </Button>
            <Button variant="ghost" size="icon" onClick={onLogout}>
             <HelpCircle className="h-5 w-5" />
           </Button>
         </div>
       </header>
 
 
EOF
)
