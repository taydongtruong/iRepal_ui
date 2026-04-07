import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { 
  History, 
  Calendar, 
  CheckCircle2, 
  Clock3, 
  ZoomIn, 
  XCircle,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

const HistoryPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');

  // 5 Quy luật của Vàng từ cha Nomashir
  const goldLaws = [
    "Vàng sẽ đến với ai dành ra ít nhất 1/10 thu nhập.",
    "Vàng làm việc siêng năng cho chủ nhân biết đầu tư nó khôn ngoan.",
    "Vàng bám trụ với những người cẩn trọng và theo lời khuyên của người khôn ngoan.",
    "Vàng tuột khỏi tay những người đầu tư vào những thứ họ không hiểu rõ.",
    "Vàng trốn chạy khỏi những ai ép nó mang lại lợi nhuận quá cao."
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = user?.role === 'uncle' ? '/admin/payments' : '/payments/me';
      const params = id ? { campaign_id: id } : {};
      const res = await axiosClient.get(endpoint, { params });
      setHistory(res.data);
    } catch (err) {
      console.error("Lỗi tải lịch sử:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, id]);

  const filteredData = history.filter(item => {
    if (filter === 'approved') return item.status === true;
    if (filter === 'pending') return item.status === false;
    return true;
  });

  const formatDate = (dateString) => {
    const d = new Date(dateString.replace(' ', 'T') + 'Z');
    return d.toLocaleString('vi-VN', { 
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-zinc-950 pb-20 transition-colors duration-500">
      <Navbar />

      {/* MODAL XEM ẢNH PROOF (Glassmorphism) */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-zinc-900/40 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl w-full flex flex-col items-center">
            <button className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors flex items-center gap-2 font-bold text-sm">
              <XCircle size={24} /> ĐÓNG
            </button>
            <img src={selectedImage} alt="Proof" className="max-w-full max-h-[80vh] rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-white/20 object-contain" />
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-6 pt-10">
        
        {/* NÚT QUAY LẠI & HEADER */}
        <div className="mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all mb-6 font-bold text-sm"
          >
            <div className="p-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 group-hover:-translate-x-1 transition-transform">
              <ArrowLeft size={16} />
            </div>
            QUAY LẠI
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-blue-600/10 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">iRePal Ledger</span>
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{filteredData.length} Giao dịch</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">
                Lịch sử <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 text-6xl">.</span>
              </h1>
            </div>

            {/* BỘ LỌC NÂNG CẤP */}
            <div className="flex bg-zinc-200/50 dark:bg-zinc-900/50 backdrop-blur-md p-1.5 rounded-2xl border border-white dark:border-zinc-800 shadow-inner">
              {['all', 'pending', 'approved'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-xl text-xs font-black transition-all duration-300 uppercase tracking-tighter
                    ${filter === f 
                      ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xl scale-105' 
                      : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  {f === 'all' ? 'Tất cả' : f === 'pending' ? 'Chờ duyệt' : 'Đã xong'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DANH SÁCH GIAO DỊCH (HỆ THỐNG THẺ MỚI) */}
        <div className="space-y-5">
          {loading ? (
            <div className="flex flex-col items-center py-24 gap-4">
              <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-zinc-400 font-bold text-sm tracking-widest uppercase">Đang đồng bộ dữ liệu...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-32 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <History size={48} className="mx-auto text-zinc-200 mb-4" />
              <p className="text-zinc-400 font-bold italic">Chưa có dữ liệu giao dịch trong mục này.</p>
            </div>
          ) : (
            filteredData.map((item) => (
              <div 
                key={item.id} 
                className="group relative bg-white dark:bg-zinc-900 p-5 md:p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 flex items-center gap-6 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 overflow-hidden"
              >
                {/* Dải màu trạng thái bên cạnh */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.status ? 'bg-green-500' : 'bg-orange-400'}`}></div>

                {/* Proof Image với hiệu ứng Hover xịn */}
                <div 
                  className="relative w-20 h-20 shrink-0 rounded-[1.5rem] overflow-hidden bg-zinc-100 shadow-inner cursor-pointer"
                  onClick={() => setSelectedImage(item.proof_image_url)}
                >
                  <img src={item.proof_image_url} alt="Proof" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-zinc-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                    <ZoomIn size={20} className="text-white scale-50 group-hover:scale-100 transition-transform" />
                  </div>
                </div>

                {/* Thông tin Giao dịch */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">
                          {item.amount.toLocaleString()}<span className="text-sm ml-0.5">₫</span>
                        </span>
                        {item.status && <ShieldCheck size={16} className="text-green-500" />}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4">
                        <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                          <Calendar size={12} className="text-zinc-300" /> {formatDate(item.created_at)}
                        </span>
                        {user?.role === 'uncle' && (
                          <span className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                            User: {item.owner?.username}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                       <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-colors
                        ${item.status 
                          ? 'bg-green-50 text-green-600 dark:bg-green-500/10' 
                          : 'bg-orange-50 text-orange-600 dark:bg-orange-500/10'}`}>
                        {item.status ? <CheckCircle2 size={14}/> : <Clock3 size={14} className="animate-spin-slow"/>}
                        {item.status ? 'Hoàn tất' : 'Đang duyệt'}
                      </div>
                      <ChevronRight size={18} className="text-zinc-200 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* KHU VỰC TRÍ TUỆ TÀI CHÍNH (QUY LUẬT VÀNG) */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                <TrendingUp className="absolute -right-4 -top-4 w-32 h-32 opacity-10" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-60">Quy luật tài chính</h3>
                <p className="text-lg font-bold leading-relaxed italic relative z-10">
                  "{goldLaws[Math.floor(Math.random() * goldLaws.length)]}"
                </p>
                <div className="mt-6 flex items-center gap-2">
                  <div className="w-8 h-[2px] bg-blue-500"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Cha Nomashir khuyên bảo</span>
                </div>
            </div>

            <div className="p-8 bg-blue-600 rounded-[3rem] text-white flex flex-col justify-center shadow-2xl shadow-blue-500/20">
                <h3 className="text-2xl font-black tracking-tighter mb-2 italic text-blue-100 italic">"Vàng sẽ bám trụ với người khôn ngoan."</h3>
                <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">Tiết kiệm là bước đầu của sự tự do.</p>
            </div>
        </div>

      </main>

      {/* CSS cho hiệu ứng xoay chậm icon chờ */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HistoryPage;