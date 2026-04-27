'use client'; 
 
 import { useState } from 'react'; 
 import { motion, easeOut } from 'framer-motion'; 
 import { MoveRight } from 'lucide-react'; 
 import { useRouter } from 'next/navigation'; 
 import { auth, db } from '@/lib/firebase'; 
 import { 
   GoogleAuthProvider, 
   signInWithPopup, 
   signInWithEmailAndPassword, 
   createUserWithEmailAndPassword 
 } from 'firebase/auth'; 
 import { FirebaseError } from 'firebase/app'; 
 import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore'; 
 
 export default function LoginPage() { 
   const router = useRouter(); 
   const [email, setEmail] = useState(''); 
   const [password, setPassword] = useState(''); 
   const [error, setError] = useState(''); 
   const [isSignUp, setIsSignUp] = useState(false); 
   const [loading, setLoading] = useState(false); 
 
   const containerVariants = { 
     hidden: { opacity: 0 }, 
     visible: { 
       opacity: 1, 
       transition: { 
         duration: 0.8, 
         staggerChildren: 0.1, 
       }, 
     }, 
   }; 
 
   const itemVariants = { 
     hidden: { opacity: 0, y: 20 }, 
     visible: { 
       opacity: 1, 
       y: 0, 
       transition: { duration: 0.6, ease: easeOut }, 
     }, 
   }; 
 
   const buttonVariants = { 
     hover: { 
       scale: 1.02, 
       transition: { duration: 0.2 }, 
     }, 
     tap: { scale: 0.98 }, 
   }; 
 
   // Create or update user profile in Firestore 
   const createUserProfile = async (userId: string, userEmail: string, displayName?: string) => { 
     try { 
       const userRef = doc(db, 'users', userId); 
       const userDoc = await getDoc(userRef); 
 
       if (!userDoc.exists()) { 
         // Create new user document 
         await setDoc(userRef, { 
           email: userEmail, 
           displayName: displayName || 'anonymous', 
           photoURL: '', 
           notifications: true, 
           dailyReminders: true, 
           isPremium: false, 
           createdAt: Timestamp.now() 
         }); 
         console.log('✅ User profile created in Firestore'); 
       } else { 
         console.log('✅ User profile already exists'); 
       } 
     } catch (error) { 
       console.error('Error creating user profile:', error); 
       // Don't throw error - allow login to continue even if profile creation fails 
     } 
   }; 
 
   const handleEmailPasswordAuth = async () => { 
     if (loading) return; 
     
     setError(''); 
     
     if (!email || !password) { 
       setError('Please enter both email and password'); 
       return; 
     } 
 
     if (password.length < 6) { 
       setError('Password must be at least 6 characters'); 
       return; 
     } 
 
     setLoading(true); 
 
     try { 
       let userCredential; 
       
       if (isSignUp) { 
         userCredential = await createUserWithEmailAndPassword(auth, email, password); 
         // Create user profile in Firestore 
         await createUserProfile(userCredential.user.uid, email); 
       } else { 
         userCredential = await signInWithEmailAndPassword(auth, email, password); 
         // Ensure profile exists (for existing users) 
         await createUserProfile(userCredential.user.uid, email); 
       } 
       
       router.push('/dashboard'); 
     } catch (error) { 
       const firebaseError = error as FirebaseError; 
       if (firebaseError.code === 'auth/email-already-in-use') { 
         setError('Email already in use. Try logging in instead.'); 
       } else if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password') { 
         setError('Invalid email or password'); 
       } else if (firebaseError.code === 'auth/invalid-email') { 
         setError('Invalid email address'); 
       } else if (firebaseError.code === 'auth/invalid-credential') { 
         setError('Invalid email or password'); 
       } else { 
         setError('Authentication failed. Please try again.'); 
       } 
       console.error(error); 
     } finally { 
       setLoading(false); 
     } 
   }; 
 
   const handleGoogleSignIn = async () => { 
     if (loading) return; 
     
     setError(''); 
     setLoading(true); 
 
     try { 
      const provider = new GoogleAuthProvider(); 
      const result = await signInWithPopup(auth, provider); 
      
      // Create user profile with Google display name 
      await createUserProfile( 
        result.user.uid, 
        result.user.email || '', 
        result.user.displayName || undefined 
      ); 
      
      router.push('/dashboard'); 
    } catch (error) { 
      const firebaseError = error as FirebaseError;
      console.error('Google Sign-In Error:', firebaseError);

      if (firebaseError.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before finishing.');
      } else if (firebaseError.code === 'auth/operation-not-allowed') {
        setError('Google Sign-In is not enabled in Firebase Console.');
      } else if (firebaseError.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for Google Sign-In.');
      } else {
        setError(`Failed to sign in with Google: ${firebaseError.message}`);
      }
      setLoading(false); 
    } 
   }; 
 
   return ( 
     <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden"> 
       {/* --- Background Glows --- */}
       <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#B175FF]/10 blur-[120px] rounded-full" />
       <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-900/10 blur-[120px] rounded-full" />

       <motion.div 
         variants={containerVariants} 
         initial="hidden" 
         animate="visible" 
         className="w-full max-w-md space-y-12 relative z-10" 
       > 
         {/* --- Brand --- */}
         <motion.div variants={itemVariants} className="flex flex-col items-center space-y-6"> 
           <motion.div 
             whileHover={{ rotate: 180 }}
             transition={{ duration: 0.5 }}
             className="w-16 h-16 bg-[#B175FF] rounded-full flex items-center justify-center shadow-2xl shadow-[#B175FF]/40"
           >
             <div className="w-6 h-6 bg-white rounded-full" />
           </motion.div>
           <div className="text-center space-y-2">
             <h1 className="text-5xl font-light tracking-tighter text-white italic">soul.</h1> 
             <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em]">event planning redefined</p>
           </div>
         </motion.div> 
 
         {/* --- Form --- */}
         <motion.div variants={itemVariants} className="bg-zinc-900/40 backdrop-blur-2xl p-8 md:p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8"> 
           <div className="space-y-6"> 
             <div className="space-y-2"> 
               <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-4">Email Address</label> 
               <input 
                 type="email" 
                 value={email} 
                 onChange={(e) => setEmail(e.target.value)} 
                 className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#B175FF]/50 transition-all placeholder:text-zinc-700" 
                 placeholder="name@example.com" 
               /> 
             </div> 
             <div className="space-y-2"> 
               <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-4">Password</label> 
               <input 
                 type="password" 
                 value={password} 
                 onChange={(e) => setPassword(e.target.value)} 
                 className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#B175FF]/50 transition-all placeholder:text-zinc-700" 
                 placeholder="••••••••" 
               /> 
             </div> 
           </div> 
 
           {error && ( 
             <motion.p 
               initial={{ opacity: 0, y: -10 }} 
               animate={{ opacity: 1, y: 0 }} 
               className="text-red-400 text-[10px] font-bold uppercase tracking-wider text-center" 
             > 
               {error} 
             </motion.p> 
           )} 
 
           <div className="space-y-4"> 
             <motion.button 
               variants={buttonVariants} 
               whileHover="hover" 
               whileTap="tap" 
               onClick={handleEmailPasswordAuth} 
               disabled={loading} 
               className="w-full bg-white text-black py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50" 
             > 
               {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'} 
               <MoveRight className="w-4 h-4" /> 
             </motion.button> 
 
             <div className="relative py-4"> 
               <div className="absolute inset-0 flex items-center"> 
                 <div className="w-full border-t border-white/5"></div> 
               </div> 
               <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold"> 
                 <span className="bg-[#0c0c0c] px-4 text-zinc-600">Or continue with</span> 
               </div> 
             </div> 
 
             <motion.button 
               variants={buttonVariants} 
               whileHover="hover" 
               whileTap="tap" 
               onClick={handleGoogleSignIn} 
               className="w-full bg-zinc-900/50 border border-white/5 text-white py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-900 transition-all" 
             > 
               <svg className="w-4 h-4" viewBox="0 0 24 24"> 
                 <path 
                   fill="currentColor" 
                   d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
                 /> 
                 <path 
                   fill="currentColor" 
                   d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
                 /> 
                 <path 
                   fill="currentColor" 
                   d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" 
                 /> 
                 <path 
                   fill="currentColor" 
                   d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
                 /> 
               </svg> 
               Google 
             </motion.button> 
           </div> 
         </motion.div> 
 
         {/* --- Toggle --- */}
         <motion.p variants={itemVariants} className="text-center text-zinc-500 text-[10px] font-bold uppercase tracking-widest"> 
           {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '} 
           <button 
             onClick={() => setIsSignUp(!isSignUp)} 
             className="text-[#B175FF] hover:underline transition-all" 
           > 
             {isSignUp ? 'Sign In' : 'Create Account'} 
           </button> 
         </motion.p> 
       </motion.div> 
     </div> 
   ); 
 } 
