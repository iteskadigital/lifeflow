
"use client";

import { useState, useEffect } from 'react';
import { HabitDashboard } from '@/components/habit-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { SignupData, PartialSignupData } from './login-form';
import { OnboardingForm } from './onboarding-form';
import { SubscriptionForm } from './subscription-form';
import { FeedbackForm } from './feedback-form';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { LoginForm } from './login-form';

type OnboardingStep = 'login' | 'subscription' | 'onboarding' | 'feedback' | 'completed';

export function MainPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<PartialSignupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('login');
  const { toast } = useToast();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
            const data = userDoc.data() as PartialSignupData;
            setUserData(data);
            // Determine onboarding step based on user data
            if (!data.subscriptionType) {
                setOnboardingStep('subscription');
            } else if (!data.onboardingCompleted) {
                setOnboardingStep('onboarding');
            } else if (!data.feedbackCompleted){
                setOnboardingStep('feedback');
            } else {
                setOnboardingStep('completed');
            }
        } else {
            // This can happen if Firestore doc creation failed during signup
            // Or for a new user who hasn't completed the signup process fully.
            // We'll create a basic doc and send them to the subscription step.
            const initialData = { email: currentUser.email, name: currentUser.displayName || 'New User', onboardingCompleted: false, feedbackCompleted: false };
            await setDoc(userDocRef, initialData, { merge: true });
            setUserData(initialData);
            setOnboardingStep('subscription'); 
        }
      } else {
        // No user is signed in
        setUser(null);
        setUserData(null);
        setOnboardingStep('login');
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

  const updateUserData = async (data: PartialSignupData) => {
      if (!user) return;
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, data, { merge: true });
      // Fetch the latest data to update the local state
      const updatedUserDoc = await getDoc(userDocRef);
      if (updatedUserDoc.exists()) {
        setUserData(updatedUserDoc.data() as PartialSignupData);
      }
  }

  const handleOnboardingSubmit = async (data: any) => {
    await updateUserData({ ...data, onboardingCompleted: true });
    setOnboardingStep('feedback');
  };

  const handleSubscriptionSubmit = async (plan: 'monthly' | 'annual' | 'lifetime') => {
    await updateUserData({ subscriptionType: plan });
    setOnboardingStep('onboarding');
  };

  const handleFeedbackSubmit = async () => {
      await updateUserData({ feedbackCompleted: true });
      setOnboardingStep('completed');
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
          return <OnboardingForm onBack={() => setOnboardingStep('subscription')} onSubmit={handleOnboardingSubmit} />;
      case 'feedback':
          return <FeedbackForm onSubmit={handleFeedbackSubmit} />;
      case 'completed':
          return <HabitDashboard userData={userData as SignupData} onLogout={handleLogout} />;
      default:
          // Fallback to login if state is inconsistent
          return <LoginForm />;
  }
}
