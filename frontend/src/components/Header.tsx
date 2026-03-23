import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/appContext";
import SignOutButton from "./SignOutButton";

const Header = () => {
  const { isLoggedIn } = useAppContext();
  return (
    <div className="bg-gray-800 py-6">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">MernHolidays.com</Link>
        </span>
        <span className="flex space-x-2">
          {isLoggedIn ? (
            <>
              <Link
                className="flex items-center  text-white px-3 font-bold hover:bg-gray-600 hover:rounded-lg"
                to="/my-bookings"
              >
                My Bookings
              </Link>
              <Link
                className="flex items-center  text-white px-3 font-bold hover:bg-gray-600 hover:rounded-lg"
                to="/my-hotels"
              >
                My Hotels
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to={"/sign-in"}
              className="flex bg-white rounded-xl items-center text-gray-600 px-3 font-bold hover:bg-gray-100 ml-3"
            >
              Sign In
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;
