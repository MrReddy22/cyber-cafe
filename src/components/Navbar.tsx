import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Shield, Menu, X, LogOut, User, Terminal, Home } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }

  return (
    <nav className="bg-gray-900 text-green-400 border-b border-green-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Terminal className="h-8 w-8 mr-2" />
              <span className="font-mono text-xl font-bold">CyberCafe</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 hover:text-green-300 flex items-center">
                  <Home className="h-4 w-4 mr-1" />
                  Home
                </Link>
                <Link to="/projects" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 hover:text-green-300">
                  Projects
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 hover:text-green-300 flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    Admin
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {currentUser ? (
                <div className="flex items-center">
                  <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 hover:text-green-300 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="ml-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 hover:text-green-300 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 hover:text-green-300">
                    Login
                  </Link>
                  <Link to="/signup" className="ml-3 px-3 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-green-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-green-300">
              Home
            </Link>
            <Link to="/projects" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-green-300">
              Projects
            </Link>
            {isAdmin && (
              <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-green-300">
                Admin
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="px-2 space-y-1">
              {currentUser ? (
                <>
                  <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-green-300">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-green-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-green-300">
                    Login
                  </Link>
                  <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium bg-green-600 text-white hover:bg-green-700 mt-2">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}