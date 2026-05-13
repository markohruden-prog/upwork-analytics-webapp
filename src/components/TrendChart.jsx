import { memo, useMemo } from 'react';
import { T } from '../lib/theme.js';
import { getCumulative } from '../lib/aggregation.js';

export const TrendChart = memo(function TrendChart({ records, selectedId, onSelect, theme }) {
  const W = 720, H = 180, padX = 32, padY = 32;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;

  const { data, maxV, pathD } = useMemo(() => {
    const data = records.map(r => ({ id: r.id, label: r.label, value: getCumulative(r).submitted }));
    const maxV = Math.max(...data.map(d => d.value), 1);
    const xAt = i => data.length === 1 ? W / 2 : padX + i / (data.length - 1) * innerW;
    const yAt = v => padY + innerH - v / maxV * innerH;
    const pathD = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yAt(d.value)}`).join(' ');
    return { data, maxV, pathD };
  }, [records, innerW, innerH]);

  const xAt = i => data.length === 1 ? W / 2 : padX + i / (data.length - 1) * innerW;
  const yAt = v => padY + innerH - v / maxV * innerH;

  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: 'block', overflow: 'visible' }}>
        <line x1={padX} y1={padY + innerH} x2={W - padX} y2={padY + innerH} stroke={theme.border} strokeWidth="1" />
        {[0, 0.5, 1].map(t => (
          <text key={t} x={padX - 8} y={yAt(maxV * t) + 4}
            textAnchor="end" fill={theme.fg3}
            style={{ fontFamily: T.fontEditorial, fontStyle: 'italic', fontSize: 10 }}>
            {Math.round(maxV * t)}
          </text>
        ))}
        <path d={pathD} fill="none" stroke={theme.fg1} strokeWidth="1.5" strokeLinecap="round" />
        {data.map((d, i) => {
          const active = d.id === selectedId;
          return (
            <g key={d.id} style={{ cursor: 'pointer' }} onClick={() => onSelect(d.id)}>
              <circle cx={xAt(i)} cy={yAt(d.value)} r={active ? 6 : 4}
                fill={active ? theme.accent : theme.fg1}
                stroke={theme.bg} strokeWidth="2" />
              <text x={xAt(i)} y={yAt(d.value) - 14}
                textAnchor="middle"
                fill={active ? theme.fg1 : theme.fg2}
                style={{ fontFamily: T.fontDisplay, fontWeight: 700, fontSize: active ? 18 : 14 }}>
                {d.value}
              </text>
              <text x={xAt(i)} y={H - 8}
                textAnchor="middle"
                fill={theme.fg2}
                style={{ fontFamily: T.fontEditorial, fontStyle: 'italic', fontSize: 11 }}>
                {d.label.split(' (')[0]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
});
