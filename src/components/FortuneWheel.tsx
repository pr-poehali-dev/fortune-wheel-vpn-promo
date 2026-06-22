import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';

export interface Prize {
  id: string;
  label: string;
  icon: string;
  color: string;
}

interface FortuneWheelProps {
  prizes: Prize[];
  onResult?: (prize: Prize) => void;
  disabled?: boolean;
}

const FortuneWheel = ({ prizes, onResult, disabled }: FortuneWheelProps) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Prize | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const segAngle = 360 / prizes.length;

  const spin = () => {
    if (spinning || disabled) return;
    setSpinning(true);
    setWinner(null);

    const winIndex = Math.floor(Math.random() * prizes.length);
    const targetCenter = winIndex * segAngle + segAngle / 2;
    const fullTurns = 360 * (5 + Math.floor(Math.random() * 3));
    const final = rotation + fullTurns + (360 - targetCenter);
    setRotation(final);

    setTimeout(() => {
      setSpinning(false);
      setWinner(prizes[winIndex]);
      onResult?.(prizes[winIndex]);
    }, 5200);
  };

  const gradient = `conic-gradient(${prizes
    .map((p, i) => `${p.color} ${i * segAngle}deg ${(i + 1) * segAngle}deg`)
    .join(', ')})`;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        {/* Pointer */}
        <div className="absolute left-1/2 -top-3 z-20 -translate-x-1/2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
          <div className="h-0 w-0 border-l-[18px] border-r-[18px] border-t-[34px] border-l-transparent border-r-transparent border-t-accent" />
        </div>

        {/* Wheel */}
        <div className="neon-ring rounded-full p-1">
          <div
            ref={wheelRef}
            className="relative h-[340px] w-[340px] rounded-full sm:h-[420px] sm:w-[420px]"
            style={{
              background: gradient,
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? 'transform 5.2s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
                : 'none',
            }}
          >
            {prizes.map((p, i) => {
              const angle = i * segAngle + segAngle / 2;
              return (
                <div
                  key={p.id}
                  className="absolute left-1/2 top-1/2 origin-left"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div className="flex -translate-y-1/2 items-center gap-2 pl-12 font-display font-semibold uppercase tracking-wide text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                    <Icon name={p.icon} size={20} className="text-white" />
                    <span className="text-sm sm:text-base">{p.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center button */}
        <button
          onClick={spin}
          disabled={spinning || disabled}
          className="absolute left-1/2 top-1/2 z-10 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent font-display text-lg font-bold uppercase text-white shadow-[0_0_40px_hsl(322_90%_58%/0.7)] transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-80"
        >
          {spinning ? (
            <Icon name="Loader2" className="animate-spin" size={32} />
          ) : (
            <>
              <Icon name="Sparkles" size={22} />
              <span className="mt-0.5 text-xs">Крутить</span>
            </>
          )}
        </button>
      </div>

      {winner && (
        <div className="animate-scale-in flex items-center gap-3 rounded-2xl border border-accent/40 bg-card/80 px-6 py-4 backdrop-blur">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ background: winner.color }}
          >
            <Icon name={winner.icon} size={26} className="text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Ваш приз
            </p>
            <p className="font-display text-xl font-bold uppercase text-gradient">
              {winner.label}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FortuneWheel;
