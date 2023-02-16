import { createUserWithEmailAndPassword, FacebookAuthProvider, getAuth, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { app } from "firebaseConfig/firebase";
import { useRouter } from "next/router";
import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";



const authContext = createContext()


export const useAuth = () => {
  return useContext(authContext)
}

export default function AuthProvider({ children }) {

  const router = useRouter()

  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  const auth = getAuth(app);


  const signWithEmailandPW = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        setUser(user)
      

        router.push('/paper')
        // ...
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage)
        console.log(errorMessage);
        toast.error('wrong-password',{theme:'colored'})
      });

  }




  


  const logOut = () => {

    signOut(auth).then(() => {
      // Sign-out successful.
      setUser(null)
    }).catch(() => {
      // An error happened.
    });
  }



  return (
    <authContext.Provider value={{ user, error, signWithEmailandPW,setUser,logOut }}>{children}</authContext.Provider>
  )
}
