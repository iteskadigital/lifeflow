 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/components/main-page.tsx b/src/components/main-page.tsx
index 6da54328c82d3f80746f8ae30f214b9ce8188b16..aa70bd800e25c3167a600f8e846a22bcd6ccdf25 100644
--- a/src/components/main-page.tsx
+++ b/src/components/main-page.tsx
@@ -61,74 +61,91 @@ export function MainPage() {
       }
       setLoading(false);
     });
 
     // Cleanup subscription on unmount
     return () => unsubscribe();
   }, []);
 
   const handleLogout = () => {
     signOut(auth).then(() => {
       toast({
         title: "Grazie per averci visitato!",
         description: "Torna presto :(",
       });
       // The onAuthStateChanged listener will handle state cleanup
     }).catch((error) => {
       console.error("Error signing out: ", error);
       toast({
         variant: "destructive",
         title: "Errore",
         description: "Impossibile effettuare il logout. Riprova.",
       });
     });
   }
 
-  const updateUserData = async (data: PartialSignupData) => {
-      if (!user) return;
+  const updateUserData = async (data: PartialSignupData): Promise<boolean> => {
+      if (!user) return false;
       const userDocRef = doc(db, 'users', user.uid);
-      await setDoc(userDocRef, data, { merge: true });
-      // Fetch the latest data to update the local state
-      const updatedUserDoc = await getDoc(userDocRef);
-      if (updatedUserDoc.exists()) {
-        setUserData(updatedUserDoc.data() as PartialSignupData);
+      try {
+        await setDoc(userDocRef, data, { merge: true });
+        // Fetch the latest data to update the local state
+        const updatedUserDoc = await getDoc(userDocRef);
+        if (updatedUserDoc.exists()) {
+          setUserData(updatedUserDoc.data() as PartialSignupData);
+        }
+        return true;
+      } catch (error) {
+        console.error("Error updating user data:", error);
+        toast({
+          variant: "destructive",
+          title: "Errore",
+          description: "Impossibile aggiornare i dati dell'utente.",
+        });
+        return false;
       }
   }
 
   const handleOnboardingSubmit = async (data: any) => {
-    await updateUserData({ ...data, onboardingCompleted: true });
-    setOnboardingStep('feedback');
+    const success = await updateUserData({ ...data, onboardingCompleted: true });
+    if (success) {
+      setOnboardingStep('feedback');
+    }
   };
 
   const handleSubscriptionSubmit = async (plan: 'monthly' | 'annual' | 'lifetime') => {
-    await updateUserData({ subscriptionType: plan });
-    setOnboardingStep('onboarding');
+    const success = await updateUserData({ subscriptionType: plan });
+    if (success) {
+      setOnboardingStep('onboarding');
+    }
   };
 
   const handleFeedbackSubmit = async () => {
-      await updateUserData({ feedbackCompleted: true });
-      setOnboardingStep('completed');
+      const success = await updateUserData({ feedbackCompleted: true });
+      if (success) {
+        setOnboardingStep('completed');
+      }
   };
 
   if (loading) {
      return (
       <div className="flex items-center justify-center min-h-screen">
         <div className="flex flex-col space-y-3">
           <Skeleton className="h-[125px] w-[250px] rounded-xl" />
           <div className="space-y-2">
             <Skeleton className="h-4 w-[250px]" />
             <Skeleton className="h-4 w-[200px]" />
           </div>
         </div>
       </div>
     );
   }
   
   if (!user || onboardingStep === 'login') {
       return <LoginForm />;
   }
 
   // User is authenticated, proceed with onboarding flow
   switch (onboardingStep) {
       case 'subscription':
           return <SubscriptionForm onSubmit={handleSubscriptionSubmit} />;
       case 'onboarding':
 
EOF
)
