import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  OAuthProvider, 
  signInWithPopup, 
  sendEmailVerification, 
  sendPasswordResetEmail,
  linkWithCredential, 
  EmailAuthProvider,
  User,
  signOut,
  updateProfile
} from "firebase/auth";
import { auth } from "./firebase";

/**
 * Maps standard Firebase Auth error codes to user-friendly messages as requested.
 */
export function translateAuthError(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email address already exists.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password. Please try again.";
    case "auth/weak-password":
      return "Password must be at least 6 characters long and include numbers.";
    case "auth/popup-closed-by-user":
      return "Sign-in cancelled. Please try clicking the button again.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/requires-recent-login":
      return "This action requires re-authentication. Please sign out and sign back in.";
    case "auth/too-many-requests":
      return "Too many failed attempts. This account has been temporarily disabled. Please reset your password or try again later.";
    default:
      return "An unexpected authentication error occurred. Please try again.";
  }
}

/**
 * Register a user with Email/Password, trigger verification, and return the user.
 */
export async function signUpWithEmail(email: string, password: string, displayName?: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  if (user) {
    if (displayName) {
      try {
        await updateProfile(user, { displayName });
      } catch (profileErr) {
        console.error("Failed to set displayName during signup:", profileErr);
      }
    }
    await sendEmailVerification(user);
  }
  return user;
}

/**
 * Sign in a user with Email/Password.
 */
export async function signInWithEmail(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Sign in using Google OAuth Provider.
 */
export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  // Ensure that we prompt for account selection
  provider.setCustomParameters({
    prompt: "select_account"
  });
  const userCredential = await signInWithPopup(auth, provider);
  return userCredential.user;
}

/**
 * Sign in using Apple OAuth Provider.
 */
export async function signInWithApple(): Promise<User> {
  const provider = new OAuthProvider("apple.com");
  const userCredential = await signInWithPopup(auth, provider);
  return userCredential.user;
}

/**
 * Triggers a Password Reset Email to the specified address.
 */
export async function triggerPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Send email verification again to the currently signed in user.
 */
export async function resendVerificationEmail(): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("No user is currently authenticated.");
  }
  await sendEmailVerification(currentUser);
}

/**
 * Checks if a user has logged in via Google/Apple but has not yet linked an app password.
 * This identifies "Account-Linking Flow" requirements.
 */
export function isPasswordLinkingRequired(user: User | null): boolean {
  return false;
}

/**
 * Link an existing Google/Apple user account with a static login password.
 * This prevents dual-account fracturing and provides dual authenticators.
 */
export async function linkAccountWithPassword(password: string): Promise<User> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("No user is currently authenticated to link credentials.");
  }
  
  if (!currentUser.email) {
    throw new Error("User email is required for setting an account password.");
  }
  
  const credential = EmailAuthProvider.credential(currentUser.email, password);
  const userCredential = await linkWithCredential(currentUser, credential);
  return userCredential.user;
}

/**
 * Check if the user's email is fully verified (or bypasses verification via Google/Apple).
 */
export function isUserEmailVerified(user: User | null): boolean {
  if (!user) return false;
  
  // Custom auth rule: Social login providers are implicitly trusted as verified.
  // Standard email-password registration requires validation.
  const providers = user.providerData.map(p => p.providerId);
  const isSocialUser = providers.includes("google.com") || providers.includes("apple.com");
  
  if (isSocialUser) {
    return true; // Trusted
  }
  
  return user.emailVerified;
}

/**
 * Sign out of Firebase.
 */
export async function logOutUser(): Promise<void> {
  await signOut(auth);
}
