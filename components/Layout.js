// import { useAuth } from "hooks/auth";
import { useAuth } from "hooks/auth";
import Head from "next/head";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Footer";
import Nav from "./Nav";

export default function Layout({ title, children }) {
   const { user, logOut } = useAuth();

  return (
    <>
      <Head>
        <title>{title ? title : "Exam"}</title>
        <meta name="description" content="Exam" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer position="bottom-center" limit={1} />
      <Nav user={user} logOut={logOut} />
      <div className="flex flex-col justify-between dark:bg-gray-800">
        <main className="mt-12 pb-4  flex justify-center ">{children}</main>
        <Footer />
      </div>
    </>
  );
}
