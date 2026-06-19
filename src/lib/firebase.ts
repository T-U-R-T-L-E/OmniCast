import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc,
  query,
  orderBy,
  where
} from "firebase/firestore";

// User's provided Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpq95dwqygZeggu4ESXiq6KRzvA-Y6mG8",
  authDomain: "omni-cast-499817.firebaseapp.com",
  projectId: "omni-cast-499817",
  storageBucket: "omni-cast-499817.firebasestorage.app",
  messagingSenderId: "919462078431",
  appId: "1:919462078431:web:5c32cf912925f970b9466a",
  measurementId: ""
};

const databaseId = "ai-studio-b96f539a-a31e-4d4a-ad49-cdf81fc84dbb";

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app, databaseId);

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
      userId: auth.currentUser?.uid || "anonymous_sandbox_user",
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || false,
      isAnonymous: auth.currentUser?.isAnonymous || true,
    },
    operationType,
    path
  };
  console.error("Firestore Permission or Access Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

import { CrossPost } from "../types";

const COLLECTION_NAME = "campaigns";

export async function loadCampaignsFromFirestore(uid: string): Promise<CrossPost[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("ownerId", "==", uid)
    );
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
    const uid = auth.currentUser?.uid;
    const campaignToSave: CrossPost = {
      ...campaign,
      ownerId: campaign.ownerId || uid || "unknown_user"
    };
    const ref = doc(db, COLLECTION_NAME, campaign.id);
    await setDoc(ref, campaignToSave);
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
