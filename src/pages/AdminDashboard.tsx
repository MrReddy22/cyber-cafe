import { useState, useEffect, useRef } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { Plus, Trash2, Upload, AlertCircle, CheckCircle } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  downloadUrl: string;
  imageUrl: string;
  createdAt: any;
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { currentUser } = useAuth();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Network Security");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [projectFile, setProjectFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const projectsList: Project[] = [];
      querySnapshot.forEach((doc) => {
        projectsList.push({ id: doc.id, ...doc.data() } as Project);
      });
      setProjects(projectsList);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!projectFile) {
      setError("Please select a project file to upload");
      return;
    }
    
    try {
      setError("");
      setSuccess("");
      setUploading(true);
      
      // Upload project file to Firebase Storage
      const projectStorageRef = ref(storage, `projects/${Date.now()}_${projectFile.name}`);
      const projectUploadTask = uploadBytesResumable(projectStorageRef, projectFile);
      
      projectUploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          setError("Failed to upload project file");
          setUploading(false);
        },
        async () => {
          // Get download URL for project file
          const projectDownloadUrl = await getDownloadURL(projectUploadTask.snapshot.ref);
          
          let imageUrl = "";
          
          // Upload image file if provided
          if (imageFile) {
            const imageStorageRef = ref(storage, `images/${Date.now()}_${imageFile.name}`);
            const imageUploadTask = uploadBytesResumable(imageStorageRef, imageFile);
            
            await new Promise<void>((resolve, reject) => {
              imageUploadTask.on(
                "state_changed",
                () => {},
                (error) => {
                  console.error("Image upload error:", error);
                  reject(error);
                },
                async () => {
                  imageUrl = await getDownloadURL(imageUploadTask.snapshot.ref);
                  resolve();
                }
              );
            });
          }
          
          // Add project to Firestore
          await addDoc(collection(db, "projects"), {
            title,
            description,
            category,
            difficulty,
            downloadUrl: projectStorageRef.fullPath,
            imageUrl,
            createdAt: serverTimestamp(),
            author: currentUser?.displayName || "Admin",
            requirements: ["Node.js", "Basic programming knowledge"],
            fileSize: `${Math.round(projectFile.size / 1024)} KB`,
          });
          
          // Reset form
          setTitle("");
          setDescription("");
          setCategory("Network Security");
          setDifficulty("Beginner");
          setProjectFile(null);
          setImageFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
          if (imageInputRef.current) imageInputRef.current.value = "";
          
          setSuccess("Project uploaded successfully");
          fetchProjects();
          setUploading(false);
          setUploadProgress(0);
        }
      );
    } catch (error) {
      console.error("Error adding project:", error);
      setError("Failed to add project");
      setUploading(false);
    }
  }

  async function handleDeleteProject(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      await deleteDoc(doc(db, "projects", id));
      setProjects(projects.filter(project => project.id !== id));
      setSuccess("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      setError("Failed to delete project");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Upload Form */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-green-500/30">
              <h2 className="text-xl font-semibold text-white mb-6">Upload New Project</h2>
              
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
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                    Project Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 bg-gray-700 text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 bg-gray-700 text-white"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300">
                      Category
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 bg-gray-700 text-white"
                    >
                      <option value="Network Security">Network Security</option>
                      <option value="Web Security">Web Security</option>
                      <option value="Cryptography">Cryptography</option>
                      <option value="Malware Analysis">Malware Analysis</option>
                      <option value="Forensics">Forensics</option>
                      <option value="Cloud Security">Cloud Security</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300">
                      Difficulty
                    </label>
                    <select
                      id="difficulty"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 bg-gray-700 text-white"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="projectFile" className="block text-sm font-medium text-gray-300">
                    Project File (ZIP)
                  </label>
                  <div className="mt-1 flex items-center">
                    <label className="w-full flex items-center justify-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      {projectFile ? projectFile.name : "Select Project File"}
                      <input
                        type="file"
                        id="projectFile"
                        ref={fileInputRef}
                        onChange={(e) => setProjectFile(e.target.files?.[0] || null)}
                        accept=".zip,.rar,.7zip"
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="imageFile" className="block text-sm font-medium text-gray-300">
                    Project Image (Optional)
                  </label>
                  <div className="mt-1 flex items-center">
                    <label className="w-full flex items-center justify-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      {imageFile ? imageFile.name : "Select Image"}
                      <input
                        type="file"
                        id="imageFile"
                        ref={imageInputRef}
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        accept="image/*"
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
                
                {uploading && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Uploading: {Math.round(uploadProgress)}%</p>
                  </div>
                )}
                
                <div>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-green-400 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Upload Project
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Projects List */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-green-500/30">
              <h2 className="text-xl font-semibold text-white mb-6">Manage Projects</h2>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No projects found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Project
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Difficulty
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {projects.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-750">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img 
                                  className="h-10 w-10 rounded-md object-cover" 
                                  src={project.imageUrl || "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                                  alt="" 
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">{project.title}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {project.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {project.difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}