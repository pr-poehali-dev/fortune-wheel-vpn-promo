import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Prize } from './FortuneWheel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SpinLog {
  prize: string;
  time: string;
}

interface AdminPanelProps {
  prizes: Prize[];
  setPrizes: (p: Prize[]) => void;
  logs: SpinLog[];
  spinLink: string;
  linkUsed: boolean;
  onRefreshLink: () => void;
}

const palette = ['#FF2E97', '#FFB800', '#00E5C7', '#8B5CF6', '#FF6B35', '#3B82F6'];
const iconChoices = ['Shield', 'Ticket', 'Crown', 'Sticker', 'Gift', 'Gem'];

const AdminPanel = ({
  prizes,
  setPrizes,
  logs,
  spinLink,
  linkUsed,
  onRefreshLink,
}: AdminPanelProps) => {
  const [tab, setTab] = useState<'prizes' | 'stats' | 'link'>('prizes');
  const [copied, setCopied] = useState(false);

  const total = logs.length;
  const counts = prizes.map((p) => ({
    label: p.label,
    color: p.color,
    n: logs.filter((l) => l.prize === p.label).length,
  }));
  const top = [...counts].sort((a, b) => b.n - a.n)[0];
  const conversion = total > 0 ? Math.round((total / (total + 7)) * 100) : 0;

  const updatePrize = (id: string, field: keyof Prize, value: string) => {
    setPrizes(prizes.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const copyLink = () => {
    navigator.clipboard?.writeText(spinLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const tabs = [
    { id: 'prizes', label: 'Призы', icon: 'Gift' },
    { id: 'stats', label: 'Статистика', icon: 'ChartColumn' },
    { id: 'link', label: 'Ссылка', icon: 'Link' },
  ] as const;

  return (
    <div className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl">
      <div className="mb-6 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-display text-sm font-semibold uppercase tracking-wide transition ${
              tab === t.id
                ? 'bg-gradient-to-r from-primary to-accent text-white'
                : 'bg-secondary/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={t.icon} size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'prizes' && (
        <div className="space-y-3">
          {prizes.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center gap-3 rounded-xl bg-secondary/40 p-3"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ background: p.color }}
              >
                <Icon name={p.icon} size={20} className="text-white" />
              </div>
              <Input
                value={p.label}
                onChange={(e) => updatePrize(p.id, 'label', e.target.value)}
                className="w-40 flex-1 border-border bg-background/60"
              />
              <div className="flex gap-1">
                {iconChoices.map((ic) => (
                  <button
                    key={ic}
                    onClick={() => updatePrize(p.id, 'icon', ic)}
                    className={`rounded-md p-1.5 ${
                      p.icon === ic ? 'bg-primary/30 ring-1 ring-primary' : 'bg-background/40'
                    }`}
                  >
                    <Icon name={ic} size={14} />
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                {palette.map((c) => (
                  <button
                    key={c}
                    onClick={() => updatePrize(p.id, 'color', c)}
                    className={`h-6 w-6 rounded-full transition ${
                      p.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-card' : ''
                    }`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'stats' && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <StatCard icon="RotateCw" label="Вращений" value={String(total)} />
            <StatCard icon="Trophy" label="Топ-приз" value={top?.n ? top.label : '—'} />
            <StatCard icon="TrendingUp" label="Конверсия" value={`${conversion}%`} />
          </div>
          <div className="space-y-2">
            {counts.map((c) => (
              <div key={c.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-foreground">{c.label}</span>
                  <span className="text-muted-foreground">{c.n}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-secondary/60">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: total ? `${(c.n / total) * 100}%` : '0%',
                      background: c.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'link' && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Одноразовая ссылка даёт ровно одно вращение. После использования сгенерируйте новую.
          </p>
          <div className="flex items-center gap-2 rounded-xl bg-secondary/40 p-3">
            <Icon name="Link" size={18} className="shrink-0 text-accent" />
            <code className="flex-1 truncate text-sm text-foreground">{spinLink}</code>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                linkUsed
                  ? 'bg-destructive/20 text-destructive'
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              {linkUsed ? 'Использована' : 'Активна'}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={copyLink}
              variant="secondary"
              className="flex-1 gap-2 font-display uppercase"
            >
              <Icon name={copied ? 'Check' : 'Copy'} size={16} />
              {copied ? 'Скопировано' : 'Копировать'}
            </Button>
            <Button
              onClick={onRefreshLink}
              className="flex-1 gap-2 bg-gradient-to-r from-primary to-accent font-display uppercase text-white"
            >
              <Icon name="RefreshCw" size={16} />
              Новая ссылка
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="rounded-2xl bg-secondary/40 p-4">
    <Icon name={icon} size={20} className="mb-2 text-accent" />
    <p className="font-display text-xl font-bold uppercase text-foreground">{value}</p>
    <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
  </div>
);

export default AdminPanel;
