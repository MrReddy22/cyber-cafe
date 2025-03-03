import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { User, Mail, Key, AlertCircle, CheckCircle } from "lucide-react";

interface UserProfile {
  fullName: string;
  email: string;
  studentId: string;
  role: string;
  createdAt: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [editing, setEditing] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchProfile() {
      if (!currentUser) return;
      
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          setProfile(userData);
          setFullName(userData.fullName);
          setStudentId(userData.studentId);
        } else {
          setError("User profile not found");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [currentUser]);

  async function handleUpdateProfile() {
    if (!currentUser) return;
    
    try {
      setError("");
      setSuccess("");
      
      await updateDoc(doc(db, "users", currentUser.uid), {
        fullName,
        studentId
      });
      
      setProfile({
        ...profile!,
        fullName,
        studentId
      });
      
      setSuccess("Profile updated successfully");
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white">Your Profile</h1>
        
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-green-500/30">
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center">
                  <User className="h-12 w-12 text-green-400" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-white">{profile?.fullName}</h2>
                <p className="text-gray-400">{profile?.role}</p>
                <div className="mt-4 flex items-center text-gray-400">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{profile?.email}</span>
                </div>
                <div className="mt-2 flex items-center text-gray-400">
                  <Key className="h-4 w-4 mr-2" />
                  <span>Student ID: {profile?.studentId}</span>
                </div>
                <div className="mt-6 w-full">
                  <button
                    onClick={() => setEditing(!editing)}
                    className="w-full py-2 px-4 border border-green-500 rounded-md shadow-sm text-sm font-medium text-green-400 bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    {editing ? "Cancel Editing" : "Edit Profile"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Edit Profile / Activity */}
          <div className="md:col-span-2">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-green-500/30">
              {editing ? (
                <>
                  <h2 className="text-xl font-semibold text-white mb-6">Edit Profile</h2>
                  
                  {error && (
                    <div className="mb-4 bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded-md flex items-start">
                      <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  {success && (
                    <div className="mb-4 bg-green-900/30 border border-green-500 text-green-300 px-4 py-3 rounded-md flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{success}</span>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 bg-gray-700 text-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={profile?.email || ""}
                        disabled
                        className="mt-1 block w-full rounded-md border-gray-600 shadow-sm bg-gray-700 text-gray-400 cursor-not-allowed"
                      />
                      <p className="mt-1 text-sm text-gray-400">Email cannot be changed</p>
                    </div>
                    
                    <div>
                      <label htmlFor="studentId" className="block text-sm font-medium text-gray-300">
                        Student ID
                      </label>
                      <input
                        type="text"
                        id="studentId"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 bg-gray-700 text-white"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <button
                        onClick={handleUpdateProfile}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-green-400 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-700 rounded-lg p-4">
                      <p className="text-gray-300">You joined CyberCafe on {new Date(profile?.createdAt || "").toLocaleDateString()}</p>
                    </div>
                    
                    <div className="border border-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-white">Your Downloads</h3>
                      <p className="text-gray-400 mt-2">You haven't downloaded any projects yet.</p>
                      <div className="mt-4">
                        <Link
                          to="/projects"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-green-400 hover:bg-green-500"
                        >
                          Browse Projects
                        </Link>
                      </div>
                    </div>
                    
                    <div className="border border-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-white">Account Security</h3>
                      <p className="text-gray-400 mt-2">Protect your account with a strong password and regular security checks.</p>
                      <div className="mt-4">
                        <Link
                          to="/change-password"
                          className="inline-flex items-center px-4 py-2 border border-green-500 text-sm font-medium rounded-md shadow-sm text-green-400 bg-transparent hover:bg-gray-700"
                        >
                          Change Password
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}
             </div>
            </div>
          </div>
        </div>
      </div>
    
  );
}