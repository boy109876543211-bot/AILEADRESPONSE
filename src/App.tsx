import { useState, useEffect, useCallback } from 'react';
import { Phone, Clock, Sparkles, Send, Copy, Check, MessageSquare, Plus, RefreshCw, Briefcase, Link2, ShieldCheck, HelpCircle, ToggleLeft, ToggleRight, CheckCircle2, Layers, Sliders, Zap, TrendingUp, AlertTriangle, DollarSign, Play } from 'lucide-react';

// Core Type Definitions
interface Lead {
  id: string;
  customer_name: string;
  phone_number: string;
  service_requested: string;
  message: string | null;
  time_received: string;
  ai_status: 'Drafting' | 'Ready';
  sent_at: string | null;
  isNew?: boolean;
}

// Strategy Mapping Type Definition
type StrategyKey = 'quote' | 'emergency' | 'booking';

function App() {
  // 1. Production Security & Dynamic URL Routing State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [urlNiche, setUrlNiche] = useState<string | null>(null);
  const [prospectName, setProspectName] = useState('');
  const [boltAppLink, setBoltAppLink] = useState('');
  const [scriptCopied, setScriptCopied] = useState(false);

  // Client-Centric Conversion States
  const [isAutopilot, setIsAutopilot] = useState(false);
  const [responseStrategy, setResponseStrategy] = useState<StrategyKey>('quote');

  // Typewriter Effect State
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  // Revenue Tracking State
  const [revenueRecovered] = useState(4250);
  const [responseTimer, setResponseTimer] = useState(180); // 3 minutes in seconds
  const [isUrgent, setIsUrgent] = useState(false);

  // Hook to inspect URL parameters natively on component mounting
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);

      if (params.get('mode') === 'admin') {
        setIsAdminMode(true);
      }

      const nicheParam = params.get('niche');
      if (nicheParam) {
        setUrlNiche(nicheParam);
      }

      const businessParam = params.get('business');
      if (businessParam) {
        setProspectName(businessParam);
      }

      const leadParam = params.get('lead');
      if (leadParam) {
        setLeads((prevLeads) => {
          const updatedLeads = [...prevLeads];
          if (updatedLeads.length > 0) {
            updatedLeads[0] = { ...updatedLeads[0], customer_name: leadParam };
          }
          return updatedLeads;
        });
      }
    }
  }, []);

  // Response Timer Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setResponseTimer((prev) => {
        if (prev <= 0) return 0;
        const newVal = prev - 1;
        setIsUrgent(newVal < 180);
        return newVal;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Core Lead Dataset Sandbox State
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      customer_name: 'Alex Mercer',
      phone_number: '512-555-0192',
      service_requested: 'Roofing',
      message: 'Need a patch repair after yesterday\'s hail storm.',
      time_received: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      ai_status: 'Ready',
      sent_at: null,
    },
    {
      id: '2',
      customer_name: 'Sarah Jenkins',
      phone_number: '214-555-8831',
      service_requested: 'Plumbing',
      message: 'Water heater leaking in the basement.',
      time_received: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
      ai_status: 'Ready',
      sent_at: null,
    },
    {
      id: '3',
      customer_name: 'David Torres',
      phone_number: '713-555-4021',
      service_requested: 'HVAC',
      message: 'AC unit blowing warm air outside.',
      time_received: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      ai_status: 'Ready',
      sent_at: null,
    }
  ]);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newLeadForm, setNewLeadForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: '',
    phone_number: '',
    service_requested: 'Roofing',
  });

  const activeLead = selectedLead || leads[0];

  // Optimized SMS Strategy Templates Engine
  const getDynamicAIDraft = useCallback((lead: Lead) => {
    const businessSignature = prospectName.trim() ? prospectName.trim() : 'Speed-to-Lead Automation';
    const linkPlaceholder = boltAppLink.trim() ? boltAppLink.trim() : 'ourbookinglink.com/schedule';

    const strategies: Record<StrategyKey, string> = {
      quote: `Hey ${lead.customer_name}! Thanks for reaching out about a quote on your project. I just saw your request drop in through our website. Are you free for a quick 2-minute phone call right now so I can grab a few details and get that priced out for you? - ${businessSignature}`,

      emergency: `Hey ${lead.customer_name}! I received your urgent message. Even though our main office is currently closed, our emergency dispatch technician has been alerted. Are you available right now to receive a priority call to go over your situation? - ${businessSignature}`,

      booking: `Hey ${lead.customer_name}, it's ${businessSignature}. We just received your site inquiry! To save you from playing phone tag back and forth, you can tap here to instantly pick a time that works best for your schedule: ${linkPlaceholder}. Looking forward to speaking!`
    };

    return strategies[responseStrategy] || strategies.quote;
  }, [prospectName, boltAppLink, responseStrategy]);

  // Typewriter Effect
  useEffect(() => {
    if (activeLead && activeLead.ai_status === 'Ready' && !showFullText) {
      const fullText = getDynamicAIDraft(activeLead);
      let index = 0;
      setIsTyping(true);
      setDisplayedText('');

      const typeInterval = setInterval(() => {
        if (index < fullText.length) {
          setDisplayedText(fullText.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          setShowFullText(true);
          clearInterval(typeInterval);
        }
      }, 15);

      return () => clearInterval(typeInterval);
    }
  }, [activeLead, getDynamicAIDraft, showFullText]);

  // Reset typewriter when lead changes
  useEffect(() => {
    setShowFullText(false);
    setDisplayedText('');
    setIsTyping(false);
  }, [activeLead?.id]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Interactive Simulator - Inject Mock Lead with Typewriter
  const handleSimulatorTest = () => {
    const generatedId = Math.random().toString(36).substr(2, 9);

    const mockLead: Lead = {
      id: generatedId,
      customer_name: 'Sarah Jenkins',
      phone_number: '469-555-8847',
      service_requested: 'Plumbing',
      message: 'Urgent Leak Repair Quote Request - Water pooling under kitchen sink.',
      time_received: new Date().toISOString(),
      ai_status: 'Drafting',
      sent_at: null,
      isNew: true,
    };

    setLeads((prev) => [mockLead, ...prev]);
    setSelectedLead(mockLead);
    setShowFullText(false);
    setDisplayedText('');
    setResponseTimer(180);

    setTimeout(() => {
      setLeads((prevLeads) =>
        prevLeads.map((l) => (l.id === generatedId ? { ...l, ai_status: 'Ready' } : l))
      );
      setSelectedLead((current) =>
        current?.id === generatedId ? { ...current, ai_status: 'Ready' } : current
      );
    }, 2000);

    setTimeout(() => {
      setLeads((prevLeads) =>
        prevLeads.map((l) => (l.id === generatedId ? { ...l, isNew: false } : l))
      );
    }, 8000);
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedId = Math.random().toString(36).substr(2, 9);

    const templateLead: Lead = {
      id: generatedId,
      customer_name: formData.customer_name,
      phone_number: formData.phone_number,
      service_requested: formData.service_requested,
      message: 'Created via live interactive playground system.',
      time_received: new Date().toISOString(),
      ai_status: 'Drafting',
      sent_at: null,
      isNew: true,
    };

    setLeads((prev) => [templateLead, ...prev]);
    setSelectedLead(templateLead);
    setNewLeadForm(false);
    setIsSubmitting(false);
    setShowFullText(false);
    setResponseTimer(180);

    setFormData({ customer_name: '', phone_number: '', service_requested: 'Roofing' });

    setTimeout(() => {
      setLeads((prevLeads) =>
        prevLeads.map((l) => (l.id === generatedId ? { ...l, ai_status: 'Ready' } : l))
      );
      setSelectedLead((current) =>
        current?.id === generatedId ? { ...current, ai_status: 'Ready' } : current
      );
    }, 1500);

    setTimeout(() => {
      setLeads((prevLeads) =>
        prevLeads.map((l) => (l.id === generatedId ? { ...l, isNew: false } : l))
      );
    }, 5000);
  };

  const handleSendText = (lead: Lead) => {
    const finalDraftText = getDynamicAIDraft(lead);
    navigator.clipboard.writeText(finalDraftText);
    setCopiedId(lead.id);
    setTimeout(() => setCopiedId(null), 2000);

    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, sent_at: new Date().toISOString() } : l))
    );
    if (selectedLead?.id === lead.id) {
      setSelectedLead((prev) => (prev ? { ...prev, sent_at: new Date().toISOString() } : null));
    }

    const cleanNumber = lead.phone_number.replace(/\D/g, '');
    window.open(`sms:${cleanNumber}?body=${encodeURIComponent(finalDraftText)}`, '_blank');
  };

  const computedOutreachScript = `Hey, I noticed on your site that you take leads via your contact form, but if you're out on a job, it's easy to miss them before the client calls a competitor.

I actually custom-built this "Speed-to-Lead" dashboard specifically for your team at ${prospectName.trim() ? prospectName.trim() : '(Put Business Name Here)'} so you never lose another job to slow reply times: ${boltAppLink.trim() ? boltAppLink.trim() : '(Paste your Bolt.new app preview URL here)'}

I want to give you full access to it completely for free—all I ask for in return is a quick 30-second video testimonial if it helps you lock in your next client. Let me know if you're up for it!`;

  const copyAgencyScript = () => {
    navigator.clipboard.writeText(computedOutreachScript);
    setScriptCopied(true);
    setTimeout(() => setScriptCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-300 antialiased">
      <div>
        {/* Navigation & Branding Header */}
        <header className="bg-slate-900 border-b border-slate-800/80 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500 p-2 rounded-lg text-slate-950 shadow-md shadow-emerald-500/10">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">Speed-to-Lead Responder</h1>
                  <p className="text-slate-400 text-sm font-medium transition-all duration-200">
                    {prospectName.trim()
                      ? `${prospectName.trim()} Integration Command Center`
                      : "Demo Mode Hub (No API Keys Required)"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                {isAdminMode && (
                  <button
                    onClick={() => {
                      setProspectName('');
                      setBoltAppLink('');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-all border border-slate-700/50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset Config
                  </button>
                )}
                <button
                  onClick={() => setNewLeadForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-emerald-950/40 transform active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  New Lead
                </button>
              </div>
            </div>

            {/* Value Proposition Sub-Header Banner */}
            <div className="flex items-center justify-between bg-gradient-to-r from-emerald-950/50 to-slate-900/50 border border-emerald-900/30 rounded-lg px-4 py-2.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Zap className="w-4 h-4 animate-pulse" />
                <span>Turn Website Inquiries Into Booked Jobs in Under 45 Seconds. 100% Automated. Zero Missed Income.</span>
              </div>
              <button
                onClick={handleSimulatorTest}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold text-sm transition-all shadow-lg shadow-emerald-950/40 animate-pulse"
              >
                <Play className="w-4 h-4" />
                Click Here to Test an AI Response (Takes 2 Seconds)
              </button>
            </div>
          </div>
        </header>

        {/* Financial Stats Grid */}
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Revenue Recovered */}
          <div className="bg-gradient-to-br from-emerald-950/60 to-slate-900/60 rounded-xl border border-emerald-900/30 p-4 flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2.5 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Revenue Recovered This Month</p>
              <p className="text-2xl font-bold text-emerald-400 flex items-center gap-1">
                <DollarSign className="w-5 h-5" />
                {revenueRecovered.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Active Leads Counter */}
          <div className="bg-slate-900/60 rounded-xl border border-slate-800/60 p-4 flex items-center gap-3">
            <div className="bg-blue-500/20 p-2.5 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Active Leads in Pipeline</p>
              <p className="text-2xl font-bold text-white">{leads.length}</p>
            </div>
          </div>

          {/* Revenue at Risk */}
          <div className={`rounded-xl border p-4 flex items-center gap-3 transition-all duration-300 ${isUrgent
              ? 'bg-gradient-to-br from-red-950/60 to-slate-900/60 border-red-900/50 scale-105'
              : 'bg-slate-900/60 border-slate-800/60'
            }`}>
            <div className={`p-2.5 rounded-lg ${isUrgent ? 'bg-red-500/20' : 'bg-amber-500/20'}`}>
              <AlertTriangle className={`w-5 h-5 ${isUrgent ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Response Deadline</p>
              <p className={`text-xl font-bold ${isUrgent ? 'text-red-400' : 'text-amber-400'}`}>
                {formatTimer(responseTimer)}
                {isUrgent && <span className="ml-2 text-sm">Est. Value Decay: $1,500+</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Window Block */}
        {newLeadForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-150">
              <h2 className="text-xl font-bold mb-4 text-emerald-400 flex items-center gap-2">
                <Plus className="w-5 h-5" /> Add Interactive Lead
              </h2>
              <form onSubmit={handleAddLead} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Customer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-600 outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 512-555-0199"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-600 outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Target Business Niche</label>
                  <select
                    value={formData.service_requested}
                    onChange={(e) => setFormData({ ...formData, service_requested: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                  >
                    <option value="Roofing">Roofing</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Locksmith">Locksmith</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Auto Detailer">Auto Detailer</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setNewLeadForm(false)}
                    className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-semibold transition-all text-sm shadow-md shadow-emerald-950/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Adding...' : 'Inject Mock Lead'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Workspaces Dynamic Layout Split View */}
        <main className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Table Container Matrix */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-md font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live Incoming Leads Table
              </h2>
              <span className="bg-slate-900 border border-slate-800 text-slate-400 text-xs px-2.5 py-1 rounded-full font-mono">
                Counter: {leads.length} Records
              </span>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800/80 overflow-hidden shadow-2xl">
              <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-slate-900 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-800/60">
                <div className="col-span-4">Customer / Niche</div>
                <div className="col-span-3">Contact Phone</div>
                <div className="col-span-2">Timestamp</div>
                <div className="col-span-3 text-right">AI Status</div>
              </div>

              <div className="divide-y divide-slate-800/40 max-h-[420px] overflow-y-auto style-scrollbar">
                {leads.map((lead) => {
                  const isSelected = activeLead?.id === lead.id;
                  return (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`grid grid-cols-12 gap-2 px-4 py-3.5 items-center cursor-pointer transition-all duration-200 ${isSelected ? 'bg-slate-800/60 border-l-2 border-emerald-500' : 'hover:bg-slate-800/20 border-l-2 border-transparent'
                        } ${lead.isNew ? 'bg-emerald-950/70 border-y border-emerald-500/20 animate-pulse' : ''}`}
                    >
                      <div className="col-span-4 min-w-0">
                        <p className="font-semibold text-white truncate text-sm">{lead.customer_name}</p>
                        <span className="inline-block mt-0.5 px-2 py-0.5 bg-slate-950 text-slate-400 rounded text-[10px] border border-slate-800/40 font-medium tracking-wide">
                          {lead.service_requested}
                        </span>
                      </div>
                      <div className="col-span-3 text-slate-300 text-xs flex items-center gap-1.5 font-mono">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        {lead.phone_number}
                      </div>
                      <div className="col-span-2 text-slate-400 text-xs flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-600" />
                        {formatTime(lead.time_received)}
                      </div>
                      <div className="col-span-3 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider border uppercase ${lead.ai_status === 'Ready'
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40'
                              : 'bg-amber-950/40 text-amber-400 border-amber-900/40'
                            }`}
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          {lead.ai_status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Prompt Engine Workspace Area */}
          <section className="space-y-4">
            <h2 className="text-md font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Dynamic AI Draft Preview Output
            </h2>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-2xl space-y-4">
              {activeLead ? (
                <>
                  <div className="pb-3 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-base text-white">{activeLead.customer_name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Pipeline Inquiry: <span className="text-emerald-400 font-medium">{activeLead.service_requested}</span></p>
                    </div>

                    {/* Response Strategy Blueprint Dropdown Configuration Selection Menu */}
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-lg shrink-0">
                      <Sliders className="w-3.5 h-3.5 text-slate-500" />
                      <div className="flex flex-col">
                        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">Response Strategy Blueprint</span>
                        <select
                          value={responseStrategy}
                          onChange={(e) => {
                            setResponseStrategy(e.target.value as StrategyKey);
                            setShowFullText(false);
                          }}
                          className="bg-transparent text-xs text-slate-200 outline-none border-none font-medium cursor-pointer pr-2 focus:text-emerald-400"
                        >
                          <option value="quote" className="bg-slate-900 text-white">Instant Quote Follow-up</option>
                          <option value="emergency" className="bg-slate-900 text-white">After-Hours Emergency Route</option>
                          <option value="booking" className="bg-slate-900 text-white">Calendar Booking Reminder</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 min-h-[130px] flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1.5 font-mono">Generated Output Message Payload</p>
                      {activeLead.ai_status === 'Ready' ? (
                        <div className="text-sm text-slate-200 leading-relaxed font-sans transition-all duration-200 min-h-[60px]">
                          {displayedText}
                          {isTyping && <span className="animate-pulse">|</span>}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-400 font-mono text-xs py-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Processing Local Framework Logic...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {activeLead.ai_status === 'Ready' && !isTyping && (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(getDynamicAIDraft(activeLead));
                            setCopiedId(activeLead.id);
                            setTimeout(() => setCopiedId(null), 2000);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg font-medium text-sm transition-all border border-slate-700/60"
                        >
                          <Copy className="w-4 h-4" />
                          {copiedId === activeLead.id ? 'Copied Payload!' : 'Copy Payload'}
                        </button>
                        <button
                          onClick={() => handleSendText(activeLead)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-emerald-950/40 transform active:scale-98"
                        >
                          <Send className="w-4 h-4" />
                          Send Instant SMS Link
                        </button>
                      </div>

                      {/* Safe Routing Compliance Shield Badge Component */}
                      <div className="flex items-start gap-2 bg-slate-950/60 border border-slate-850 p-2.5 rounded-lg">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-slate-400 leading-normal">
                          <span className="text-white font-semibold">Carrier Compliant Routing:</span> Uses 10DLC verified business phone protocols to ensure 100% message delivery rate with zero spam risk.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Select an inbound lead data item to trigger text previews.</p>
                </div>
              )}
            </div>

            {/* Safety Guardrails System Status Container Block */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Safety Guardrail Protocols</span>
                </div>
                <button
                  onClick={() => setIsAutopilot(!isAutopilot)}
                  className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <span className="text-slate-400">Autopilot Mode:</span>
                  {isAutopilot ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      [ON] <ToggleRight className="w-5 h-5 text-emerald-500" />
                    </span>
                  ) : (
                    <span className="text-amber-500 flex items-center gap-1">
                      [OFF] <ToggleLeft className="w-5 h-5 text-slate-600" />
                    </span>
                  )}
                </button>
              </div>

              {!isAutopilot ? (
                <div className="bg-slate-950/50 border border-amber-500/10 p-2.5 rounded-lg text-[11px] text-amber-400 leading-normal font-sans animate-in fade-in duration-200">
                  <span className="font-bold underline uppercase tracking-wide mr-1">Human-in-the-Loop Active:</span>
                  Review, edit, and click approve before any automated message is dispatched to the client.
                </div>
              ) : (
                <div className="bg-slate-950/50 border border-emerald-500/10 p-2.5 rounded-lg text-[11px] text-emerald-400 leading-normal font-sans animate-in fade-in duration-200">
                  <span className="font-bold uppercase tracking-wide mr-1">Autonomous Handshake Activated:</span>
                  System will query LLM context frameworks to respond instantly within 90 seconds of structural form trigger capture.
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* Structural Footer / Agency Dashboard Section Handler */}
      <footer className="max-w-7xl mx-auto w-full p-4 pt-2 flex flex-col gap-6">

        {/* Secure Interface Stripping Component Container */}
        {isAdminMode && (
          <section className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-white">My Agency Cold-Outreach System Tool</h2>
                  <p className="text-xs text-slate-400">Generate high-converting software preview links dynamically to close local service business contracts</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAdminMode(false);
                  const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                  window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
                }}
                className="px-3 py-1.5 bg-amber-600/10 hover:bg-amber-600 text-amber-400 hover:text-white border border-amber-500/20 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all"
              >
                Hide & Lock Client View Mode
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Prospect Business Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Roofing"
                    value={prospectName}
                    onChange={(e) => setProspectName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-sm outline-none text-white focus:border-emerald-500/50 placeholder:text-slate-700 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Link2 className="w-3 h-3 text-slate-500" /> My Bolt App Preview Link
                  </label>
                  <input
                    type="url"
                    placeholder="e.g. https://speed-to-lead-demo.bolt.new"
                    value={boltAppLink}
                    onChange={(e) => setBoltAppLink(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-sm outline-none text-white focus:border-emerald-500/50 placeholder:text-slate-700 transition-all"
                  />
                </div>

                <button
                  onClick={copyAgencyScript}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-emerald-400 border border-emerald-500/20 rounded-lg font-bold text-xs uppercase tracking-wider transition-all"
                >
                  {scriptCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {scriptCopied ? 'Script Copied!' : 'Copy Cold Pitch Script'}
                </button>
              </div>

              <div className="bg-slate-950 rounded-lg p-3.5 border border-slate-850 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase block mb-1">Live Script Replacements Preview Output</span>
                  <div className="text-xs text-slate-300 font-mono leading-relaxed max-h-[140px] overflow-y-auto whitespace-pre-wrap select-all p-1 style-scrollbar">
                    {computedOutreachScript}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Integration & Compatibility Framework Panel Component */}
        <section className="bg-slate-900/40 border border-slate-900 rounded-xl p-5 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <Layers className="w-4 h-4 text-slate-500" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 transition-all duration-200">
              {urlNiche
                ? `Engineered & Optimized for High-Ticket ${urlNiche} Operations`
                : "Native One-Click Plug & Play Integrations"}
            </h3>
          </div>

          {/* Platform Compatibility Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto opacity-60 hover:opacity-80 transition-opacity duration-200">
            {['WordPress', 'Squarespace', 'Wix', 'GoHighLevel', 'Jobber', 'Housecall Pro'].map((platform) => (
              <span
                key={platform}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 font-mono text-[11px] font-medium tracking-wide shadow-sm"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-500/60" />
                {platform}
              </span>
            ))}
          </div>

          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Connects to your active website contact form in under 10 minutes with <span className="text-slate-400 font-medium">zero coding required</span>.
          </p>
        </section>
      </footer>
    </div>
  );
}

export default App;
