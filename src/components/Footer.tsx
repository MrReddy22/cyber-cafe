import { Link } from "react-router-dom";
import { Terminal, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-green-400 border-t border-green-500/30">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <Terminal className="h-8 w-8 mr-2" />
              <span className="font-mono text-xl font-bold">CyberCafe</span>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Providing free cybersecurity projects to BTech students. Enhance your skills, build your portfolio, and stay ahead in the cybersecurity domain.
            </p>
            <div className="mt-6 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-green-400">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/projects" className="text-gray-400 hover:text-green-400">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="text-gray-400 hover:text-green-400">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-green-400">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-green-400">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-green-400">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} CyberCafe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}