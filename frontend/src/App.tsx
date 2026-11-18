import React, { useState, useEffect } from 'react';
import { Coffee, Sparkles, CheckCircle2, Server, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import axios from 'axios';

interface HealthCheckData {
  status: string;
  uptime: number;
  timestamp: string;
  service: string;
}

export const App: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [healthData, setHealthData] = useState<HealthCheckData | null>(null);

  const checkBackendHealth = async () => {
    setBackendStatus('checking');
    try {
      const response = await axios.get('http://localhost:5000/api/health', { timeout: 3000 });
      if (response.data && response.data.success) {
        setBackendStatus('connected');
        setHealthData(response.data.data);
      } else {
        setBackendStatus('disconnected');
      }
    } catch {
      setBackendStatus('disconnected');
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <div className="min-h-screen bg-coffee-cream text-coffee-dark flex flex-col justify-between p-6 md:p-12 selection:bg-coffee-orange selection:text-white">
      {/* Top Navigation Bar Preview */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4 border-b border-coffee-beige">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-coffee-orange flex items-center justify-center text-white shadow-subtle">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight text-coffee-dark">Coffeelo</span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold uppercase tracking-wider text-coffee-brown px-2 py-0.5 bg-coffee-beige rounded-full">
              Specialty Coffee
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-coffee-dark border border-coffee-beige shadow-sm">
            <span className={`w-2 h-2 rounded-full ${backendStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : backendStatus === 'checking' ? 'bg-amber-500' : 'bg-rose-500'}`} />
            Backend: {backendStatus === 'connected' ? 'Online' : backendStatus === 'checking' ? 'Checking...' : 'Offline (Start backend)'}
          </span>
        </div>
      </header>

      {/* Main Hero & Foundation Status */}
      <main className="max-w-6xl mx-auto w-full my-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brand & Phase 1 Intro */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-coffee-warm-beige/50 border border-coffee-beige text-xs font-bold uppercase tracking-wider text-coffee-brown">
              <Sparkles className="w-3.5 h-3.5 text-coffee-orange" />
              Phase 1 — Project Setup & UI Foundation
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-coffee-dark leading-[1.1]">
              Modern Specialty Coffee, <br />
              <span className="text-coffee-orange">Production-Grade</span> Architecture.
            </h1>

            <p className="text-lg text-coffee-brown max-w-xl leading-relaxed">
              Fondasi full-stack web application <strong>Coffeelo</strong> siap digunakan. Dilengkapi standar monorepo modern, Tailwind CSS dengan palet warna brand resmi, TypeScript type safety, dan health check integration.
            </p>

            {/* Design System Color Swatches */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-coffee-dark/70">
                Brand Color Palette
              </p>
              <div className="grid grid-cols-6 gap-2 max-w-md">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-coffee-cream border border-coffee-beige shadow-sm" />
                  <span className="text-[10px] font-medium mt-1 text-coffee-dark">Cream</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-coffee-dark shadow-sm" />
                  <span className="text-[10px] font-medium mt-1 text-coffee-dark">Dark</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-coffee-brown shadow-sm" />
                  <span className="text-[10px] font-medium mt-1 text-coffee-dark">Brown</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-coffee-orange shadow-sm" />
                  <span className="text-[10px] font-medium mt-1 text-coffee-dark">Orange</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-coffee-beige shadow-sm" />
                  <span className="text-[10px] font-medium mt-1 text-coffee-dark">Beige</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-coffee-white border border-coffee-beige shadow-sm" />
                  <span className="text-[10px] font-medium mt-1 text-coffee-dark">White</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={checkBackendHealth}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-coffee-orange text-white font-semibold text-sm hover:bg-coffee-orange/90 transition shadow-card hover:shadow-elevation active:scale-95"
              >
                <Server className="w-4 h-4" />
                Test Backend Connection
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Foundation Checklist Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-coffee-beige shadow-card space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-coffee-beige/60">
                <div>
                  <h3 className="font-bold text-lg text-coffee-dark">Phase 1 Checklist</h3>
                  <p className="text-xs text-coffee-brown">Setup & UI Foundation Status</p>
                </div>
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>

              <div className="space-y-3.5 text-sm">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-medium text-coffee-dark">React 18 + Vite + TypeScript Frontend</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-medium text-coffee-dark">Tailwind CSS Custom Coffee Palette</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-medium text-coffee-dark">Node.js + Express + TypeScript Backend</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-medium text-coffee-dark">Prisma ORM Schema & Database Spec</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-medium text-coffee-dark">Health Check API (`/api/health`)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-medium text-coffee-dark">Git Repository & .gitignore Setup</span>
                </div>
              </div>

              {/* Live Backend Response Inspector */}
              <div className="p-4 rounded-2xl bg-coffee-cream/60 border border-coffee-beige text-xs space-y-2">
                <div className="flex items-center justify-between text-coffee-dark font-semibold">
                  <span>Backend Live Response</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${backendStatus === 'connected' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {backendStatus.toUpperCase()}
                  </span>
                </div>
                {healthData ? (
                  <pre className="text-[11px] font-mono text-coffee-dark/80 bg-white/70 p-2.5 rounded-xl overflow-x-auto border border-coffee-beige/50">
                    {JSON.stringify(healthData, null, 2)}
                  </pre>
                ) : (
                  <p className="text-coffee-brown text-xs italic">
                    Jalankan backend dengan <code className="bg-white px-1.5 py-0.5 rounded border border-coffee-beige font-mono text-coffee-dark">npm run dev</code> di folder backend untuk melihat data real-time.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full pt-8 border-t border-coffee-beige flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-coffee-brown">
        <p>© 2026 Coffeelo. Modern Specialty Coffee E-Commerce.</p>
        <p className="flex items-center gap-1 font-medium">
          Crafted with care <Heart className="w-3.5 h-3.5 text-coffee-orange fill-coffee-orange" /> for Coffee Enthusiasts
        </p>
      </footer>
    </div>
  );
};

export default App;
