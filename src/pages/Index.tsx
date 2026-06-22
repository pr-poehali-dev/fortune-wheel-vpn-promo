import { useState } from 'react';
import Icon from '@/components/ui/icon';
import FortuneWheel, { Prize } from '@/components/FortuneWheel';
import AdminPanel from '@/components/AdminPanel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ADMIN_PASSWORD = '230214RuS';

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
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState(false);

  const tryAuth = () => {
    if (pwInput === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError(false);
      setPwInput('');
    } else {
      setPwError(true);
    }
  };

  const openAdmin = () => {
    setView('admin');
  };

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
              onClick={() => (v === 'admin' ? openAdmin() : setView('play'))}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 font-display text-sm font-semibold uppercase transition ${
                view === v
                  ? 'bg-gradient-to-r from-primary to-accent text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon
                name={v === 'play' ? 'Gamepad2' : authed ? 'Settings' : 'Lock'}
                size={16}
              />
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
        ) : !authed ? (
          <div className="animate-scale-in mx-auto mt-16 max-w-sm rounded-3xl border border-border bg-card/60 p-8 text-center backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-[0_0_30px_hsl(322_90%_58%/0.6)]">
              <Icon name="Lock" size={28} className="text-white" />
            </div>
            <h2 className="mb-2 font-display text-2xl font-bold uppercase text-foreground">
              Доступ закрыт
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Введите пароль, чтобы открыть панель управления.
            </p>
            <Input
              type="password"
              value={pwInput}
              autoFocus
              onChange={(e) => {
                setPwInput(e.target.value);
                setPwError(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && tryAuth()}
              placeholder="Пароль"
              className={`mb-3 text-center ${
                pwError ? 'border-destructive ring-1 ring-destructive' : ''
              }`}
            />
            {pwError && (
              <p className="mb-3 text-sm text-destructive">Неверный пароль</p>
            )}
            <Button
              onClick={tryAuth}
              className="w-full gap-2 bg-gradient-to-r from-primary to-accent font-display uppercase text-white"
            >
              <Icon name="LogIn" size={16} />
              Войти
            </Button>
          </div>
        ) : (
          <div className="animate-fade-in pt-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-3xl font-bold uppercase text-foreground">
                Панель управления
              </h2>
              <Button
                variant="secondary"
                onClick={() => {
                  setAuthed(false);
                  setView('play');
                }}
                className="gap-2 font-display uppercase"
              >
                <Icon name="LogOut" size={16} />
                Выйти
              </Button>
            </div>
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