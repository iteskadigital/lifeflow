 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a//dev/null b/src/components/icons/brain-circuit.tsx
index 0000000000000000000000000000000000000000..30e60405a1862b91e8b3aaf949bb0818888e7f1f 100644
--- a//dev/null
+++ b/src/components/icons/brain-circuit.tsx
@@ -0,0 +1,6 @@
+import { BrainCircuit as BrainCircuitIcon } from "lucide-react";
+import type { LucideProps } from "lucide-react";
+
+export default function BrainCircuit(props: LucideProps) {
+  return <BrainCircuitIcon {...props} />;
+}
 
EOF
)
