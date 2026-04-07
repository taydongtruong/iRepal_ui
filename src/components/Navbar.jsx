import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogOut, Home, History, Gem, Crown, Wallet, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout(); 
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* --- BÊN TRÁI: LOGO --- */}<Link to="/" className="flex items-center gap-3 group shrink-0 perspective-1000">
  <div className="relative">
    {/* Lớp nền phát sáng phía sau (Glow Effect) */}
    <div className="absolute -inset-1 bg-gradient-to-tr from-amber-600 to-yellow-300 rounded-2xl blur-md opacity-20 group-hover:opacity-60 transition-all duration-500"></div>
    
    {/* Khối Logo chính */}
    <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black dark:from-white dark:via-zinc-100 dark:to-zinc-300 rounded-[14px] flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.3)] group-hover:shadow-amber-500/20 group-hover:-translate-y-1 transition-all duration-500 border border-white/10 dark:border-zinc-800/50">
      
      {/* Icon Gem với hiệu ứng kim loại */}
      <Gem 
        size={24} 
        className="text-amber-500 dark:text-amber-600 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] group-hover:scale-110 transition-transform duration-500" 
        strokeWidth={2.5}
      />

      {/* Tia sáng chạy ngang qua Logo (Shimmer) */}
      <div className="absolute inset-0 w-full h-full rounded-[14px] overflow-hidden">
        <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] group-hover:animate-[shimmer_1.5s_infinite]"></div>
      </div>
    </div>
  </div>

  {/* Phần chữ iRePal đẳng cấp */}
  <div className="flex flex-col">
    <span className="text-xl md:text-2xl font-black tracking-[ -0.05em] leading-none bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-300 dark:to-white bg-[length:200%_auto] hover:animate-gradient text-transparent bg-clip-text uppercase">
      iRePal
    </span>
    <div className="flex items-center gap-1 mt-0.5">
      <div className="h-[1px] w-4 bg-amber-500/50"></div>
      <span className="text-[8px] font-bold tracking-[0.3em] text-amber-600 dark:text-amber-500 uppercase opacity-80">
        Royal Reserve
      </span>
    </div>
  </div>

  {/* Thêm CSS Keyframes vào file CSS toàn cục hoặc dùng thẻ <style> */}
  <style>{`
    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }
    @keyframes gradient {
      0% { bg-position: 0% center; }
      100% { bg-position: 200% center; }
    }
  `}</style>
</Link>

          {/* --- GIỮA: DESKTOP MENU --- */}
          {user && (
            <div className="hidden md:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <Link to="/history" className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-all ${isActive('/history') ? 'bg-white dark:bg-zinc-800 shadow-sm text-blue-600' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}`}>
                <History size={18} />
                Lịch sử
              </Link>
              {user.role === 'uncle' && (
                <Link to="/campaigns" className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-all ${isActive('/campaigns') ? 'bg-white dark:bg-zinc-800 shadow-sm text-amber-600' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}`}>
                  <Home size={18} />
                  Chiến dịch
                </Link>
              )}
            </div>
          )}

          {/* --- BÊN PHẢI: PROFILE & MOBILE TOGGLE --- */}
          <div className="flex items-center gap-2 md:gap-4">
            {user && (
              <>
                {/* Thông tin User (Ẩn bớt text trên Mobile) */}
                <div className="flex items-center gap-2 md:gap-3 p-1 md:p-1.5 md:pr-4 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-full md:rounded-2xl">
                  <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full md:rounded-xl flex items-center justify-center text-white text-xs font-black shadow-md
                    ${user.role === 'uncle' ? 'bg-amber-500' : 'bg-blue-600'}`}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col leading-tight">
                    <span className="text-[12px] font-black text-zinc-800 dark:text-zinc-100 truncate max-w-[80px]">{user.username}</span>
                    <span className={`text-[8px] font-bold uppercase tracking-tighter ${user.role === 'uncle' ? 'text-amber-600' : 'text-blue-600'}`}>
                      {user.role === 'uncle' ? 'Manager' : 'Contributor'}
                    </span>
                  </div>
                </div>

                {/* Nút thoát (Desktop) */}
                <button onClick={handleLogout} className="hidden md:flex p-3 text-zinc-400 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
                </button>

                {/* Nút Menu (Mobile) */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                >
                  {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- MOBILE DROPDOWN MENU --- */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 ${isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pt-2 pb-6 space-y-2">
          <Link 
            to="/history" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-4 p-4 rounded-2xl font-bold ${isActive('/history') ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
          >
            <History size={20} /> Lịch sử giao dịch
          </Link>
          
          {user?.role === 'uncle' && (
            <Link 
              to="/campaigns" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-4 p-4 rounded-2xl font-bold ${isActive('/campaigns') ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
            >
              <Home size={20} /> Quản lý chiến dịch
            </Link>
          )}

          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 w-full p-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
          >
            <LogOut size={20} /> Đăng xuất hệ thống
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;