import LoginComp from "components/LoginComp";
import { useRouter } from "next/router";
import React from "react";
import { useAuth } from "./auth";



export function withPublic(Component) {

    return function WithPublic(props) {
        const auth = useAuth();
        const router = useRouter();

        
        return <Component auth={auth} {...props} />;
    };
}




export function withProtected(Component) {

    return function WithProtected(props) {
        const auth = useAuth();
         const router = useRouter();

        if (!auth?.user && auth?.user?.displayName !='admin') {
            // if (process.browser){
            //     //Runs only on client side
            //     console.log('client');
            //     router?.replace("/");
            //     }

            return <LoginComp/>
           
        }
        return <Component auth={auth} {...props} />;
    };
}