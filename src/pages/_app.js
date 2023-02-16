import "@/styles/globals.css";
import AuthProvider from "hooks/auth";
import AuthStateChange from "layout/AuthStateChanged";


export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
 <AuthStateChange>
      <Component {...pageProps} />
      </AuthStateChange>
    </AuthProvider>
  );
}
