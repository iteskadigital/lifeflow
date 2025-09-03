
"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { LogEntry } from "./habit-dashboard";
import { Button } from "./ui/button";
import { MoreVertical, Bell, Activity, Bed, BookOpen, Brain, GlassWater, Home, Smartphone, Users, PenSquare, AlertCircle, Trash2 } from "lucide-react";
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
  updateLogEntryTimestamp: (id: string, newTimestamp: Date) => void;
}

interface TagProps {
  type: 'Abitudine' | 'Compito';
  className?: string;
}

const Tag: React.FC<TagProps> = ({ type, className }) => {
    const style = type === 'Abitudine' 
        ? 'bg-red-500/20 text-red-400' 
        : 'bg-purple-500/20 text-purple-400';
    return (
        <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${style} ${className}`}>
            {type}
        </span>
    );
};


export function DailyLog({ logEntries, updateLogEntryTimestamp }: DailyLogProps) {
    const { toast } = useToast();

    const handleDelete = async (entryId: string) => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            toast({ variant: "destructive", title: "Non autorizzato", description: "Devi essere loggato per eliminare una voce." });
            return;
        }

        try {
            const docRef = doc(db, 'users', currentUser.uid, 'logEntries', entryId);
            await deleteDoc(docRef);
            toast({ title: "Voce eliminata", description: "L'attività è stata rimossa dal tuo log." });
        } catch (error) {
            console.error("Error deleting document: ", error);
            toast({ variant: "destructive", title: "Errore", description: "Impossibile eliminare la voce. Riprova." });
        }
    };


    return (
        <div className="space-y-3">
            {logEntries.length > 0 ? (
                logEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center gap-4 p-3 bg-secondary rounded-lg">
                        <div className={ `w-12 h-12 rounded-lg flex items-center justify-center text-white ${entry.color}` }>
                           {ICONS[entry.iconName] || <AlertCircle />}
                        </div>
                        <div className="flex-grow">
                            <p className="font-semibold">{entry.description}</p>
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Tag type={entry.category} />
                                {entry.value && (
                                     <span className="text-xs">{entry.value}P</span>
                                )}
                                {entry.category === 'Compito' && (
                                    <>
                                        <Bell className="w-3 h-3" />
                                        <span>{format(new Date(entry.timestamp), 'HH:mm')}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-muted flex items-center justify-center">
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-muted-foreground">
                                    <MoreVertical className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleDelete(entry.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Elimina</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ))
            ) : (
                <div className="text-center text-muted-foreground py-10">
                    Nessuna attività registrata per questo giorno.
                </div>
            )}
        </div>
    );
}
