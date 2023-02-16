import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from 'firebaseConfig/firebase';
import { useAuth } from 'hooks/auth';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

export default function AuthStateChange({ children }) {
const router =useRouter()
    const [loading, setLoading] = useState(true)
    const auth = getAuth(app);
    const { setUser,user } = useAuth()

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                setUser(user)
                // console.log(user, 'outh chnage');
          // ...
            } 
        });

  
       
        setLoading(false)
        return () => (unsubscribe())

        
    }, [])



    return children
}
