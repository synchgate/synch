import { ShieldCheck } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import logo from "../../assets/logo-white.png";


function AuthLayout() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col md:flex-row">
      {/* Branding Sidebar (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-5/12 lg:w-[45%] bg-blue-600 relative overflow-hidden flex-col justify-between p-10 lg:p-14 text-white">
        {/* Dynamic Background */}
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full bg-blue-500 blur-[100px] opacity-70"></div>
        <div className="absolute bottom-[10%] right-[-20%] w-[60%] h-[60%] rounded-full bg-blue-700 blur-[80px] opacity-50"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] mix-blend-overlay"></div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <img src={logo} alt="SynchGate Logo" className="w-[150px]" />
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="font-['Outfit'] text-3xl lg:text-4xl font-bold mb-6 leading-tight">
            The unified API for global payments.
          </h2>
          <p className="text-blue-100 text-lg mb-8 font-light">
            Join thousands of engineering teams building reliable, smart-routed
            payment infrastructure.
          </p>

          <div className="flex items-center gap-3 text-blue-100 text-sm font-medium">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Bank-grade security & compliance</span>
          </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden p-6 border-b border-slate-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-['Outfit'] font-bold text-xl tracking-tight text-black">
              SynchGate
            </span>
          </Link>
        </header>

        {/* Dynamic Auth Content */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-y-auto">
          {/* Subtle corner light */}
          <div className="absolute top-0 right-0 p-32 bg-slate-50 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="w-full max-w-md relative z-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
