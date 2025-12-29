
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Truck, 
  Leaf, 
  RefreshCw, 
  ChevronRight, 
  Check,
  Instagram,
  Facebook,
  Mail,
  ArrowRight,
  Menu,
  X,
  Recycle,
  Droplets,
  MessageCircle,
  Send,
  Loader2,
  Sparkles,
  User,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Globe,
  Award,
  Zap,
  ChevronDown,
  Search,
  ShoppingCart,
  Minus,
  Plus,
  CreditCard,
  Heart,
  Calendar,
  Clock,
  Settings,
  Package,
  Info,
  ShieldCheck
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
type Page = 'home' | 'about' | 'origins' | 'faq' | 'delivery' | 'shop';

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ActivePlan {
  title: string;
  limit: number;
  price: string;
  features: string[];
}

// --- Product Data ---
const PRODUCTS: Product[] = [
  { id: 1, name: "有機大燕麥片", price: 240, unit: "500g", image: "https://i.postimg.cc/RVCdPMXC/6130200410P1.webp?auto=format&fit=crop&q=80&w=800", category: "穀物" },
  { id: 2, name: "冷壓初榨橄欖油", price: 580, unit: "500ml", image: "https://i.postimg.cc/zB0b31Wd/leng-ya-chu-zha-yi-da-li-gan-lan-you-yuan-ping2025xin-bao-zhuang02sq.jpg?auto=format&fit=crop&q=80&w=800", category: "油品" },
  { id: 3, name: "精品日曬咖啡豆", price: 450, unit: "250g", image: "https://i.postimg.cc/rwXmVp3D/b5e7d988cfdb78bc3be1a9c221a8f744.jpg?auto=format&fit=crop&q=80&w=800", category: "飲品" },
  { id: 4, name: "澳洲天然海鹽", price: 180, unit: "300g", image: "https://i.postimg.cc/SKZYxhc5/p-o-1emt173fil2l1cp1ous14af17c7.jpg?auto=format&fit=crop&q=80&w=800", category: "香料" },
  { id: 5, name: "有機奇亞籽", price: 320, unit: "200g", image: "https://i.postimg.cc/L85pMF6R/cd2406f14afec31ff6d81f8af1c54bdd.webp?auto=format&fit=crop&q=80&w=800", category: "種籽" },
  { id: 6, name: "公平貿易混合堅果", price: 380, unit: "250g", image: "https://i.postimg.cc/Pr6gyVzp/800x.jpg?auto=format&fit=crop&q=80&w=800", category: "堅果" },
  { id: 7, name: "紅黎麥", price: 290, unit: "300g", image: "https://images.unsplash.com/photo-1586201327102-335a2851ee8a?auto=format&fit=crop&q=80&w=800", category: "穀物" },
  { id: 8, name: "頂級黑松露鹽", price: 650, unit: "100g", image: "https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&q=80&w=800", category: "香料" },
  { id: 9, name: "大吉嶺二春紅茶", price: 420, unit: "100g", image: "https://images.unsplash.com/photo-1544787210-2213d84ad960?auto=format&fit=crop&q=80&w=800", category: "飲品" },
  { id: 10, name: "小農無糖芒果乾", price: 350, unit: "200g", image: "https://images.unsplash.com/photo-1596560548464-f01068e3c7eb?auto=format&fit=crop&q=80&w=800", category: "果乾" },
  { id: 11, name: "紅扁豆", price: 160, unit: "500g", image: "https://images.unsplash.com/photo-1515942400420-2b98fed1f515?auto=format&fit=crop&q=80&w=800", category: "穀物" },
  { id: 12, name: "喜馬拉雅玫瑰鹽", price: 220, unit: "400g", image: "https://images.unsplash.com/photo-1518933165971-611bd9ad42e0?auto=format&fit=crop&q=80&w=800", category: "香料" },
];

// --- Shared Components ---

/**
 * 方案預覽窗：在進入商店前的緩衝層
 */
