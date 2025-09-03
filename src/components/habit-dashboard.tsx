
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
        >
            <path d="M12 1a3 3 0 0 0-3 3v2" />
            <path d="M12 1a3 3 0 0 1 3 3v2" />
            <path d="M12 22a3 3 0 0 0 3-3v-2" />
            <path d="M12 22a3 3 0 0 1-3-3v-2" />
            <path d="M21 12a3 3 0 0 0-3-3h-2" />
            <path d="M3 12a3 3 0 0 1 3-3h2" />
            <path d="M21 12a3 3 0 0 1-3 3h-2" />
            <path d="M3 12a3 3 0 0 0 3 3h2" />
            <path d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" />
        </svg>
    )
}

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
        return;
    };

    const logEntriesCollection = collection(db, 'users', currentUser.uid, 'logEntries');
    const q = query(logEntriesCollection, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const entries: LogEntry[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            entries.push({
                id: doc.id,
                type: data.type,
                description: data.description,
                timestamp: (data.timestamp as Timestamp).toDate(),
                value: data.value,
                category: data.category,
                iconName: data.iconName,
                color: data.color,
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
  
  const dates = Array.from({ length: 10 }).map((_, i) => addDays(new Date(), i - 5));

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

      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-40 space-y-8">
        <WeeklySummary logEntries={logEntries} />
        <div className="space-y-4">
            {/* Date Selector */}
            <div className="overflow-x-auto whitespace-nowrap pb-4 -mx-4 px-4">
                <div className="flex space-x-2">
                {dates.map(date => (
                <Button
                    key={date.toString()}
                    variant={isSameDay(date, selectedDate) ? 'default' : 'secondary'}
                    className={cn(
                        "flex flex-col h-auto rounded-xl px-4 py-2",
                        isSameDay(date, selectedDate) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    )}
                    onClick={() => setSelectedDate(date)}
                >
                    <span className="text-xs capitalize">{format(date, 'EEE', { locale: it })}</span>
                    <span className="text-lg font-bold">{format(date, 'd')}</span>
                </Button>
                ))}
            </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
                <Button variant="destructive" className="rounded-full bg-primary/20 text-primary hover:bg-primary/30">Tutti</Button>
                <Button variant="ghost" className="rounded-full text-muted-foreground"><ListPlus className="mr-2 h-4 w-4" />Nuova lista</Button>
                <div className="flex-grow" />
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground"><ListFilter className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground"><HelpCircle className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground"><X className="h-5 w-5" /></Button>
            </div>
        </div>
        
        {loading ? (
             <div className="text-center text-muted-foreground py-10">Loading entries...</div>
        ) : (
            <DailyLog logEntries={filteredLogEntries} updateLogEntryTimestamp={updateLogEntryTimestamp} />
        )}
        
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6 z-50">
        <Button size="icon" className="rounded-2xl w-14 h-14 shadow-lg bg-primary hover:bg-primary/90" asChild>
          <Link href="/add">
            <Plus className="h-8 w-8" />
          </Link>
        </Button>
      </div>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-border/20 bg-background/95 backdrop-blur-sm">
        <nav className="flex items-center justify-around h-16">
            <Button variant="ghost" className="flex flex-col h-auto items-center text-primary">
                <CheckSquare className="h-6 w-6 mb-1" />
                <span className="text-xs">Oggi</span>
            </Button>
             <Button variant="ghost" className="flex flex-col h-auto items-center text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mb-1"><path d="m12 17-5-5h10l-5 5Z"/><path d="M12 2v10"/></svg>
                <span className="text-xs">Abitudini</span>
            </Button>
             <Button variant="ghost" className="flex flex-col h-auto items-center text-muted-foreground">
                <CheckSquare className="h-6 w-6 mb-1" />
                <span className="text-xs">Compiti</span>
            </Button>
             <Button variant="ghost" className="flex flex-col h-auto items-center text-muted-foreground">
                <Grid className="h-6 w-6 mb-1" />
                <span className="text-xs">Categorie</span>
            </Button>
             <Button variant="ghost" className="flex flex-col h-auto items-center text-muted-foreground">
                <Clock className="h-6 w-6 mb-1" />
                <span className="text-xs">Timer</span>
            </Button>
        </nav>
      </footer>
    </div>
  );
}
