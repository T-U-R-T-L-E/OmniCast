import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";

// User's provided Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBys0AX9wbbrslGAAMx_bG3AaBAMW2eJKg",
  authDomain: "omni-cast-2b1d1.firebaseapp.com",
  projectId: "omni-cast-2b1d1",
  storageBucket: "omni-cast-2b1d1.firebasestorage.app",
  messagingSenderId: "369739965631",
  appId: "1:369739965631:web:d0e9866ef0852c722bd20a",
  measurementId: "G-FE7KMGKZE1"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (safely for environments with cookies or SSR restrictions)
export const analyticsPromise = isSupported().then((supported) => {
  return supported ? getAnalytics(app) : null;
}).catch(() => null);

// Firestore operation types
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

// Structured firebase security rule / permission error handler
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: "anonymous_sandbox_user",
      email: null,
      emailVerified: false,
      isAnonymous: true,
    },
    operationType,
    path
  };
  console.error("Firestore Permission or Access Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

import { CrossPost } from "../types";

const COLLECTION_NAME = "campaigns";

export async function loadCampaignsFromFirestore(): Promise<CrossPost[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    const result: CrossPost[] = [];
    querySnapshot.forEach((docSnap) => {
      result.push({ id: docSnap.id, ...docSnap.data() } as CrossPost);
    });
    return result;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    return [];
  }
}

export async function saveCampaignToFirestore(campaign: CrossPost): Promise<void> {
  try {
    const ref = doc(db, COLLECTION_NAME, campaign.id);
    await setDoc(ref, campaign);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${campaign.id}`);
  }
}

export async function deleteCampaignFromFirestore(campaignId: string): Promise<void> {
  try {
    const ref = doc(db, COLLECTION_NAME, campaignId);
    await deleteDoc(ref);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${campaignId}`);
  }
}

export default app;
