 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/components/add-item-page.tsx b/src/components/add-item-page.tsx
index 9cece95bef29f6d01c2e59b9d30598020d68b34a..2b6537b249603241cc39545fa3d27b18610d3fa7 100644
--- a/src/components/add-item-page.tsx
+++ b/src/components/add-item-page.tsx
@@ -1,122 +1,96 @@
 
 "use client";
 
 import { useState, useEffect } from 'react';
 import Link from 'next/link';
 import { ArrowLeft } from 'lucide-react';
 import { useRouter } from 'next/navigation';
 
 import { HealthTracker } from '@/components/health-tracker';
 import { ProductivityTracker } from '@/components/productivity-tracker';
 import { Journal } from '@/components/journal';
 import { ChoresTracker } from '@/components/chores-tracker';
 import { SocialTracker } from '@/components/social-tracker';
 import { AlcoholTracker } from '@/components/alcohol-tracker';
 import { Button } from '@/components/ui/button';
 import { useToast } from '@/hooks/use-toast';
 import type { LogEntry } from './habit-dashboard';
+import { ICON_MAP, COLOR_MAP, type LogType } from '@/lib/log-mappings';
 import { auth, db } from '@/lib/firebase';
 import { collection, addDoc, query, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
 
 
-const ICONS: { [key: string]: string } = {
-    Activity: 'Activity',
-    Sleep: 'Bed',
-    Nutrition: 'Brain',
-    Weight: 'Home',
-    'Phone Usage': 'Smartphone',
-    Meditation: 'Meditation',
-    Reading: 'BookOpen',
-    Chore: 'Home',
-    Social: 'Users',
-    Alcohol: 'GlassWater',
-    Journal: 'Journal',
-};
-
-const COLORS: { [key: string]: string } = {
-    Activity: 'bg-blue-500',
-    Sleep: 'bg-indigo-500',
-    Nutrition: 'bg-green-500',
-    Weight: 'bg-yellow-500',
-    'Phone Usage': 'bg-gray-500',
-    Meditation: 'bg-purple-500',
-    Reading: 'bg-orange-500',
-    Chore: 'bg-pink-500',
-    Social: 'bg-red-500',
-    Alcohol: 'bg-teal-500',
-    Journal: 'bg-cyan-500',
-};
 
 export function AddItemPage() {
     const router = useRouter();
     const { toast } = useToast();
     const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
 
     useEffect(() => {
         const currentUser = auth.currentUser;
         if (!currentUser) return;
 
         const logEntriesCollection = collection(db, 'users', currentUser.uid, 'logEntries');
         const q = query(logEntriesCollection, orderBy('timestamp', 'desc'));
 
         const unsubscribe = onSnapshot(q, (querySnapshot) => {
             const entries: LogEntry[] = [];
             querySnapshot.forEach((doc) => {
                 const data = doc.data();
                 entries.push({
                     id: doc.id,
                     ...data,
                     timestamp: (data.timestamp as Timestamp).toDate(),
                 } as LogEntry);
             });
             setLogEntries(entries);
         });
 
         return () => unsubscribe();
     }, []);
 
 
-    const addLogEntry = async (type: string, description: string, value?: number, date?: Date) => {
+    const addLogEntry = async (type: LogType, description: string, value?: number, date?: Date) => {
         const currentUser = auth.currentUser;
         if (!currentUser) {
             toast({
                 variant: "destructive",
                 title: "Not authenticated",
                 description: "You must be logged in to add an entry.",
             });
             return;
         }
 
         const newEntry = {
           type: type,
           description: description,
           timestamp: date || new Date(),
           value: value,
           category: ['Activity', 'Sleep', 'Nutrition', 'Weight', 'Phone Usage', 'Meditation', 'Reading', 'Social', 'Alcohol', 'Journal', 'Workout', 'Podcast', 'Telegram & Discord', 'Iteska Digital', 'Daily Plan', 'Alcohol Free', 'Home Food'].includes(type) ? 'Abitudine' : 'Compito',
-          iconName: ICONS[type] || 'Activity',
-          color: COLORS[type] || 'bg-gray-500'
+          iconName: ICON_MAP[type] ? type : 'Activity',
+          color: COLOR_MAP[type]
         };
         
         try {
             await addDoc(collection(db, 'users', currentUser.uid, 'logEntries'), newEntry);
             toast({
                 title: "Activity Logged!",
                 description: `${type} entry has been saved.`,
             });
             router.push('/');
         } catch (error) {
             console.error("Error adding document: ", error);
             toast({
                 variant: "destructive",
                 title: "Error",
                 description: "Could not save the entry. Please try again.",
             });
         }
     };
 
     return (
         <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
              <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border/20 bg-background/95 px-4 backdrop-blur-sm md:px-6 -mx-4 md:-mx-6">
                 <div className="flex items-center gap-4">
                     <Button variant="ghost" size="icon" asChild>
                         <Link href="/">
 
EOF
)
