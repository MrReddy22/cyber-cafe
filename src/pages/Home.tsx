import { Link } from "react-router-dom";
import { Shield, Lock, Code, Database, Server, Cpu } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-900 opacity-90"></div>
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Cybersecurity Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-green-400 font-mono">
              <span className="block">CyberCafe</span>
              <span className="block text-white text-2xl md:text-4xl mt-3">Free Cybersecurity Projects for BTech Students</span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl">
              Enhance your skills with hands-on cybersecurity projects. Build your portfolio and stay ahead in the ever-evolving world of cybersecurity.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/projects"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-black bg-green-400 hover:bg-green-500"
              >
                Browse Projects
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-green-400 text-base font-medium rounded-md text-green-400 bg-transparent hover:bg-gray-800"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-green-400 tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Everything you need to master cybersecurity
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
              Access a wide range of cybersecurity projects, tutorials, and resources to enhance your skills.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-800 rounded-lg p-6 border border-green-500/20 hover:border-green-500/50 transition-all">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-white">Network Security</h3>
                  <p className="mt-2 text-base text-gray-400">
                    Projects focused on securing networks, detecting intrusions, and preventing unauthorized access.
                  </p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-green-500/20 hover:border-green-500/50 transition-all">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                  <Lock className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-white">Cryptography</h3>
                  <p className="mt-2 text-base text-gray-400">
                    Learn about encryption, decryption, and secure communication protocols through hands-on projects.
                  </p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-green-500/20 hover:border-green-500/50 transition-all">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                  <Code className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-white">Secure Coding</h3>
                  <p className="mt-2 text-base text-gray-400">
                    Develop skills in writing secure code and identifying vulnerabilities in existing applications.
                  </p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-green-500/20 hover:border-green-500/50 transition-all">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                  <Database className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-white">Database Security</h3>
                  <p className="mt-2 text-base text-gray-400">
                    Projects on securing databases, preventing SQL injection, and ensuring data integrity.
                  </p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-green-500/20 hover:border-green-500/50 transition-all">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                  <Server className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-white">Cloud Security</h3>
                  <p className="mt-2 text-base text-gray-400">
                    Learn to secure cloud infrastructure and applications with practical projects.
                  </p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-green-500/20 hover:border-green-500/50 transition-all">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                  <Cpu className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-white">IoT Security</h3>
                  <p className="mt-2 text-base text-gray-400">
                    Explore security challenges in Internet of Things devices and develop solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block text-green-400">Start exploring projects today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-black bg-green-400 hover:bg-green-500"
              >
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/projects"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-400 bg-gray-900 hover:bg-gray-700"
              >
                Browse Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}