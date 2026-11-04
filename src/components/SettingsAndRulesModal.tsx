import React, { useState } from 'react';
import { X, Volume2, VolumeX, Zap, Shield, BookOpen, Sliders, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface SettingsAndRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDeckBrowser: () => void;
}

export const SettingsAndRulesModal: React.FC<SettingsAndRulesModalProps> = ({
  isOpen,
  onClose,
  onOpenDeckBrowser,
}) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'settings'>('rules');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(sounds.isEnabled());
  const [animSpeed, setAnimSpeed] = useState<'normal' | 'fast' | 'turbo'>('normal');

  if (!isOpen) return null;

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setEnabled(next);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Regler och Inställningar"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#090d16] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 0 45px rgba(0, 240, 255, 0.25), inset 0 0 25px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-cyan-500/20 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('rules')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs sm:text-sm font-bold border transition-colors ${
                activeTab === 'rules'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                  : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Skitgubbe Spelregler
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs sm:text-sm font-bold border transition-colors ${
                activeTab === 'settings'
                  ? 'bg-pink-500/20 border-pink-400 text-pink-200'
                  : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4 text-pink-400" />
              Inställningar
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Stäng inställningar och regler"
            className="p-2 rounded-lg bg-black/60 hover:bg-pink-950 text-white/80 hover:text-pink-400 border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6">
          {activeTab === 'rules' ? (
            <div className="space-y-5 text-slate-300 font-sans text-sm">
              {/* Introduction banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/60 to-purple-950/60 border border-cyan-500/30">
                <h3 className="text-base font-bold text-cyan-300 font-mono flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  Målet: Bli av med alla dina kort!
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Skitgubbe (även känt som Vändtia eller Mas) är Sveriges mest klassiska kortspel. Den som först blir tom på kort vinner, och den spelare som sist blir kvar med kort på hand blir omgångens <strong className="text-pink-400 font-mono">Skitgubbe</strong>!
                </p>
              </div>

              {/* Step 1: Given & Förberedelse */}
              <div className="border-l-2 border-cyan-400 pl-4 space-y-1.5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                  1. Utdelning & Förberedelse (Byte)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Varje spelare tilldelas <strong>3 dolda kort</strong> på bordet, <strong>3 öppna kort</strong> direkt ovanpå dem, samt <strong>3 kort på handen</strong>. Resten av kortleken utgör talongen (draghögen).
                </p>
                <p className="text-xs text-cyan-200/90 bg-cyan-950/30 p-2 rounded border border-cyan-500/20">
                  💡 <em>Taktiskt tips:</em> Under förberedelsefasen kan du byta kort mellan din hand och dina öppna kort. Spara dina högsta kort (Ess, Kungar) och specialkort (10:or, 2:or) som öppna kort till slutspelet!
                </p>
              </div>

              {/* Step 2: Spelets gång */}
              <div className="border-l-2 border-pink-400 pl-4 space-y-1.5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-pink-300 font-bold">
                  2. Spelets gång & Färg/Valör
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Spelaren vars tur det är måste lägga ett kort som har <strong>samma eller högre valör</strong> än det översta kortet i slänghögen. Färgerna har ingen rangordning. Du kan lägga flera kort av samma valör samtidigt (t.ex. två sjuor).
                </p>
                <p className="text-xs text-slate-300">
                  När du har lagt kort drar du nya från talongen så du alltid har minst 3 kort på hand så länge draghögen räcker.
                </p>
              </div>

              {/* Step 3: Specialkort */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-400/40">
                  <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-cyan-300 mb-1">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    TVÅAN (NOLLSTÄLLARE)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Kan spelas på <em>vilket kort som helst</em>! Nollställer högens värde så nästa spelare kan lägga vilket kort som helst.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-pink-950/40 border border-pink-500/40">
                  <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-pink-300 mb-1">
                    <Shield className="w-4 h-4 text-pink-400" />
                    TIAN (BRÄNNARE)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Kan spelas på alla kort! <strong>Bränner bort hela högen</strong> ur spelet och ger dig genast ett nytt valfritt drag!
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-xs text-slate-300">
                <strong className="text-amber-300 font-mono">FYRTAL BRÄNNER:</strong> Om 4 kort av samma valör spelas i rad på slänghögen brinner den också automatiskt, och spelaren får börja om på nytt!
              </div>

              {/* Step 4: Chansa eller Ta upp */}
              <div className="border-l-2 border-emerald-400 pl-4 space-y-1.5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold">
                  3. Kan du inte lägga? Chansa eller Ta upp!
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Om du inte har något giltigt kort kan du välja att <strong>Chansa</strong> och dra det översta kortet från talongen. Om kortet är giltigt spelas det. Om det är för lågt måste du ta upp både kortet och hela slänghögen till din hand!
                </p>
                <p className="text-xs text-slate-300">
                  Är talongen tom måste du ta upp hela slänghögen till handen direkt.
                </p>
              </div>

              {/* Step 5: Slutspel */}
              <div className="border-l-2 border-purple-400 pl-4 space-y-1.5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold">
                  4. Slutspel (Öppna och Dolda kort)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  När talongen och dina handkort är helt slut börjar du spela från dina <strong>3 öppna kort</strong> på bordet. När även de är slut vänder du på måfå ett av dina <strong>3 dolda kort</strong>. Är det giltigt är det spelat; om inte, tar du upp kortet och hela slänghögen på hand och måste spela ut dem innan du får röra nästa dolda kort!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-slate-200">
              {/* Sound Effect Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/10">
                <div className="flex items-center gap-3">
                  {soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-slate-500" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold font-mono text-white">
                      Cybernetiska Ljudeffekter (SFX)
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      Web Audio synthesizers för kortvändningar, bränningar och laser-cue
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleSound}
                  className={`px-4 py-2 rounded-lg font-mono text-xs font-bold border transition-colors ${
                    soundEnabled
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                      : 'bg-black/60 border-white/15 text-slate-400'
                  }`}
                >
                  {soundEnabled ? 'PÅSLAGET' : 'AVSTÄNGT'}
                </button>
              </div>

              {/* Animation Speed */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                <div>
                  <h4 className="text-sm font-bold font-mono text-white">
                    Animationshastighet
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    Styr hur snabbt datorns drag och kortvändningar animeras
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['normal', 'fast', 'turbo'] as const).map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => setAnimSpeed(spd)}
                      className={`py-2 px-3 rounded-lg font-mono text-xs font-bold border transition-all ${
                        animSpeed === spd
                          ? 'bg-pink-500/25 border-pink-400 text-pink-200 shadow-sm'
                          : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {spd === 'normal' && 'Normal (600ms)'}
                      {spd === 'fast' && 'Snabb (300ms)'}
                      {spd === 'turbo' && 'Turbo (100ms)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card deck browser link */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 to-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold font-mono text-cyan-200">
                    Inspektera alla 52 Cyber-Kort
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    Öppna kortleksdatabasen med fullt zoom-stöd för ansiktsdetaljer
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDeckBrowser();
                  }}
                  className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400 text-xs font-mono font-bold transition-colors"
                >
                  Öppna Kortex
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
