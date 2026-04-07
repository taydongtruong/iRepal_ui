import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import Navbar from '../components/Navbar';
import { Target, Plus, X, Trophy, Zap, ArrowUpRight, Wallet, CheckCircle2, Loader2 } from 'lucide-react';

const CampaignsPage = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState(0);
  const [displayAmount, setDisplayAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [activatingId, setActivatingId] = useState(null);

  // Định dạng tiền tệ VNĐ khi nhập liệu
  const formatVisualNumber = (val) => {
    if (!val) return "";
    const number = val.toString().replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue.length > 15) return;
    setTargetAmount(Number(rawValue));
    setDisplayAmount(formatVisualNumber(rawValue));
  };

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get('/campaigns/');
      setTimeout(() => {
        setCampaigns(res.data);
        setIsLoading(false);
      }, 600);
    } catch (err) { 
      console.error("Lỗi lấy danh sách:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCampaigns(); }, []);

  // HÀM TẠO CHIẾN DỊCH MỚI
  const handleCreate = async () => {
    if (!newTitle || !targetAmount) {
      alert("Vui lòng nhập đủ tên và số tiền mục tiêu!");
      return;
    }
    try {
      await axiosClient.post('/campaigns/', { 
        title: newTitle, 
        target_amount: targetAmount 
      });
      setShowModal(false);
      setNewTitle(''); 
      setTargetAmount(0); 
      setDisplayAmount('');
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      
      fetchCampaigns();
    } catch (err) { 
      console.error("Lỗi tạo chiến dịch:", err);
      alert("Không thể tạo chiến dịch, vui lòng thử lại.");
    }
  };

  // HÀM KÍCH HOẠT CHIẾN DỊCH (Dựa trên logic bạn cung cấp)
  const handleActivate = async (e, id) => {
    e.stopPropagation(); // Không cho nhảy vào dashboard
    
    if(!window.confirm("Kích hoạt mục tiêu này? Các mục tiêu khác sẽ tạm dừng để dồn toàn lực.")) return;
    
    setActivatingId(id);
    try {
      // Sử dụng PUT với endpoint /activate/
      await axiosClient.put(`/campaigns/${id}/activate/`);
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
      fetchCampaigns(); 
    } catch (err) {
      console.error("Lỗi kích hoạt:", err);
      alert("Lỗi kích hoạt: Hãy kiểm tra lại endpoint hoặc quyền truy cập.");
    } finally {
      setActivatingId(null);
    }
  };

  const getFontSize = (length) => {
    if (length > 12) return 'text-3xl md:text-4xl';
    if (length > 8) return 'text-4xl md:text-6xl';
    return 'text-5xl md:text-7xl';
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-zinc-950 pb-32 transition-colors duration-500 overflow-x-hidden">
      <Navbar />

      {/* TOAST THÔNG BÁO THÀNH CÔNG */}
      <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[200] transition-all duration-700 transform ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 border border-amber-500/30">
          <div className="bg-amber-500 p-1.5 rounded-full">
            <CheckCircle2 size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black uppercase tracking-widest">Thành công</span>
            <span className="text-[10px] font-bold opacity-60 uppercase tracking-tighter">Hệ thống đã cập nhật vận mệnh của bạn</span>
          </div>
        </div>
      </div>
      
      <main className="max-w-6xl mx-auto px-5 md:px-10 pt-10 md:pt-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="animate-in slide-in-from-left duration-700">
            <div className="flex items-center gap-2 text-amber-600 font-black text-[10px] tracking-[0.4em] uppercase mb-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              Strategic Command
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none">
              Kế hoạch Vàng<span className="text-amber-500">.</span>
            </h1>
          </div>
          
          <button 
            onClick={() => setShowModal(true)} 
            className="w-full md:w-auto bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-10 py-5 rounded-[2.2rem] font-black text-xs shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest animate-in fade-in zoom-in duration-1000"
          >
            <Plus size={18} strokeWidth={3} /> Tạo chiến dịch mới
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {isLoading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-[3rem] bg-zinc-100 dark:bg-zinc-900 animate-pulse relative overflow-hidden" />
            ))
          ) : campaigns.length === 0 ? (
            <div className="col-span-full py-32 text-center animate-in fade-in duration-1000">
              <Target size={64} className="mx-auto text-zinc-200 dark:text-zinc-800 mb-6" />
              <p className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-xs">Chưa có kế hoạch nào được khởi tạo</p>
            </div>
          ) : (
            campaigns.map((camp, index) => (
              <div 
                key={camp.id} 
                onClick={() => navigate(`/dashboard/${camp.id}`)}
                className={`group relative p-10 rounded-[3rem] border transition-all duration-700 cursor-pointer overflow-hidden animate-in fade-in slide-in-from-bottom-8 fill-mode-both`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 transition-opacity duration-700 ${camp.is_active ? 'bg-gradient-to-br from-white to-amber-50/50 dark:from-zinc-900 dark:to-zinc-900 opacity-100' : 'bg-white dark:bg-zinc-900 opacity-100'}`}></div>
                <div className={`absolute inset-0 border-2 transition-all duration-700 rounded-[3rem] ${camp.is_active ? 'border-amber-500/40 shadow-[0_30px_60px_-15px_rgba(245,158,11,0.25)]' : 'border-zinc-100 dark:border-zinc-800 group-hover:border-zinc-300'}`}></div>

                <div className="relative z-10 flex flex-col justify-between h-full min-h-[180px]">
                  <div className="flex justify-between items-start">
                    <div className={`p-4 rounded-[1.4rem] transition-all duration-500 ${camp.is_active ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40 rotate-6' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-400 group-hover:bg-zinc-100 group-hover:rotate-6'}`}>
                      <Trophy size={26} />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!camp.is_active ? (
                        <button 
                          onClick={(e) => handleActivate(e, camp.id)}
                          disabled={activatingId === camp.id}
                          className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-500/10 rounded-2xl transition-all font-black text-[9px] uppercase tracking-widest z-20"
                        >
                          {activatingId === camp.id ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                          Kích hoạt
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500/10 rounded-full border border-amber-500/20">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span>
                          <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Đang chạy 🚀</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-10">
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter mb-3 group-hover:text-amber-600 transition-colors duration-500 uppercase italic">
                      {camp.title}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white">
                        {camp.target_amount.toLocaleString()}
                      </span>
                      <span className="text-amber-500 font-black text-lg">₫</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-10 right-10 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                  <div className="w-10 h-10 bg-zinc-900 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-zinc-900 shadow-xl">
                    <ArrowUpRight size={20} strokeWidth={3} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* SUPREME MODAL - PHẦN TẠO MỚI ĐÃ QUAY TRỞ LẠI */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 bg-zinc-950/60 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-t-[3.5rem] md:rounded-[4.5rem] p-10 md:p-20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative border-t md:border border-white/10 overflow-hidden animate-in slide-in-from-bottom-20 duration-700">
            
            <button onClick={() => setShowModal(false)} className="absolute top-10 right-10 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all hover:rotate-90">
              <X size={28} />
            </button>

            <div className="space-y-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-[1.8rem] flex items-center justify-center text-white shadow-2xl shadow-amber-500/40 mx-auto mb-6 rotate-12">
                  <Wallet size={32} />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">Khởi tạo vận mệnh</h2>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.4em] mt-2">Dành cho những thượng đế của iRePal</p>
              </div>

              <div className="space-y-10">
                <div className="relative border-b-2 border-zinc-100 dark:border-zinc-800 focus-within:border-amber-500 transition-all duration-500">
                  <input 
                    className="w-full bg-transparent py-5 font-bold text-2xl outline-none text-zinc-900 dark:text-white placeholder:text-zinc-200 dark:placeholder:text-zinc-800 text-center uppercase tracking-tight" 
                    placeholder="Tên chiến dịch thịnh vượng" 
                    value={newTitle} 
                    onChange={e => setNewTitle(e.target.value)} 
                    autoFocus
                  />
                </div>

                <div className="relative py-14 px-8 bg-zinc-50 dark:bg-zinc-800/40 rounded-[3.5rem] shadow-inner flex flex-col items-center justify-center border border-zinc-100 dark:border-zinc-800">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-6">Giá trị đích đến (VNĐ)</label>
                  
                  <div className="flex items-center justify-center w-full">
                    <input 
                      className={`w-full bg-transparent font-black outline-none text-center transition-all duration-500 text-amber-600 tracking-[-0.05em] ${getFontSize(displayAmount.length)}`}
                      placeholder="0" 
                      type="text"
                      inputMode="numeric"
                      value={displayAmount} 
                      onChange={handleAmountChange} 
                    />
                    <span className="ml-2 text-3xl font-black text-amber-400 italic">₫</span>
                  </div>

                  {targetAmount > 0 && (
                     <div className="mt-8 px-6 py-2 bg-white dark:bg-zinc-900 rounded-2xl text-[11px] font-black text-amber-600 uppercase tracking-widest shadow-sm border border-amber-500/10 animate-pulse">
                        Sẵn sàng tích lũy {displayAmount} đồng
                     </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col-reverse md:flex-row gap-5">
                <button onClick={() => setShowModal(false)} className="flex-1 py-6 rounded-[2rem] font-black text-zinc-400 uppercase tracking-widest text-[11px] hover:bg-zinc-50 transition-all">Suy nghĩ lại</button>
                <button 
                  onClick={handleCreate} 
                  className="flex-[2] py-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[2.2rem] font-black shadow-2xl hover:shadow-amber-500/40 hover:-translate-y-1 active:scale-95 transition-all uppercase tracking-[0.2em] text-[11px]"
                >
                  Khai hỏa chiến dịch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default CampaignsPage;