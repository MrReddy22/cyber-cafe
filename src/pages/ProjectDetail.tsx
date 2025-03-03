import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { Download, Calendar, User, Tag, Shield, ArrowLeft } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  downloadUrl: string;
  imageUrl: string;
  createdAt: any;
  author: string;
  requirements: string[];
  fileSize: string;
}

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloading, setDownloading] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchProject() {
      try {
        if (!projectId) return;
        
        const projectDoc = await getDoc(doc(db, "projects", projectId));
        
        if (projectDoc.exists()) {
          setProject({ id: projectDoc.id, ...projectDoc.data() } as Project);
        } else {
          setError("Project not found");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [projectId]);

  const handleDownload = async () => {
    if (!project || !currentUser) return;
    
    try {
      setDownloading(true);
      // Get the download URL from Firebase Storage
      const fileRef = ref(storage, project.downloadUrl);
      const url = await getDownloadURL(fileRef);
      setDownloadUrl(url);
      
      // Create a temporary link and click it to start the download
      const a = document.createElement('a');
      a.href = url;
      a.download = project.title.replace(/\s+/g, '_').toLowerCase() + '.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading project:", error);
      setError("Failed to download project");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{error || "Project not found"}</h2>
          <Link to="/projects" className="text-green-400 hover:text-green-300 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/projects" className="text-green-400 hover:text-green-300 flex items-center mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Link>
        
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl border border-green-500/30">
          <div className="h-64 sm:h-80 overflow-hidden">
            <img 
              src={project.imageUrl || "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Tag className="h-3 w-3 mr-1" />
                {project.category}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Shield className="h-3 w-3 mr-1" />
                {project.difficulty}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(project.createdAt?.toDate()).toLocaleDateString()}
              </span>
              {project.author && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <User className="h-3 w-3 mr-1" />
                  {project.author}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-white">{project.title}</h1>
            
            <div className="mt-6 prose prose-invert max-w-none">
              <p className="text-gray-300">{project.description}</p>
              
              {project.requirements && project.requirements.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-white">Requirements</h3>
                  <ul className="mt-2 list-disc pl-5 text-gray-300">
                    {project.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {project.fileSize && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-white">File Information</h3>
                  <p className="text-gray-300">Size: {project.fileSize}</p>
                </div>
              )}
            </div>
            
            <div className="mt-8">
              {currentUser ? (
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-black bg-green-400 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {downloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5 mr-2" />
                      Download Project
                    </>
                  )}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Login to Download
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}