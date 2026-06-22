import { useState } from 'react';
import Icon from '@/components/ui/icon';
import FortuneWheel, { Prize } from '@/components/FortuneWheel';
import AdminPanel from '@/components/AdminPanel';

const initialPrizes: Prize[] = [
  { id: '1', label: 'VPN', icon: 'Shield', color: '#FF2E97' },
  { id: '2', label: 'Промокод', icon: 'Ticket', color: '#FFB800' },
  { id: '3', label: 'Админка', icon: 'Crown', color: '#00E5C7' },
  { id: '4', label: 'Стикерсет', icon: 'Sticker', color: '#8B5CF6' },
  { id: '5', label: 'Подарок', icon: 'Gift', color: '#FF6B35' },
  { id: '6', label: 'Бонус', icon: 'Gem', color: '#3B82F6' },
];

const genLink = () =>
  `${window.location.origin}/spin/${Math.random().toString(36).slice(2, 10)}`;

const Index = () => {
  const [view, setView] = useState<'play' | 'admin'>('play');
  const [prizes, setPrizes] = useState<Prize[]>(initialPrizes);
  const [logs, setLogs] = useState<{ prize: string; time: string }[]>([]);
  const [spinLink, setSpinLink] = useState(genLink());
  const [linkUsed, setLinkUsed] = useState(false);

  const handleResult = (prize: Prize) => {
    setLogs((l) => [...l, { prize: prize.label, time: new Date().toISOString() }]);
    setLinkUsed(true);
  };

  const refreshLink = () => {
    setSpinLink(genLink());
    setLinkUsed(false);
  };

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-[0_0_25px_hsl(322_90%_58%/0.6)]">
            <Icon name="Sparkles" size={24} className="text-white" />
          </div>
          <span className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
            Колесо <span className="text-gradient">Фортуны</span>
          </span>
        </div>
        <div className="flex gap-1 rounded-xl bg-secondary/60 p-1">
          {(['play', 'admin'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 font-display text-sm font-semibold uppercase transition ${
                view === v
                  ? 'bg-gradient-to-r from-primary to-accent text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={v === 'play' ? 'Gamepad2' : 'Settings'} size={16} />
              {v === 'play' ? 'Играть' : 'Админка'}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20">
        {view === 'play' ? (
          <div className="animate-fade-in flex flex-col items-center pt-6 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
              <Icon name="Zap" size={14} />
              {linkUsed ? 'Ссылка использована' : 'Доступно 1 вращение'}
            </span>
            <h1 className="mb-3 max-w-2xl font-display text-4xl font-bold uppercase leading-tight text-foreground sm:text-6xl">
              Испытай <span className="text-gradient">удачу</span> прямо сейчас
            </h1>
            <p className="mb-10 max-w-md text-muted-foreground">
              Крути колесо и забирай VPN, промокоды, стикерсеты и другие призы.
            </p>
            <FortuneWheel prizes={prizes} onResult={handleResult} disabled={linkUsed} />
            {linkUsed && (
              <p className="mt-8 text-sm text-muted-foreground">
                Вращение уже использовано. Новая ссылка генерируется в админке.
              </p>
            )}
          </div>
        ) : (
          <div className="animate-fade-in pt-2">
            <h2 className="mb-6 font-display text-3xl font-bold uppercase text-foreground">
              Панель управления
            </h2>
            <AdminPanel
              prizes={prizes}
              setPrizes={setPrizes}
              logs={logs}
              spinLink={spinLink}
              linkUsed={linkUsed}
              onRefreshLink={refreshLink}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
