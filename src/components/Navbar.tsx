import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Code2, Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = location.pathname === "/";

  const navLinks = [
    { name: "Contact Us", path: "/contact-us" },
    { name: "Pricing", path: "/pricing" },
    ...(isHomePage
      ? [{ name: "How it works", path: "/#how-it-works", isAnchor: true }]
      : []),
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md border-b border-slate-200 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <img src={logo} alt="SynchGate Logo" className="w-[150px]" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors cursor-pointer ${
                  location.pathname === link.path
                    ? "text-blue-600 font-bold"
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Code2 className="w-4 h-4" /> Docs
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/auth/login"
              className="hidden sm:block text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Log in
            </Link>
            <Link
              to="/auth/signup"
              className="relative hidden md:inline-flex group h-9 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white shadow transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-1">
                Get started{" "}
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <button
              className="md:hidden p-1 opacity-70 hover:opacity-100 transition-opacity"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-100 bg-white flex flex-col pt-6 pb-8 px-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-12">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <img src={logo} alt="SynchGate Logo" className="w-[150px]" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-6 items-center flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-2xl font-bold transition-colors ${
                  location.pathname === link.path
                    ? "text-blue-600"
                    : "text-slate-900 hover:text-blue-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/docs"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-slate-900 hover:text-blue-600 transition-colors inline-flex items-center gap-2"
            >
              <Code2 className="w-6 h-6" /> Docs
            </Link>

            <hr className="w-full max-w-[250px] border-slate-200 my-4" />

            <Link
              to="/auth/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/auth/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full max-w-[250px] text-center bg-black text-white py-4 rounded-lg font-medium hover:bg-slate-800 transition-colors mt-2 text-lg"
            >
              Get started
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
