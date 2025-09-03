
"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip, Legend, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Award } from "lucide-react";
import type { LogEntry } from "./habit-dashboard";
import { useMemo } from "react";

interface WeeklySummaryProps {
  logEntries: LogEntry[];
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary))",
  "hsl(var(--accent))",
];


const parseDuration = (entry: LogEntry): number => {
    const desc = entry.description.toLowerCase();
    let match;

    if (entry.type === 'Sleep' || entry.type === 'Phone Usage') {
        match = desc.match(/(\d+(\.\d+)?)\s+hours/);
        if (match) return parseFloat(match[1]) * 60;
    } else {
        match = desc.match(/(\d+(\.\d+)?)\s+min/);
        if (match) return parseFloat(match[1]);
    }

    return 0;
};

export function WeeklySummary({ logEntries }: WeeklySummaryProps) {

  const weeklyTimeData = useMemo(() => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const relevantEntries = logEntries.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate >= oneWeekAgo;
    });

    const timeByCategory = relevantEntries.reduce((acc, entry) => {
        const duration = parseDuration(entry);
        if (duration > 0) {
            const category = entry.type;
            if (!acc[category]) {
                acc[category] = 0;
            }
            acc[category] += duration;
        }
        return acc;
    }, {} as Record<string, number>);


    return Object.entries(timeByCategory).map(([name, value]) => ({
      name,
      value: Math.round(value / 60) // convert to hours
    })).filter(d => d.value > 0);

  }, [logEntries]);


  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Award className="h-5 w-5 text-primary" />
                    Consigli per una vita sana
                </CardTitle>
                <CardDescription>Benchmark giornalieri raccomandati per il tuo benessere.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center justify-between"><span><strong>Sonno:</strong></span> <span>7-9 ore</span></li>
                <li className="flex items-center justify-between"><span><strong>Esercizio fisico:</strong></span> <span>30-60 minuti</span></li>
                <li className="flex items-center justify-between"><span><strong>Lettura:</strong></span> <span>20-30 minuti</span></li>
                <li className="flex items-center justify-between"><span><strong>Meditazione:</strong></span> <span>10-20 minuti</span></li>
                <li className="flex items-center justify-between"><span><strong>Utilizzo del telefono:</strong></span> <span>Meno di 2 ore</span></li>
                </ul>
            </CardContent>
        </Card>

        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Weekly Summary
                </CardTitle>
                <CardDescription>How you've spent your time over the last 7 days (in hours).</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <ResponsiveContainer width="100%" height={300}>
                    {weeklyTimeData.length > 0 ? (
                        <PieChart>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: 'var(--radius)',
                                }}
                                formatter={(value: number, name: string) => [`${value} hours`, name]}
                            />
                            <Legend />
                            <Pie
                                data={weeklyTimeData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="hsl(var(--primary))"
                                label={(entry) => `${entry.name} (${entry.value}h)`}
                            >
                                {weeklyTimeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            No time-based activities logged in the last 7 days.
                        </div>
                    )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    </div>
  );
}
