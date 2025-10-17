'use client';

import { ReactNode, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

// This provider ensures that Firebase is only initialized on the client side.
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [firebaseInstances, setFirebaseInstances] = useState<{
    app: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
  } | null>(null);

  useEffect(() => {
    // Initialize Firebase on the client
    const instances = initializeFirebase();
    setFirebaseInstances(instances);
  }, []);

  if (!firebaseInstances) {
    // You can render a loader here if you'd like
    return null; 
  }

  return (
    <FirebaseProvider
      app={firebaseInstances.app}
      auth={firebaseInstances.auth}
      firestore={firebaseInstances.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
