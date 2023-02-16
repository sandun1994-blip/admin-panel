import React, { useState } from "react";;
import Link from "next/link";

const Nav = ({ user, logOut }) => {
  let Links = [
    { name: "Add Paper", link: "/paper" },
    { name: "Update Paper", link: "/update/update" },
    { name: "Add Menu Item ", link: "/menuItem" },
    { name: "Update Menu", link: "/menuitem/menuupdate" },
  ];

  let [open, setOpen] = useState(false);
  return (
    <div className="shadow-md w-full fixed top-0 left-0">
      <div className="md:flex items-center justify-between bg-white py-4 md:px-10 px-7 dark:bg-gray-900">
        <div
          className="font-bold text-2xl cursor-pointer flex items-center font-[Poppins] 
      text-gray-800 dark:text-gray-100"
        >
          
          <Link href="/">Grade 5</Link>
        </div>

        <ul
          className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 transition-all duration-500 ease-in  ${
            open ? "top-20 " : "top-[-490px]"
          }`}
        >
          {Links.map((link) => (
            <li key={link.name} className="md:ml-8 text-xl md:my-0 my-7 pl-9">
              <Link
                href={link.link}
                className="text-gray-800 hover:text-indigo-600 duration-500 dark:text-gray-100"
              >
                {link.name}
              </Link>
            </li>
          ))}
         
         
        </ul>


        <div className="btns-container flex justify-around">
           {user?.displayName}
              <button
                className="bg-indigo-600 text-white font-[Poppins] py-2 px-6 rounded md:ml-8 hover:bg-indigo-400 
    duration-500"
                onClick={logOut}
              >
                Logout
              </button>
          
          </div>
      </div>
    </div>
  );
};

export default Nav;
