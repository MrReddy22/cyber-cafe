import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center px-4">
      <ShieldAlert className="h-24 w-24 text-red-500 mb-6" />
      <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
      <p className="text-xl text-gray-400 text-center max-w-md mb-8">
        You don't have permission to access this page. This area is restricted to administrators only.
      </p>
      <Link to="/" className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-black bg-green-400 hover:bg-green-500">
        <ArrowLeft className="h-5 w-5 mr-2" />
        Return to Home
      </Link>
    </div>
  );
}