const PlanPreviewModal: React.FC<{ 
  plan: ActivePlan | null; 
  onClose: () => void; 
  onConfirm: () => void 
}> = ({ plan, onClose, onConfirm }) => {
  if (!plan) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-earth/60 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-slideUp">
        <div className="p-10 sm:p-14">
          <button onClick={onClose} className="absolute top-10 right-10 text-earth/30 hover:text-earth transition-colors"><X size={28} /></button>
          <div className="mb-10 text-center">
            <div className="w-20 h-20 bg-sage/10 text-sage rounded-3xl flex items-center justify-center mx-auto mb-6"><Package size={40} /></div>
            <h2 className="text-3xl font-bold text-earth mb-2">確認您的 {plan.title}</h2>
            <p className="text-earth/50 font-medium">這是邁向永續生活的第一步</p>
          </div>
          
          <div className="bg-stone-50 rounded-[2rem] p-8 mb-10 space-y-6">
            <div className="flex justify-between items-center border-b border-stone-200 pb-4">
              <span className="text-earth/60 font-bold uppercase tracking-widest text-xs">單趟預算</span>
              <span className="text-2xl font-bold text-earth">NT$ {plan.price}</span>
            </div>
            <div className="flex justify-between items-center border-b border-stone-200 pb-4">
              <span className="text-earth/60 font-bold uppercase tracking-widest text-xs">品項上限</span>
              <span className="text-xl font-bold text-sage">任選 {plan.limit} 款</span>
            </div>
            <div className="space-y-3">
              <span className="text-earth/60 font-bold uppercase tracking-widest text-[10px] block mb-2">包含權益</span>
              {plan.features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-earth/80">
                  <ShieldCheck size={16} className="text-sage" /> {f}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={onConfirm}
              className="w-full py-5 bg-sage text-white rounded-2xl font-bold text-lg hover:bg-earth transition-all shadow-xl flex items-center justify-center gap-3 group active:scale-95"
            >
              開始挑選食材 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-center text-xs text-earth/40 font-bold flex items-center justify-center gap-2">
              <Info size={12} /> 您可以在下單前隨時更換方案
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-earth/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] earth-shadow overflow-hidden animate-slideUp">
        <div className="p-8 sm:p-12">
          <button onClick={onClose} className="absolute top-6 right-6 text-earth/30 hover:text-earth transition-colors"><X size={24} /></button>
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-sage/10 text-sage rounded-2xl flex items-center justify-center mx-auto mb-6"><Leaf size={32} /></div>
            <h2 className="text-3xl font-bold text-earth mb-2">{isLogin ? '歡迎回來' : '加入我們'}</h2>
            <p className="text-earth/60">{isLogin ? '讓永續廚房管理變得更簡單' : '開啟您的零浪費生活體驗'}</p>
          </div>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-earth/70 ml-1">電子信箱</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center text-earth/30"><Mail size={18} /></div>
                <input type="email" placeholder="name@example.com" className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-earth/70 ml-1">密碼</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center text-earth/30"><Lock size={18} /></div>
                <input type={showPassword ? "text" : "password"} placeholder="請輸入密碼" className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 flex items-center text-earth/30 hover:text-earth transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button className="w-full py-5 bg-sage text-white rounded-2xl font-bold text-lg hover:bg-earth transition-all shadow-xl active:scale-95">{isLogin ? '登入帳號' : '建立新帳號'}</button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-earth/60 font-medium">{isLogin ? '還沒有帳號嗎？' : '已經是會員了？'}
              <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-sage font-bold hover:underline underline-offset-4">{isLogin ? '立即註冊' : '立即登入'}</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  quantities: Record<number, number>;
  activePlan: ActivePlan | null;
}> = ({ isOpen, onClose, quantities, activePlan }) => {
  if (!isOpen) return null;

  const cartItems = PRODUCTS.filter(p => quantities[p.id] > 0);
  const total = activePlan ? parseInt(activePlan.price.replace(',', '')) : cartItems.reduce((acc, p) => acc + (p.price * quantities[p.id]), 0);
  const totalPlasticSaved = (cartItems.reduce((acc, p) => acc + quantities[p.id], 0) * 0.05).toFixed(2);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-earth/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-slideUp">
        <div className="p-8 md:p-12 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <button onClick={onClose} className="absolute top-8 right-8 text-earth/30 hover:text-earth transition-colors z-10"><X size={28} /></button>
          
          <div className="mb-8 flex items-center gap-4">
            <div className="w-14 h-14 bg-sage/10 text-sage rounded-2xl flex items-center justify-center">
              {activePlan ? <Package size={28} /> : <ShoppingCart size={28} />}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-earth">{activePlan ? `配置 ${activePlan.title}` : '結算我的寶盒'}</h2>
              <p className="text-earth/50 font-medium">{activePlan ? '這是為您精心配置的方案內容。' : '請確認您的訂單內容與回收偏好。'}</p>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl" />
                  <div>
                    <h4 className="font-bold text-earth text-sm">{item.name}</h4>
                    <p className="text-[10px] text-earth/40 font-bold uppercase">{item.unit} x {quantities[item.id]}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-earth">{activePlan ? '方案包含' : `NT$ ${item.price * quantities[item.id]}`}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-8 p-6 bg-oatmeal/30 rounded-[2rem] border border-oatmeal space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2"><RefreshCw size={16} className="text-sage" /> 循環偏好設定</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 bg-white rounded-xl border border-stone-100 cursor-pointer hover:border-sage transition-all">
                <input type="radio" name="refill" defaultChecked className="accent-sage" />
                <span className="text-xs font-bold text-earth/70">下次配送同步回收</span>
              </label>
              <label className="flex items-center gap-3 p-4 bg-white rounded-xl border border-stone-100 cursor-pointer hover:border-sage transition-all">
                <input type="radio" name="refill" className="accent-sage" />
                <span className="text-xs font-bold text-earth/70">專人預約單獨回收</span>
              </label>
            </div>
          </div>

          <div className="bg-sage/5 rounded-[2rem] p-8 mb-8 border border-sage/10">
            <div className="flex justify-between items-center mb-6 pt-4">
              <span className="text-earth font-bold">{activePlan ? '方案總計' : '預估總計'}</span>
              <span className="text-3xl font-bold text-sage">NT$ {total}</span>
            </div>
            <div className="flex items-start gap-3 text-sage bg-white p-4 rounded-xl shadow-sm">
              <Heart size={18} className="shrink-0 mt-0.5" />
              <p className="text-xs font-bold leading-relaxed">感謝您的參與，本次購物將減少約 {totalPlasticSaved} kg 的一次性塑膠產生！</p>
            </div>
          </div>

          <button className="w-full py-5 bg-earth text-white rounded-2xl font-bold text-lg hover:bg-sage transition-all shadow-xl flex items-center justify-center gap-3 group active:scale-95">
            <CreditCard size={20} className="group-hover:rotate-12 transition-transform" /> {activePlan ? '確認並啟動訂閱' : '確認並前往支付'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ImpactReportModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-6 overflow-y-auto py-10">
      <div className="absolute inset-0 bg-earth/60 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-slideUp">
        <div className="p-10 md:p-16">
          <button onClick={onClose} className="absolute top-10 right-10 text-earth/30 hover:text-earth transition-colors"><X size={32} /></button>
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-1/3 space-y-6">
              <div className="inline-block p-4 bg-sage text-white rounded-3xl"><Award size={40} /></div>
              <h2 className="text-4xl font-bold text-earth">2024 年度<br />永續影響力報告</h2>
              <p className="text-earth/60 leading-relaxed font-medium">這是我們與全台 2,500 位永續生活家共同寫下的成績單。每一克節省的塑膠，都是對地球最溫柔的承諾。</p>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { label: '減少塑膠排放量', value: '1,540 kg', icon: <Recycle className="text-sage" />, desc: '約等於 30,800 個 500ml 塑膠瓶' },
                { label: '節省配送碳足跡', value: '8,200 km', icon: <Truck className="text-sage" />, desc: '相當於環繞台灣 7.5 圈' },
                { label: '回收循環玻璃罐', value: '12,450 個', icon: <RefreshCw className="text-sage" />, desc: '節省了約 4,980kg 的玻璃原料消耗' },
                { label: '支持台灣小農單位', value: '24 戶', icon: <Leaf className="text-sage" />, desc: '平均提升小農收益 35%' }
              ].map((stat, i) => (
                <div key={i} className="bg-stone-50 p-8 rounded-[2rem] shadow-sm space-y-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-sage">{stat.icon}</div>
                  <div>
                    <h4 className="text-sm font-bold text-earth/40 uppercase tracking-widest">{stat.label}</h4>
                    <div className="text-3xl font-bold text-earth my-1">{stat.value}</div>
                    <p className="text-xs text-earth/60 font-medium">{stat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-16 pt-10 border-t border-earth/10 flex flex-col md:flex-row justify-between gap-10">
            <div className="space-y-4">
              <h4 className="font-bold text-xl">下一個目標：2025</h4>
              <p className="text-earth/60 text-sm max-w-sm">計畫在明年將服務擴展至中南部，並引入 100% 電動配送車隊，預計再減少 25% 的 carbon 排放。</p>
            </div>
            <button className="bg-earth text-white px-10 py-5 rounded-2xl font-bold hover:bg-sage transition-all shadow-lg active:scale-95">下載完整報告書 (PDF)</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '您好！我是 ZWK 永續小幫手。今天想嘗試什麼樣的零浪費料理，或是需要儲存食材的建議嗎？' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction: '你是一位專業的零浪費大廚與永續生活顧問。語氣應優雅、專業且具備親和力，符合地球極簡主義的風格。' },
      });
      const responseStream = await chat.sendMessageStream({ message: userMessage });
      let fullText = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      for await (const chunk of responseStream) {
        fullText += chunk.text || '';
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = fullText;
          return newMessages;
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: '抱歉，系統暫時忙碌中。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[60] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[550px] glass rounded-3xl earth-shadow border border-white/50 flex flex-col overflow-hidden animate-slideUp">
          <div className="p-6 bg-sage text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><Sparkles size={20} /></div>
              <div><h4 className="font-bold leading-none">ZWK 永續助手</h4><span className="text-xs opacity-80">AI 智能建議</span></div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform"><X size={20} /></button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-oatmeal/20">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-sage text-white rounded-tr-none' : 'bg-white text-earth rounded-tl-none shadow-sm'}`}>
                  {m.text || (isLoading && i === messages.length - 1 ? <Loader2 className="animate-spin" size={16} /> : null)}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white/80 border-t border-stone-100 flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="詢問..." className="flex-1 bg-stone-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-sage focus:outline-none" />
            <button onClick={handleSendMessage} disabled={isLoading} className="w-10 h-10 bg-sage text-white rounded-xl flex items-center justify-center hover:bg-earth transition-colors disabled:opacity-50"><Send size={18} /></button>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="w-16 h-16 bg-sage text-white rounded-full flex items-center justify-center earth-shadow hover:scale-110 transition-transform active:scale-95 group">
        {isOpen ? <X size={28} /> : <MessageCircle size={28} className="group-hover:animate-bounce" />}
      </button>
    </div>
  );
};

