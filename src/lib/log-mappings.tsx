 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a//dev/null b/src/lib/log-mappings.tsx
index 0000000000000000000000000000000000000000..e583e51cf841e1cc4fc45cc17b81a020be46dbfe 100644
--- a//dev/null
+++ b/src/lib/log-mappings.tsx
@@ -0,0 +1,85 @@
+import type { LucideIcon } from 'lucide-react';
+import {
+  Activity,
+  Bed,
+  Brain,
+  Home,
+  Smartphone,
+  Users,
+  GlassWater,
+  BookOpen,
+  PenSquare
+} from 'lucide-react';
+
+// Custom icon used previously for meditation
+const BrainCircuit = (props: React.SVGProps<SVGSVGElement>) => (
+  <svg
+    {...props}
+    xmlns="http://www.w3.org/2000/svg"
+    width="24"
+    height="24"
+    viewBox="0 0 24 24"
+    fill="none"
+    stroke="currentColor"
+    strokeWidth="2"
+    strokeLinecap="round"
+    strokeLinejoin="round"
+  >
+    <path d="M12 1a3 3 0 0 0-3 3v2" />
+    <path d="M12 1a3 3 0 0 1 3 3v2" />
+    <path d="M12 22a3 3 0 0 0 3-3v-2" />
+    <path d="M12 22a3 3 0 0 1-3-3v-2" />
+    <path d="M21 12a3 3 0 0 0-3-3h-2" />
+    <path d="M3 12a3 3 0 0 1 3-3h2" />
+    <path d="M21 12a3 3 0 0 1-3 3h-2" />
+    <path d="M3 12a3 3 0 0 0 3 3h2" />
+    <path d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" />
+  </svg>
+);
+
+export const ICON_MAP = {
+  Activity,
+  Sleep: Bed,
+  Nutrition: Brain,
+  Weight: Home,
+  'Phone Usage': Smartphone,
+  Meditation: BrainCircuit as LucideIcon,
+  Reading: BookOpen,
+  Chore: Home,
+  Social: Users,
+  Alcohol: GlassWater,
+  Journal: PenSquare,
+  Workout: Activity,
+  Podcast: BookOpen,
+  'Telegram & Discord': Users,
+  'Iteska Digital': Users,
+  'Daily Plan': PenSquare,
+  'Alcohol Free': GlassWater,
+  'Home Food': Brain,
+  'Limpiar Casa': Home,
+} as const satisfies Record<string, LucideIcon>;
+
+export type LogType = keyof typeof ICON_MAP;
+
+export const COLOR_MAP: Record<LogType, string> = {
+  Activity: 'bg-blue-500',
+  Sleep: 'bg-indigo-500',
+  Nutrition: 'bg-green-500',
+  Weight: 'bg-yellow-500',
+  'Phone Usage': 'bg-gray-500',
+  Meditation: 'bg-purple-500',
+  Reading: 'bg-orange-500',
+  Chore: 'bg-pink-500',
+  Social: 'bg-red-500',
+  Alcohol: 'bg-teal-500',
+  Journal: 'bg-cyan-500',
+  Workout: 'bg-blue-500',
+  Podcast: 'bg-orange-500',
+  'Telegram & Discord': 'bg-gray-500',
+  'Iteska Digital': 'bg-gray-500',
+  'Daily Plan': 'bg-gray-500',
+  'Alcohol Free': 'bg-teal-500',
+  'Home Food': 'bg-green-500',
+  'Limpiar Casa': 'bg-pink-500',
+};
+
 
EOF
)
