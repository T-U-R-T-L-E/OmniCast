import React, { useState, useEffect } from "react";
import { 
  auth, 
  handleFirestoreError,
  OperationType 
} from "../lib/firebase";
import { 
  translateAuthError,
  signUpWithEmail, 
  signInWithEmail, 
  signInWithGoogle, 
  signInWithApple, 
  triggerPasswordReset, 
  resendVerificationEmail,
  isPasswordLinkingRequired,
  linkAccountWithPassword,
  isUserEmailVerified,
  logOutUser
} from "../lib/firebaseAuth";
import { safeStorage } from "../lib/safeStorage";
import { 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  CheckCircle, 
  ArrowLeft, 
  Send, 
  RefreshCw, 
  UserCheck, 
  AlertCircle,
  LogOut,
  HelpCircle,
  Award,
  User as UserIcon
} from "lucide-react";

interface AuthScreenProps {
  onAuthSuccess: (user: User) => void;
  onAddToast: (msg: string) => void;
  onBackToWebsite?: () => void;
}

export function AuthScreen({ onAuthSuccess, onAddToast, onBackToWebsite }: AuthScreenProps) {
  // Navigation states: "signin" | "signup" | "forgot" | "verify" | "linking"
  const [mode, setMode] = useState<"signin" | "signup" | "forgot" | "verify" | "linking">("signin");
  
  // Form input fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI UX states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Verification resend countdown
  const [countdown, setCountdown] = useState(0);
  
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [authModalView, setAuthModalView] = useState<"none" | "terms" | "privacy">("none");

  // Track active Firebase User
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Success views states
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isTransitioningOut, setIsTransitioningOut] = useState(false);

  // Listen for User Authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsInitializing(false);
      
      if (user) {
        // Evaluate verification and linking logic on state change
        const linkedRequired = isPasswordLinkingRequired(user);
        const verified = isUserEmailVerified(user);

        if (linkedRequired) {
          setMode("linking");
        } else if (!verified) {
          setMode("verify");
        } else {
          // Both conditions met, trigger transition out
          triggerSuccessTransition(user);
        }
      } else {
        // No user, reset forms
        if (mode === "verify" || mode === "linking") {
          setMode("signin");
        }
      }
    });
    return () => unsubscribe();
  }, [mode]);

  // Handle Resend timer countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Execute fading transitions on successful logins
  const triggerSuccessTransition = (user: User) => {
    setIsTransitioningOut(true);
    setTimeout(() => {
      onAuthSuccess(user);
    }, 1000); // 1-second transition
  };

  // Perform email checks manually
  const checkEmailVerificationStatus = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        const refreshedUser = auth.currentUser;
        setCurrentUser(refreshedUser);
        
        if (refreshedUser.emailVerified) {
          onAddToast("🎉 Email address successfully verified!");
          const linkedRequired = isPasswordLinkingRequired(refreshedUser);
          if (linkedRequired) {
            setMode("linking");
          } else {
            triggerSuccessTransition(refreshedUser);
          }
        } else {
          setErrorMsg("We couldn't verify this email address yet. Please click the confirmation link in your inbox.");
        }
      }
    } catch (err: any) {
      setErrorMsg("Failed to reload user session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend email verification
  const handleResendEmail = async () => {
    if (countdown > 0) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await resendVerificationEmail();
      onAddToast("✉️ A fresh authorization link was sent to your inbox!");
      setCountdown(60);
    } catch (err: any) {
      setErrorMsg(translateAuthError(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle standard registration form submission
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    setErrorMsg(null);
    
    // Quick validation
    if (!agreeToTerms) {
      setErrorMsg("You must agree to the Terms of Service and Privacy Policy to create an account.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify the confirm password field.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }
    
    try {
      await signUpWithEmail(email, password, fullName);
      onAddToast("🚀 Account pre-created! Verification email sent.");
      setMode("verify");
    } catch (err: any) {
      setErrorMsg(translateAuthError(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle standard sign-in form submission
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const user = await signInWithEmail(email, password);
      onAddToast("🔑 Signature authenticated successfully!");
      
      const linkedReq = isPasswordLinkingRequired(user);
      const verified = isUserEmailVerified(user);

      if (linkedReq) {
        setMode("linking");
      } else if (!verified) {
        setMode("verify");
      } else {
        triggerSuccessTransition(user);
      }
    } catch (err: any) {
      setErrorMsg(translateAuthError(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Social Login redirects or pop-ups
  const handleSocialAuth = async (platform: "google" | "apple") => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const user = platform === "google" ? await signInWithGoogle() : await signInWithApple();
      onAddToast(`🌐 Signed in via ${platform === "google" ? "Google" : "Apple"} Auth!`);
      
      const linkedReq = isPasswordLinkingRequired(user);
      if (linkedReq) {
        setMode("linking");
      } else {
        triggerSuccessTransition(user);
      }
    } catch (err: any) {
      setErrorMsg(translateAuthError(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Password Reset Request
  const handlePasswordResetSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading || countdown > 0) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await triggerPasswordReset(email);
      setResetEmailSent(true);
      onAddToast("✉️ Reset instructions dispatched to your email address!");
      setCountdown(60);
    } catch (err: any) {
      setErrorMsg(translateAuthError(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  // Account linking creation flow handler (connecting Google/Apple accounts to fallback passwords)
  const handleAccountLinkingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const user = await linkAccountWithPassword(password);
      onAddToast("🔒 Local password bound! Protection established.");
      triggerSuccessTransition(user);
    } catch (err: any) {
      setErrorMsg(translateAuthError(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out helper
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await logOutUser();
      onAddToast("👋 Signed out of the authorization cycle.");
      setMode("signin");
    } catch (err) {
      onAddToast("Error during signout");
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans tracking-tight">
        <div className="space-y-4 text-center">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold font-mono uppercase tracking-wider">Accessing Vault Session...</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50">
        <div className="min-h-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
          {/* Success fading viewport mask overlay */}
        {isTransitioningOut && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center font-sans"
            style={{ transition: "opacity 1s cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-md border border-indigo-100">
                <UserCheck className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Identity Verified</h2>
              <p className="text-xs text-slate-400 font-mono uppercase font-bold tracking-widest">Entering App Dashboard...</p>
            </motion.div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[460px] bg-white border border-slate-205 rounded-3xl p-6 sm:p-8 shadow-xl text-left space-y-6 relative overflow-hidden"
          id="authentication-card"
        >
          {/* Visual abstract banner strip */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-550 via-blue-500 to-indigo-600" />

          {/* Back to Website Button */}
          {onBackToWebsite && (mode === "signin" || mode === "signup") && (
            <button 
              type="button" 
              onClick={onBackToWebsite}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Website</span>
            </button>
          )}

          {/* Core App Context & Logo */}
          <div className="flex flex-col items-center justify-center text-center space-y-2 pt-2">
            <img 
              src="https://past-aquamarine-opezzkg3.edgeone.app/logo%204%20(2).png" 
              alt="Upload-Post logo" 
              className="h-14 object-contain mx-auto"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Welcome to Upload-Post</h1>
              <p className="text-[10px] text-indigo-650 font-bold font-mono tracking-widest uppercase mt-0.5">Cross-Platform Video Distribution</p>
            </div>
          </div>

          {/* Tab Switch on Top of the Sign In / Sign Up form */}
          {(mode === "signin" || mode === "signup") && (
            <div className="bg-slate-100 p-1.5 rounded-2xl grid grid-cols-2 relative gap-1.5 border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setMode("signin");
                }}
                className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  mode === "signin"
                    ? "bg-white text-indigo-700 shadow-sm font-heavy"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setMode("signup");
                }}
                className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  mode === "signup"
                    ? "bg-white text-indigo-700 shadow-sm font-heavy"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Form error message block */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-150 p-3.5 rounded-xl flex gap-2.5 text-left text-rose-800 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="text-xs font-semibold leading-relaxed">
                {errorMsg}
              </div>
            </div>
          )}

          {/* MAIN MODAL NAVIGATION SWITCH */}
          {mode === "signin" && (
            <div className="space-y-5 animate-fade-in text-left">
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Welcome details</h2>
                <p className="text-xs text-slate-400 font-semibold mt-1">Provide your credentials to access the cross-posting suite.</p>
              </div>

              {/* Email Sign In Form */}
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.creators@domain.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Password</label>
                    <button 
                      type="button" 
                      onClick={() => setMode("forgot")}
                      className="text-[11px] font-extrabold text-indigo-600 hover:text-indigo-750 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all text-slate-800"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors uppercase tracking-wider inline-flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Log In to Account</span>
                  )}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Social Login Integrators */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="h-px bg-slate-200 flex-1" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Or authorize via</span>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button" 
                    onClick={() => handleSocialAuth("google")}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-3xs cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 mr-0.5" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.43 1.68 14.9 1 12 1 7.35 1 3.39 3.65 1.5 7.5l3.6 2.79C6.01 7.04 8.79 5.04 12 5.04z" />
                      <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.45c-.28 1.48-1.12 2.73-2.38 3.57l3.7 2.87c2.16-1.99 3.72-4.92 3.72-8.54z" />
                      <path fill="#FBBC05" d="M5.1 10.29c-.24-.71-.38-1.47-.38-2.29s.14-1.58.38-2.29L1.5 2.92C.54 4.84 0 6.99 0 9s.54 4.16 1.5 6.08l3.6-2.79z" />
                      <path fill="#34A853" d="M12 23c3.24 0 5.97-1.09 7.96-2.93l-3.7-2.87c-1.11.75-2.53 1.2-4.26 1.2-3.21 0-5.99-2-6.91-5.25l-3.6 2.79C3.39 20.35 7.35 23 12 23z" />
                    </svg>
                    <span>Google</span>
                  </button>

                  <button 
                    type="button" 
                    onClick={() => handleSocialAuth("apple")}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-3xs cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 fill-current mr-0.5" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.56 2.95-1.39" />
                    </svg>
                    <span>Apple</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-450 font-semibold text-center mt-2 leading-relaxed max-w-xs mx-auto">
                  By choosing to sign up or log in with Google or Apple, you agree and consent to our{" "}
                  <button type="button" onClick={() => setAuthModalView("terms")} className="text-indigo-605 hover:text-indigo-750 font-extrabold hover:underline cursor-pointer bg-transparent border-none p-0 inline">Terms of Service</button>
                  {" "}and{" "}
                  <button type="button" onClick={() => setAuthModalView("privacy")} className="text-indigo-605 hover:text-indigo-750 font-extrabold hover:underline cursor-pointer bg-transparent border-none p-0 inline">Privacy Policy</button>.
                </p>
              </div>

              {/* Registration Redirection */}
              <div className="border-t border-slate-100 pt-4 text-center">
                <p className="text-xs text-slate-500 font-semibold">
                  New creator on Upload-Post?{" "}
                  <button 
                    type="button" 
                    onClick={() => setMode("signup")}
                    className="font-extrabold text-indigo-600 hover:text-indigo-750 hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </p>
              </div>
            </div>
          )}

          {mode === "signup" && (
            <div className="space-y-5 animate-fade-in text-left">
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight font-sans">Establish Account</h2>
                <p className="text-xs text-slate-400 font-semibold mt-1">Configure your email address and secure direct credential password.</p>
              </div>

              {/* Sign Up Form */}
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alex Carter"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all text-slate-805"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.creators@domain.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all text-slate-805"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all text-slate-805"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all text-slate-805"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Dynamic checklist requirements block */}
                  <div className="text-[10px] space-y-1 font-semibold text-slate-500 bg-slate-50 border border-slate-150 p-2.5 rounded-xl text-left mt-2">
                    <span className="font-bold text-slate-705 block uppercase text-[8px] tracking-wider mb-0.5">Password Safeguards</span>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 6 ? "bg-emerald-500" : "bg-slate-300"}`} />
                      <span>At least 6 characters long</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${/\d/.test(password) ? "bg-emerald-500" : "bg-slate-300"}`} />
                      <span>Contains a numerical digit</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${password && password === confirmPassword ? "bg-emerald-500" : "bg-slate-300"}`} />
                      <span>Passwords match validation</span>
                    </div>
                  </div>
                </div>

                {/* Secure Terms & Privacy Agreement Checkbox */}
                <div className="flex items-start gap-2.5 mt-3 select-none">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4.5 h-4.5 accent-indigo-600 shrink-0"
                  />
                  <label htmlFor="agreeToTerms" className="text-[11px] text-slate-500 font-semibold leading-normal cursor-pointer">
                    I verify and agree to the{" "}
                    <button 
                      type="button" 
                      onClick={() => setAuthModalView("terms")}
                      className="text-indigo-600 hover:text-indigo-800 font-extrabold hover:underline"
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button 
                      type="button" 
                      onClick={() => setAuthModalView("privacy")}
                      className="text-indigo-600 hover:text-indigo-800 font-extrabold hover:underline"
                    >
                      Privacy Policy
                    </button>
                    .
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading || !agreeToTerms}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2 ${
                    !agreeToTerms
                      ? "bg-slate-100 text-slate-400 border border-slate-200/60 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95"
                  }`}
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Register Creator Vault</span>
                  )}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Social Login Integrators */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="h-px bg-slate-200 flex-1" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Or authorize via</span>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button" 
                    onClick={() => handleSocialAuth("google")}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-3xs cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 mr-0.5" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.43 1.68 14.9 1 12 1 7.35 1 3.39 3.65 1.5 7.5l3.6 2.79C6.01 7.04 8.79 5.04 12 5.04z" />
                      <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.45c-.28 1.48-1.12 2.73-2.38 3.57l3.7 2.87c2.16-1.99 3.72-4.92 3.72-8.54z" />
                      <path fill="#FBBC05" d="M5.1 10.29c-.24-.71-.38-1.47-.38-2.29s.14-1.58.38-2.29L1.5 2.92C.54 4.84 0 6.99 0 9s.54 4.16 1.5 6.08l3.6-2.79z" />
                      <path fill="#34A853" d="M12 23c3.24 0 5.97-1.09 7.96-2.93l-3.7-2.87c-1.11.75-2.53 1.2-4.26 1.2-3.21 0-5.99-2-6.91-5.25l-3.6 2.79C3.39 20.35 7.35 23 12 23z" />
                    </svg>
                    <span>Google</span>
                  </button>

                  <button 
                    type="button" 
                    onClick={() => handleSocialAuth("apple")}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-3xs cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 fill-current mr-0.5" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.56 2.95-1.39" />
                    </svg>
                    <span>Apple</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-450 font-semibold text-center mt-2 leading-relaxed max-w-xs mx-auto">
                  By choosing to sign up or log in with Google or Apple, you agree and consent to our{" "}
                  <button type="button" onClick={() => setAuthModalView("terms")} className="text-indigo-605 hover:text-indigo-750 font-extrabold hover:underline cursor-pointer bg-transparent border-none p-0 inline">Terms of Service</button>
                  {" "}and{" "}
                  <button type="button" onClick={() => setAuthModalView("privacy")} className="text-indigo-605 hover:text-indigo-750 font-extrabold hover:underline cursor-pointer bg-transparent border-none p-0 inline">Privacy Policy</button>.
                </p>
              </div>

              {/* Redirection to signin */}
              <div className="border-t border-slate-100 pt-4 text-center">
                <p className="text-xs text-slate-500 font-semibold">
                  Already have an account?{" "}
                  <button 
                    type="button" 
                    onClick={() => setMode("signin")}
                    className="font-extrabold text-indigo-600 hover:text-indigo-750 hover:underline cursor-pointer"
                  >
                    Log in here
                  </button>
                </p>
              </div>
            </div>
          )}

          {mode === "forgot" && (
            <div className="space-y-5 animate-fade-in text-left font-sans">
              <button 
                type="button" 
                onClick={() => { setMode("signin"); setResetEmailSent(false); }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Log In</span>
              </button>

              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Credentials Recovery</h2>
                <p className="text-xs text-slate-400 font-semibold mt-1">We will transmit secure password override guidelines directly to your inbox.</p>
              </div>

              {resetEmailSent ? (
                // Beautiful reset sent banner matching visual guides
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-3.5 text-left text-slate-900 shadow-3xs">
                  <div className="flex items-center gap-2.5 text-emerald-700">
                    <CheckCircle className="w-5 h-5 text-emerald-555 shrink-0" />
                    <span className="font-extrabold text-xs uppercase tracking-wider">Instructions Transmitted</span>
                  </div>
                  <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                    Check your inbox. A secure link has been sent to <strong className="text-slate-800">{email}</strong>. Use the link inside to set up a new password credentials block before attempting sign in.
                  </p>
                  
                  <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-xs">
                    <button 
                      type="button" 
                      onClick={() => handlePasswordResetSubmit()}
                      disabled={countdown > 0 || isLoading}
                      className="font-extrabold text-indigo-600 hover:text-indigo-750 hover:underline cursor-pointer disabled:opacity-50 disabled:no-underline"
                    >
                      {countdown > 0 ? `Resend Reset Link (${countdown}s)` : "Resend Reset Link"}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex.creators@domain.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-505 rounded-xl text-xs font-semibold focus:outline-none transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors uppercase tracking-wider inline-flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>Dispath Reset Link</span>
                    )}
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          )}

          {mode === "verify" && (
            <div className="space-y-5 animate-fade-in text-left">
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Verify Your Email</h2>
                <p className="text-xs text-slate-400 font-semibold mt-1">We require verified emails to activate your automated publishing access.</p>
              </div>

              {/* Beautiful illustrative card with paper airplane */}
              <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-2xl relative text-center space-y-4 overflow-hidden">
                <div className="w-12 h-12 bg-white text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-xs border border-indigo-100">
                  <Send className="w-5 h-5 animate-pulse" />
                </div>
                
                <div className="space-y-1 text-center">
                  <p className="text-xs font-semibold text-slate-700">
                    Verification Link Dispatched to:
                  </p>
                  <p className="text-xs font-black text-indigo-750">
                    {currentUser?.email || email}
                  </p>
                </div>

                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  Click the security check link in the email to instantly confirm your ownership and activate cross-posting dashboard blocks.
                </p>
              </div>

              <div className="space-y-3">
                <button 
                  type="button" 
                  onClick={checkEmailVerificationStatus}
                  disabled={isLoading}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors uppercase tracking-wider inline-flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>I've Verified My Email</span>
                  )}
                  <UserCheck className="w-4 h-4" />
                </button>

                <div className="flex justify-between items-center text-xs">
                  <button 
                    type="button" 
                    onClick={handleResendEmail}
                    disabled={countdown > 0 || isLoading}
                    className="font-extrabold text-indigo-600 hover:text-indigo-750 hover:underline cursor-pointer disabled:opacity-50 disabled:no-underline"
                  >
                    {countdown > 0 ? `Resend Link (${countdown}s)` : "Resend Link"}
                  </button>

                  <button 
                    type="button" 
                    onClick={handleSignOut}
                    disabled={isLoading}
                    className="font-bold text-slate-505 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Switch Account</span>
                  </button>
                </div>

                {/* Sandbox Dev/Demo Verification Bypass */}
                <div className="border-t border-slate-100 pt-4 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      onAddToast("⚠️ Sandbox Bypass: Bypassing email verification for demo...");
                      if (currentUser) {
                        try {
                          safeStorage.setItem(`omnicast_email_bypass_${currentUser.uid}`, "true");
                        } catch (e) {
                          console.error("Failed to store sandbox bypass flag:", e);
                        }
                        triggerSuccessTransition(currentUser);
                      }
                    }}
                    className="text-[10px] text-slate-400 hover:text-slate-600 font-extrabold font-mono tracking-wide uppercase hover:underline cursor-pointer bg-transparent border-none p-0 inline"
                  >
                    Bypass Email Verification (Sandbox Demo Mode)
                  </button>
                </div>
              </div>
            </div>
          )}

          {mode === "linking" && (
            <div className="space-y-5 animate-fade-in text-left">
              <div>
                <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold font-mono tracking-widest uppercase px-2 py-0.5 rounded">
                  Safety handshake REQUIRED
                </span>
                <h2 className="text-xl font-black text-slate-800 tracking-tight mt-2.5">Set App Password</h2>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  Bind fallback credentials to your Google/Apple secure ID to prevent dual-account fracturing.
                </p>
              </div>

              <div className="bg-amber-50/50 border border-amber-200/50 p-3.5 rounded-xl text-left text-[11px] text-amber-850 font-semibold leading-normal">
                👋 Since you joined via Google/Apple Social Auth, establishing a fallback password allows you to gain access directly via raw email/password in external CLI or terminal environments.
              </div>

              <form onSubmit={handleAccountLinkingSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Set Fallback Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all text-slate-800"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all text-slate-800"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors uppercase tracking-wider inline-flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>Establish Fallback & Save</span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button 
                    type="button" 
                    onClick={handleSignOut}
                    disabled={isLoading}
                    className="w-full py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-[11px] font-bold rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cancel and Sign Out</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </motion.div>

        {/* Footer containing Terms & Privacy links with direct trigger view */}
        <div className="mt-6 flex items-center justify-center space-x-3 text-[11px] text-slate-400 font-semibold select-none">
          <span className="font-black text-slate-600 tracking-wider">Upload-Post</span>
          <span>•</span>
          <button
            type="button"
            onClick={() => setAuthModalView("terms")}
            className="hover:text-indigo-600 transition-colors cursor-pointer font-bold hover:underline bg-transparent border-none p-0"
          >
            Terms of Service
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setAuthModalView("privacy")}
            className="hover:text-indigo-600 transition-colors cursor-pointer font-bold hover:underline bg-transparent border-none p-0"
          >
            Privacy Policy
          </button>
        </div>
      </div>

      {/* Floating Legal Screens overlay during signup process */}
      <AnimatePresence>
        {authModalView !== "none" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[4px] z-55 flex items-center justify-center p-4"
            onClick={() => setAuthModalView("none")}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200/60 p-6 max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
                <h3 className="font-extrabold text-slate-800 text-xs tracking-widest uppercase">
                  {authModalView === "terms" ? "Terms of Service" : "Privacy Policy"}
                </h3>
                <button
                  type="button"
                  onClick={() => setAuthModalView("none")}
                  className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* Scrollable text */}
              <div className="flex-1 overflow-y-auto py-4 text-xs text-slate-600 space-y-3 leading-relaxed pr-1 select-text">
                {authModalView === "terms" ? (
                  <>
                    <p className="font-bold text-slate-800">1. Acceptance of Terms</p>
                    <p>By creating an account on Upload-Post, you acknowledge you have read, grasped, and verified compliance with our services guidelines.</p>
                    <p className="font-bold text-slate-800">2. Platform Dispatch Compliance</p>
                    <p>Upload-Post acts as a cross-posting workflow hub. Users are solely responsible for compliance with specific platform policies (including YouTube Shorts, TikTok, Instagram, and Facebook terms of service). Any violation of third-party guidelines may lead to account de-authorization.</p>
                    <p className="font-bold text-slate-850">3. Fair & Proper Usage</p>
                    <p>All automated tasks must use authorized endpoint tokens. Spamming, bulk duplication of copyrighted assets, or routing of malware vectors is strictly forbidden and results in instant, permanent account ban.</p>
                    <p className="font-bold text-slate-800">4. Modifications & Services</p>
                    <p>We reserve absolute rights to optimize, adjust, or suspend features of Upload-Post to preserve system integrity or comply with social network adjustments.</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-slate-800">1. Information We Collect</p>
                    <p>We receive database entries with your email address securely persisted via Google Firebase Authentication. For dispatch functionalities, social profile tokens are cached safely inside secure local client-side memory blocks.</p>
                    <p className="font-bold text-slate-800">2. Asset Retention and Safety</p>
                    <p>Media files uploaded to Upload-Post (e.g. MP4 clips) are processed safely and routed securely to selected platform endpoints. We do not sell or lease any user assets to telemetry brokers or marketing organizations.</p>
                    <p className="font-bold text-slate-800">3. Cookie Configuration</p>
                    <p>We use essential local state records to keep authenticated creators connected without displaying repeated password verification modals.</p>
                    <p className="font-bold text-slate-800">4. Security Standards</p>
                    <p>Credentials, databases, and configuration settings are guarded by industry standard Firebase SSL handshakes.</p>
                  </>
                )}
              </div>

              {/* Footer CTA */}
              <div className="pt-3 border-t border-slate-100 shrink-0 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setAgreeToTerms(true);
                    setAuthModalView("none");
                  }}
                  className="px-5 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  I Agree & Accept
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  </AnimatePresence>
  );
}