// --- Page Views ---

const HomeView: React.FC<{ 
  onPlanSelect: (plan: ActivePlan) => void; 
  onOpenReport: () => void;
  onShopClick: () => void;
}> = ({ onPlanSelect, onOpenReport, onShopClick }) => {
  const heroImage = "https://i.postimg.cc/HxBHbY6z/5000627.jpg";
  const [isWeekly, setIsWeekly] = useState(true);

  const plans = [
    { title: "輕盈寶盒", limit: 5, weekly: "980", biweekly: "1,180", features: ["免運費配送", "基礎 AI 消耗評估", "玻璃罐殺菌清潔", "產地故事小卡"] },
    { title: "標準寶盒", limit: 8, weekly: "1,480", biweekly: "1,680", features: ["優先配送權", "進階 AI 消耗評估", "玻璃罐殺菌清潔", "專屬小農訪談報告", "節日限定食材"] },
    { title: "盛宴寶盒", limit: 12, weekly: "1,980", biweekly: "2,280", features: ["1對1 營養建議", "深度 AI 消耗評估", "玻璃罐殺菌清潔", "所有限定食材優先選", "專屬廚藝工作坊"] }
  ];

  return (
    <div className="animate-fadeIn">
      {/* Hero */}
      <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#FDFDF5]">
        <div className="absolute inset-0 z-0 opacity-10 blur-xl">
          <img src={heroImage} alt="BG" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8 animate-slideUp">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sage/10 text-sage rounded-full text-sm font-bold tracking-wide uppercase"><Recycle size={14} /> 循環經濟新革命</div>
            <h1 className="text-5xl md:text-7xl font-bold text-earth leading-[1.15]">永續，<br /><span className="text-sage">直送到家</span>的日常。</h1>
            <p className="text-xl text-earth/80 max-w-lg leading-relaxed">免除塑膠包裝、自動補給、產地直達。零浪費廚房為您建立一個既美觀又環保的現代糧倉。</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button onClick={() => onShopClick()} className="px-10 py-5 bg-sage text-white rounded-2xl font-bold text-lg hover:bg-earth transition-all shadow-xl hover:-translate-y-1 active:scale-95">立即預訂你的循環寶盒</button>
            </div>
          </div>
          <div className="relative animate-fadeIn delay-300">
            <div className="relative z-10 w-full aspect-[4/5] rounded-[3rem] overflow-hidden earth-shadow bg-stone-100 ring-8 ring-white/30 group">
              <img src={heroImage} alt="ZWK Kitchen" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
          </div>
        </div>
      </section>

      {/* The Loop */}
      <section id="how-it-works" className="py-32 px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-sm font-bold text-sage tracking-[0.2em] uppercase">The ZWK Loop</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-earth">循環機制，極簡生活</h3>
            <p className="text-earth/50 font-medium">我們不僅送貨，我們建立一個閉環的資源系統。</p>
          </div>
          <div className="grid md:grid-cols-4 gap-12">
            {[
              { icon: <ShoppingBag size={32} />, title: "彈性選購", desc: "隨時根據需求調整品項與數量，透過 AI 預測您的用量。" },
              { icon: <Truck size={32} />, title: "低碳配送", desc: "專屬玻璃罐包裝，由我們自有的綠能物流車隊直送。" },
              { icon: <Droplets size={32} />, title: "高品質享用", desc: "食材由產地直達。用完後無需清洗，只需簡單歸還。" },
              { icon: <RefreshCw size={32} />, title: "預約回收", desc: "在 App 上一鍵預約，我們將收回空罐並同步完成補給。" }
            ].map((step, idx) => (
              <div key={idx} className="group text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center earth-shadow mb-8 group-hover:bg-sage/10 transition-colors text-sage">{step.icon}</div>
                <h4 className="text-2xl font-bold mb-4">{step.title}</h4>
                <p className="text-earth/70 leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section id="subscriptions" className="py-32 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-6">
            <h2 className="text-sm font-bold text-sage tracking-widest uppercase">Subscription Plans</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-earth">選擇適合您的訂閱方案</h3>
            
            <div className="flex items-center justify-center gap-6 pt-4">
              <span className={`text-sm font-bold transition-colors ${isWeekly ? 'text-earth' : 'text-earth/30'}`}>每週配送</span>
              <button 
                onClick={() => setIsWeekly(!isWeekly)}
                className="w-16 h-8 bg-stone-100 rounded-full p-1 relative transition-all"
              >
                <div className={`w-6 h-6 bg-sage rounded-full shadow-sm transition-all transform ${isWeekly ? 'translate-x-0' : 'translate-x-8'}`}></div>
              </button>
              <span className={`text-sm font-bold transition-colors ${!isWeekly ? 'text-earth' : 'text-earth/30'}`}>隔週配送</span>
            </div>
            <p className="text-xs text-sage font-bold">每週配送方案可享 85 折優惠</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div key={i} className={`p-10 rounded-[2.5rem] border transition-all duration-500 flex flex-col ${i === 1 ? 'bg-earth text-white border-earth shadow-2xl scale-105 z-10' : 'bg-stone-50 border-stone-100 text-earth hover:shadow-xl'}`}>
                <div className="mb-8">
                  <h4 className="text-2xl font-bold mb-2">{plan.title}</h4>
                  <p className={`text-sm font-medium ${i === 1 ? 'text-sage' : 'text-earth/50'}`}>任選 {plan.limit} 款食材</p>
                </div>
                <div className="mb-10">
                  <span className="text-4xl font-bold">NT$ {isWeekly ? plan.weekly : plan.biweekly}</span>
                  <span className={`text-sm font-bold ml-2 ${i === 1 ? 'text-white/40' : 'text-earth/40'}`}>/ 每趟</span>
                </div>
                <ul className="space-y-4 mb-12 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3 text-sm font-medium">
                      <Check size={18} className={i === 1 ? 'text-sage' : 'text-sage'} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => onPlanSelect({ 
                    title: plan.title, 
                    limit: plan.limit, 
                    price: isWeekly ? plan.weekly : plan.biweekly,
                    features: plan.features 
                  })}
                  className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 ${i === 1 ? 'bg-sage text-white hover:bg-white hover:text-earth' : 'bg-earth text-white hover:bg-sage'}`}
                >
                  立即訂閱
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Gallery (Optional shortcut) */}
      <section id="products" className="py-32 bg-stone-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-earth">嚴選常備食材</h2>
              <p className="text-lg text-earth/70">所有食材皆選自永續農場，由 ZWK 玻璃罐盛裝。</p>
            </div>
            <button onClick={() => onShopClick()} className="flex items-center gap-2 text-sage font-bold hover:gap-4 transition-all group">
              立即前往商店 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {PRODUCTS.slice(0, 6).map((p) => (
              <div key={p.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-earth/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6">
                    <button onClick={() => onShopClick()} className="w-full py-4 bg-white rounded-2xl font-bold text-earth hover:bg-sage hover:text-white transition-all shadow-xl active:scale-95">查看商品詳情</button>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-2"><h4 className="text-xl font-bold">{p.name}</h4><span className="text-earth/50 text-xs font-medium">{p.unit}</span></div>
                  <div className="text-2xl font-bold text-sage">NT$ {p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Dashboard */}
      <section id="impact" className="py-32 bg-sage/5 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-earth">追蹤您的永續足跡</h2>
              <div className="grid grid-cols-2 gap-6">
                {[ { label: '減少塑膠', value: '5.2', unit: 'kg' }, { label: '循環空罐', value: '48', unit: '個' }, { label: '節省旅程', value: '124', unit: 'km' }, { label: '支持小農', value: '8', unit: '戶' } ].map((stat, i) => (
                  <div key={i} className="glass p-8 rounded-[2rem] border border-white/50 space-y-2 group hover:bg-white transition-all duration-500">
                    <div className="text-sage font-bold uppercase tracking-widest text-[10px]">{stat.label}</div>
                    <div className="text-4xl font-bold text-earth">{stat.value}<span className="text-xl font-medium ml-1">{stat.unit}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-white rounded-full earth-shadow flex flex-col items-center justify-center p-12 text-center space-y-4">
                <div className="w-24 h-24 bg-sage/10 text-sage rounded-full flex items-center justify-center mx-auto mb-4"><Leaf size={48} /></div>
                <h4 className="text-2xl font-bold">社區影響力</h4>
                <p className="text-earth/60 px-6 font-medium">與 2,500+ 位使用者共同為海洋省下了超過 15 萬件一次性塑膠包裝。</p>
                <button onClick={onOpenReport} className="text-sage font-bold underline underline-offset-8 decoration-sage/30 hover:decoration-sage transition-all">查看年度影響力報告</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ShopView: React.FC<{ 
  onCheckout: (q: Record<number, number>) => void;
  activePlan: ActivePlan | null;
  onClearPlan: () => void;
}> = ({ onCheckout, activePlan, onClearPlan }) => {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [filter, setFilter] = useState('全部');

  const categories = ['全部', ...new Set(PRODUCTS.map(p => p.category))];
  
  const totalItems = Object.values(quantities).reduce((acc, curr) => acc + curr, 0);

  const updateQty = (id: number, delta: number) => {
    if (activePlan && delta > 0 && totalItems >= activePlan.limit) return;
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const totalPrice = PRODUCTS.reduce((acc, p) => acc + (p.price * (quantities[p.id] || 0)), 0);
  const filteredProducts = filter === '全部' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);

  return (
    <div className="animate-fadeIn pb-32">
      {/* Progress Bar for Active Plan */}
      {activePlan && (
        <div className="fixed top-20 left-0 right-0 z-[45] animate-slideDown">
          <div className="bg-earth text-white py-3 px-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border-b border-white/20">
            <div className="flex items-center gap-3">
              <Package size={20} className="shrink-0 text-sage" />
              <span className="text-xs sm:text-sm font-bold">配置方案：{activePlan.title}（{totalItems} / {activePlan.limit}）</span>
            </div>
            <div className="flex-1 max-w-md w-full h-2 bg-white/10 rounded-full overflow-hidden mx-4">
              <div 
                className="h-full bg-sage transition-all duration-500 shadow-[0_0_10px_rgba(141,170,145,0.5)]" 
                style={{ width: `${(totalItems / activePlan.limit) * 100}%` }}
              ></div>
            </div>
            <button onClick={onClearPlan} className="text-[10px] font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full hover:bg-white/10 transition-colors">取消配置</button>
          </div>
        </div>
      )}

      <section className={`bg-oatmeal/30 py-24 ${activePlan ? 'mt-12' : ''}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-sm font-bold text-sage tracking-[0.2em] uppercase">ZWK Market</h2>
              <h3 className="text-5xl font-bold text-earth leading-tight">為您的糧倉<br />注入永續靈魂</h3>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] earth-shadow flex flex-col sm:flex-row items-center gap-8 border border-white/50 w-full md:w-auto">
              <div className="text-center sm:text-right">
                <div className="text-xs font-bold text-earth/40 uppercase tracking-widest mb-1">
                  {activePlan ? '方案剩餘容量' : '您的寶盒內容'}
                </div>
                <div className="text-2xl font-bold text-earth">
                  {activePlan ? `${activePlan.limit - totalItems} 件可選` : `${totalItems} 項商品 · NT$ ${totalPrice}`}
                </div>
              </div>
              <button 
                onClick={() => onCheckout(quantities)}
                disabled={activePlan ? totalItems < activePlan.limit : totalItems === 0} 
                className="w-full sm:w-auto px-8 py-4 bg-sage text-white rounded-2xl font-bold hover:bg-earth transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2 group"
              >
                {activePlan ? <Sparkles size={20} className="group-hover:animate-spin" /> : <ShoppingCart size={20} />} 
                {activePlan ? '完成配置並結帳' : '立即結算'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 border-b border-stone-100 bg-white sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-3 rounded-full font-bold transition-all text-sm ${filter === cat ? 'bg-earth text-white' : 'bg-stone-50 text-earth/60 hover:bg-stone-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((p) => (
              <div key={p.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-100 flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <div className="absolute top-4 left-4"><span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-earth uppercase tracking-[0.2em] shadow-sm">{p.category}</span></div>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold text-earth group-hover:text-sage transition-colors">{p.name}</h4>
                      <span className="text-earth/40 text-xs font-bold uppercase shrink-0">{p.unit}</span>
                    </div>
                    <div className="text-2xl font-bold text-sage">NT$ {p.price}</div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center bg-stone-50 rounded-xl p-1.5 border border-stone-100">
                      <button onClick={() => updateQty(p.id, -1)} className="w-8 h-8 flex items-center justify-center text-earth/30 hover:text-sage transition-colors"><Minus size={16} /></button>
                      <span className="w-10 text-center font-bold text-lg text-earth">{quantities[p.id] || 0}</span>
                      <button onClick={() => updateQty(p.id, 1)} className="w-8 h-8 flex items-center justify-center text-earth/30 hover:text-sage transition-colors"><Plus size={16} /></button>
                    </div>
                    <button 
                      onClick={() => quantities[p.id] === 0 && updateQty(p.id, 1)} 
                      disabled={activePlan && totalItems >= activePlan.limit && (quantities[p.id] || 0) === 0}
                      className={`px-4 py-3.5 rounded-xl font-bold transition-all text-sm flex-1 ${ (quantities[p.id] || 0) > 0 ? 'bg-earth text-white' : 'bg-sage text-white hover:bg-earth disabled:opacity-20'}`}
                    >
                      {(quantities[p.id] || 0) > 0 ? '已選入' : '選入寶盒'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// ... (Other views like FAQ, Delivery, Origins, About remain the same)
const AboutView: React.FC = () => (
  <section className="py-40 px-6 animate-fadeIn">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <h2 className="text-sm font-bold text-sage tracking-[0.2em] uppercase">About ZWK</h2>
          <h3 className="text-4xl md:text-6xl font-bold text-earth leading-tight">重新定義廚房與<br />地球的關係</h3>
          <p className="text-xl text-earth/70 leading-relaxed font-medium">我們不只是一家食材店。零浪費廚房 (ZWK) 是一場生活革命。我們相信，追求高品質生活不應以犧牲地球為代價。</p>
          <div className="grid grid-cols-2 gap-8 pt-8">
            <div className="space-y-2"><h4 className="text-4xl font-bold text-earth">100%</h4><p className="text-xs text-earth/40 font-bold uppercase tracking-widest">無塑包裝</p></div>
            <div className="space-y-2"><h4 className="text-4xl font-bold text-earth">25+</h4><p className="text-xs text-earth/40 font-bold uppercase tracking-widest">在地契作小農</p></div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-sage/10 rounded-[3rem] p-12 space-y-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-sage shadow-sm"><Globe size={32} /></div>
            <h4 className="text-2xl font-bold text-earth">永續農法</h4>
            <p className="text-earth/60 text-lg">嚴選採用再生農法的小農單位，確保食材充滿生命力且對土地友善。</p>
          </div>
          <div className="bg-oatmeal rounded-[3rem] p-12 space-y-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-sage shadow-sm"><Zap size={32} /></div>
            <h4 className="text-2xl font-bold text-earth">智能補給</h4>
            <p className="text-earth/60 text-lg">運用 AI 自動估算您的消耗量，徹底終止過度採買的浪費。</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const OriginsView: React.FC = () => (
  <section className="py-40 px-6 animate-fadeIn">
    <div className="max-w-7xl mx-auto">
      <div className="text-center space-y-6 mb-20">
        <h2 className="text-sm font-bold text-sage tracking-[0.2em] uppercase">Our Origins</h2>
        <h3 className="text-4xl md:text-5xl font-bold">產地直達，透明足跡</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { name: "阿里山特選咖啡", loc: "嘉義 · 阿里山", desc: "海拔 1200 公尺的日曬精華，無農藥栽培。", img: "https://images.unsplash.com/photo-1459755484551-638ca552aa3b?auto=format&fit=crop&q=80&w=800" },
          { name: "關山有機糙米", loc: "台東 · 關山", desc: "純淨山泉水灌溉，米粒晶瑩飽滿。", img: "https://images.unsplash.com/photo-1586201327102-335a2851ee8a?auto=format&fit=crop&q=80&w=800" },
          { name: "恆春初榨橄欖油", loc: "屏東 · 恆春", desc: "精選優質橄欖，低溫冷壓保留營養。", img: "https://images.unsplash.com/photo-1474979266404-7eaacbad8a0f?auto=format&fit=crop&q=80&w=800" }
        ].map((origin, i) => (
          <div key={i} className="group relative h-[500px] rounded-[3.5rem] overflow-hidden earth-shadow">
            <img src={origin.img} alt={origin.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-earth/90 via-earth/30 to-transparent p-12 flex flex-col justify-end text-white">
              <div className="flex items-center gap-2 mb-3"><MapPin size={18} className="text-sage" /><span className="text-sm font-bold tracking-widest uppercase">{origin.loc}</span></div>
              <h4 className="text-3xl font-bold mb-3">{origin.name}</h4>
              <p className="text-lg opacity-70 leading-relaxed line-clamp-2">{origin.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FAQView: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number | null>(0);
  const faqs = [
    { q: "循環玻璃罐在使用前會消毒嗎？", a: "是的，所有收回的玻璃罐都會經過專業的六道清洗工序，包含高溫蒸氣殺菌與超音波洗淨，確保衛生安全優於業界標準。" },
    { q: "我可以隨時更改訂閱的內容嗎？", a: "當然。您只需在下次配送前 48 小時透過官網或 LINE 修改「寶盒清單」，即可自由更換食材品項與份量。" },
    { q: "收回空罐時，我需要清洗嗎？", a: "為了確保衛生一致性，我們建議您僅需簡單沖洗掉殘留物即可。深層清潔與殺菌將由我們的專業廠區負責。" },
    { q: "如何確保食材的產地透明度？", a: "ZWK 堅持「產地直航」。每個玻璃罐上都有專屬 QR Code，掃描即可查看該批次食材的農場來源、採收日期及檢驗報告。" }
  ];
  return (
    <section className="py-40 px-6 animate-fadeIn">
      <div className="max-w-3xl mx-auto">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-sm font-bold text-sage tracking-[0.2em] uppercase">Support</h2>
          <h3 className="text-4xl md:text-5xl font-bold">常見問題</h3>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-stone-50 rounded-[2rem] overflow-hidden transition-all duration-300">
              <button onClick={() => setActiveIdx(activeIdx === i ? null : i)} className="w-full px-10 py-8 flex justify-between items-center text-left hover:bg-stone-100 transition-colors">
                <span className="text-xl font-bold text-earth leading-relaxed">{faq.q}</span>
                <ChevronDown size={24} className={`text-sage transition-transform duration-300 ${activeIdx === i ? 'rotate-180' : ''}`} />
              </button>
              <div className={`px-10 overflow-hidden transition-all duration-500 ease-in-out ${activeIdx === i ? 'max-h-60 pb-10 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-earth/60 text-lg leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DeliveryView: React.FC = () => (
  <section className="py-40 px-6 animate-fadeIn">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-20 items-center">
        <div className="space-y-10">
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-sage tracking-[0.2em] uppercase">Coverage</h2>
            <h3 className="text-4xl md:text-5xl font-bold">配送範圍</h3>
            <p className="text-xl text-earth/70 leading-relaxed">我們目前專注於雙北核心區域，提供最穩定的循環服務。</p>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-6 flex items-center text-sage"><Search size={24} /></div>
            <input type="text" placeholder="輸入郵遞區號..." className="w-full bg-stone-50 border border-stone-100 rounded-[2rem] py-6 pl-16 pr-8 text-lg focus:outline-none focus:ring-2 focus:ring-sage focus:bg-white transition-all shadow-sm" />
          </div>
        </div>
        <div className="bg-earth p-12 rounded-[3.5rem] text-white space-y-8 earth-shadow">
          <h4 className="text-2xl font-bold text-sage">開放區域狀態</h4>
          <div className="space-y-4">
            {[
              { city: "台北市 / 新北市", status: "全區開放", active: true },
              { city: "桃園市 / 新竹市", status: "部分開放", active: true },
              { city: "台中市 / 台南市", status: "2025 Q1 啟動", active: false }
            ].map((area, i) => (
              <div key={i} className="flex justify-between items-center p-6 border border-white/10 rounded-2xl bg-white/5">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${area.active ? 'bg-sage animate-pulse' : 'bg-white/20'}`}></div>
                  <span className="text-lg font-bold">{area.city}</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest opacity-40">{area.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// --- Main Layout ---

const Navbar: React.FC<{ 
  currentPage: Page; 
  onPageChange: (p: Page) => void; 
  onNavigateToSection: (sectionId: string) => void;
  onAuthClick: () => void 
}> = ({ currentPage, onPageChange, onNavigateToSection, onAuthClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: '運作機制', sectionId: 'how-it-works' },
    { label: '訂閱方案', sectionId: 'subscriptions' },
    { label: '關於 ZWK', pageId: 'about' as Page },
    { label: '嚴選產地', pageId: 'origins' as Page },
    { label: '常見問題', pageId: 'faq' as Page },
    { label: '配送範圍', pageId: 'delivery' as Page },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onPageChange('home')}>
          <div className="w-10 h-10 bg-sage rounded-full flex items-center justify-center text-white"><Leaf size={20} /></div>
          <span className="text-xl font-bold tracking-tight text-earth">零浪費廚房 ZWK</span>
        </div>
        <div className="hidden lg:flex items-center gap-8 font-medium text-earth/80">
          {navItems.map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => {
                if (item.sectionId) onNavigateToSection(item.sectionId);
                else if (item.pageId) onPageChange(item.pageId);
                setMobileOpen(false);
              }} 
              className={`hover:text-sage transition-colors text-sm ${ (item.pageId && currentPage === item.pageId) ? 'text-sage font-bold' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <button onClick={() => onPageChange('shop')} className={`px-6 py-2.5 rounded-full font-bold transition-all shadow-md flex items-center gap-2 ${currentPage === 'shop' ? 'bg-earth text-white' : 'bg-sage text-white hover:bg-earth'}`}><ShoppingCart size={16} /> 開始訂購</button>
          <button onClick={onAuthClick} className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-earth hover:text-sage transition-all"><User size={18} /></button>
        </div>
        <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X /> : <Menu />}</button>
      </div>
    </nav>
  );
};

const Footer: React.FC<{ onPageChange: (p: Page) => void; onNavigateToSection: (s: string) => void }> = ({ onPageChange, onNavigateToSection }) => {
  return (
    <footer className="bg-earth text-white pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-center gap-3"><div className="w-12 h-12 bg-sage rounded-full flex items-center justify-center text-white"><Leaf size={24} /></div><span className="text-2xl font-bold">零浪費廚房 ZWK</span></div>
            <h5 className="text-3xl font-bold max-w-sm leading-snug">加入循環經濟，<br />為下一代預約更好的未來。</h5>
          </div>
          <div className="space-y-6">
            <h6 className="text-sage font-bold uppercase tracking-widest text-xs">探索與發現</h6>
            <ul className="space-y-4 text-white/60 font-medium text-sm">
              <li><button onClick={() => onPageChange('shop')} className="hover:text-white transition-colors">線上商店</button></li>
              <li><button onClick={() => onPageChange('about')} className="hover:text-white transition-colors">關於 ZWK</button></li>
              <li><button onClick={() => onPageChange('origins')} className="hover:text-white transition-colors">我們的產地</button></li>
              <li><button onClick={() => onPageChange('faq')} className="hover:text-white transition-colors">常見問題 FAQ</button></li>
              <li><button onClick={() => onPageChange('delivery')} className="hover:text-white transition-colors">配送範圍查詢</button></li>
            </ul>
          </div>
          <div className="space-y-8">
            <h6 className="text-sage font-bold uppercase tracking-widest text-xs">訂閱電子報</h6>
            <div className="relative">
              <input type="email" placeholder="您的電子信箱" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-sage transition-all text-sm" />
              <button className="absolute right-2 top-2 bottom-2 px-6 bg-sage rounded-xl font-bold hover:bg-white hover:text-earth transition-all text-xs">送出</button>
            </div>
          </div>
        </div>
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-white/40 text-[10px] font-bold tracking-widest text-center md:text-left">
          <p>© 2024 零浪費廚房 ZWK. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isImpactReportOpen, setIsImpactReportOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currentQuantities, setCurrentQuantities] = useState<Record<number, number>>({});
  const [activePlan, setActivePlan] = useState<ActivePlan | null>(null);
  const [planToPreview, setPlanToPreview] = useState<ActivePlan | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleNavigateToSection = (sectionId: string) => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const confirmPlanSelection = () => {
    if (planToPreview) {
      setActivePlan(planToPreview);
      setPlanToPreview(null);
      setCurrentQuantities({});
      setCurrentPage('shop');
    }
  };

  const handleClearPlan = () => {
    setActivePlan(null);
    setCurrentQuantities({});
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home': return (
        <HomeView 
          onPlanSelect={setPlanToPreview} 
          onOpenReport={() => setIsImpactReportOpen(true)} 
          onShopClick={() => setCurrentPage('shop')} 
        />
      );
      case 'shop': return (
        <ShopView 
          onCheckout={(q) => { setCurrentQuantities(q); setIsCheckoutOpen(true); }} 
          activePlan={activePlan} 
          onClearPlan={handleClearPlan} 
        />
      );
      case 'about': return <AboutView />;
      case 'origins': return <OriginsView />;
      case 'faq': return <FAQView />;
      case 'delivery': return <DeliveryView />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen selection:bg-sage selection:text-white bg-[#FDFDF5]">
      <Navbar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
        onNavigateToSection={handleNavigateToSection}
        onAuthClick={() => setIsAuthModalOpen(true)} 
      />
      <main className="min-h-screen">{renderContent()}</main>
      <Footer onPageChange={setCurrentPage} onNavigateToSection={handleNavigateToSection} />
      <AIChat />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <ImpactReportModal isOpen={isImpactReportOpen} onClose={() => setIsImpactReportOpen(false)} />
      <PlanPreviewModal 
        plan={planToPreview} 
        onClose={() => setPlanToPreview(null)} 
        onConfirm={confirmPlanSelection} 
      />
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        quantities={currentQuantities} 
        activePlan={activePlan}
      />
    </div>
  );
}
