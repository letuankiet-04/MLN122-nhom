import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const SupplyDemandSimulator: React.FC = () => {
  // Shifts: -50 to +50
  const [demandShift, setDemandShift] = useState<number>(20);
  const [supplyShift, setSupplyShift] = useState<number>(0);

  const qEquilibrium = Math.max(10, Math.min(90, (80 + demandShift + supplyShift) / 1.6));
  const pEquilibrium = Math.max(10, Math.min(95, 20 - supplyShift + 0.8 * qEquilibrium));

  const baseP = 50;
  const baseQ = 50;
  const priceChangePercent = ((pEquilibrium - baseP) / baseP) * 100;
  const quantityChangePercent = ((qEquilibrium - baseQ) / baseQ) * 100;

  // Preset scenarios
  const applyScenario = (preset: 'normal' | 'tet-demand' | 'spring-harvest' | 'hcm-intervention') => {
    switch (preset) {
      case 'normal':
        setDemandShift(0);
        setSupplyShift(0);
        break;
      case 'tet-demand':
        setDemandShift(35);
        setSupplyShift(0);
        break;
      case 'spring-harvest':
        setDemandShift(10);
        setSupplyShift(35);
        break;
      case 'hcm-intervention':
        setDemandShift(35);
        setSupplyShift(30);
        break;
    }
  };

  return (
    <div className="bg-surface border border-theme-subtle rounded-2xl p-5 md:p-6 shadow-theme-card my-6 transition-colors">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-theme-subtle">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-theme-secondary uppercase">
              Mô phỏng tương tác · Cơ chế cân bằng thị trường
            </span>
          </div>
          <h4 className="text-lg font-bold text-theme-heading mt-1">
            Mô phỏng tương tác Đồ thị Cung – Cầu (Supply & Demand)
          </h4>
          <p className="text-xs text-theme-muted mt-0.5">
            Di chuyển các thanh trượt để quan sát phản ứng tức thì của điểm cân bằng giá cả (P*) và sản lượng (Q*).
          </p>
        </div>

        {/* Preset Scenarios */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => applyScenario('normal')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface-subtle border border-theme-subtle text-theme-heading hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Trạng thái chuẩn
          </button>
          <button
            type="button"
            onClick={() => applyScenario('tet-demand')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            Tết: Cầu thịt lợn tăng
          </button>
          <button
            type="button"
            onClick={() => applyScenario('spring-harvest')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer"
          >
            Đông Xuân: Rau dồi dào
          </button>
          <button
            type="button"
            onClick={() => applyScenario('hcm-intervention')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors cursor-pointer"
          >
            TP.HCM trữ 8.000 tỷ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
        {/* SVG Dynamic Coordinate Plane */}
        <div className="lg:col-span-7 bg-surface-subtle rounded-2xl p-4 border border-theme-subtle relative transition-colors">
          <div className="flex justify-between items-center text-xs text-theme-muted mb-2 px-1">
            <span className="font-bold text-theme-heading">Đồ thị P-Q (Price vs Quantity)</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold">
                <span className="w-2.5 h-0.5 bg-blue-600 dark:text-blue-400 inline-block"></span> Đường Cầu (D)
              </span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-2.5 h-0.5 bg-emerald-600 dark:text-emerald-400 inline-block"></span> Đường Cung (S)
              </span>
            </div>
          </div>

          <div className="w-full aspect-[4/3] max-h-[320px] relative">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="12" y1="10" x2="12" y2="88" stroke="currentColor" strokeWidth="0.8" className="text-slate-300 dark:text-slate-700" />
              <line x1="12" y1="88" x2="95" y2="88" stroke="currentColor" strokeWidth="0.8" className="text-slate-300 dark:text-slate-700" />

              {/* Axis Labels */}
              <text x="6" y="14" fill="currentColor" className="text-[4px] font-bold text-slate-500">Giá (P)</text>
              <text x="90" y="93" fill="currentColor" className="text-[4px] font-bold text-slate-500">Lượng (Q)</text>

              {/* Demand Curve */}
              <line
                x1="18"
                y1={Math.max(12, Math.min(84, 100 - (100 + demandShift - 0.8 * 18)))}
                x2="88"
                y2={Math.max(12, Math.min(84, 100 - (100 + demandShift - 0.8 * 88)))}
                stroke="#2563EB"
                strokeWidth="2.2"
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              <text x="89" y={Math.max(14, Math.min(84, 100 - (100 + demandShift - 0.8 * 88)))} fill="#2563EB" className="text-[4px] font-bold">
                D
              </text>

              {/* Supply Curve */}
              <line
                x1="18"
                y1={Math.max(12, Math.min(84, 100 - (20 - supplyShift + 0.8 * 18)))}
                x2="88"
                y2={Math.max(12, Math.min(84, 100 - (20 - supplyShift + 0.8 * 88)))}
                stroke="#059669"
                strokeWidth="2.2"
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              <text x="89" y={Math.max(14, Math.min(84, 100 - (20 - supplyShift + 0.8 * 88)))} fill="#059669" className="text-[4px] font-bold">
                S
              </text>

              {/* Dashed projections to axes */}
              {(() => {
                const cx = 12 + (qEquilibrium / 100) * 78;
                const cy = 88 - (pEquilibrium / 100) * 75;
                return (
                  <>
                    <line x1="12" y1={cy} x2={cx} y2={cy} stroke="#7C3AED" strokeWidth="0.75" strokeDasharray="1.5,1.5" />
                    <line x1={cx} y1={cy} x2={cx} y2="88" stroke="#7C3AED" strokeWidth="0.75" strokeDasharray="1.5,1.5" />
                    
                    {/* Equilibrium Point */}
                    <circle cx={cx} cy={cy} r="2.8" fill="#7C3AED" />
                    <circle cx={cx} cy={cy} r="1.4" fill="#FFFFFF" />
                    <text x={cx + 3} y={cy - 2} fill="#7C3AED" className="text-[4.5px] font-bold">
                      E* (P*, Q*)
                    </text>
                  </>
                );
              })()}
            </svg>
          </div>

          <div className="mt-2 text-center text-[11px] text-theme-muted font-mono">
            * Minh họa nguyên lý cân bằng thị trường. Trục tung P (Giá cả), trục hoành Q (Sản lượng).
          </div>
        </div>

        {/* Sliders and Market Readout */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Demand Slider */}
            <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 rounded-xl">
              <div className="flex justify-between items-center text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">
                <label htmlFor="demand-range">Dịch chuyển Đường Cầu (Demand Shift):</label>
                <span className="font-mono tabular-nums">{demandShift > 0 ? `+${demandShift}` : demandShift}%</span>
              </div>
              <input
                id="demand-range"
                type="range"
                min="-30"
                max="40"
                value={demandShift}
                onChange={(e) => setDemandShift(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-theme-muted mt-1 font-mono">
                <span>Giảm sức mua</span>
                <span>Chuẩn</span>
                <span>Tết / Cầu tăng</span>
              </div>
            </div>

            {/* Supply Slider */}
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-xl">
              <div className="flex justify-between items-center text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                <label htmlFor="supply-range">Dịch chuyển Đường Cung (Supply Shift):</label>
                <span className="font-mono tabular-nums">{supplyShift > 0 ? `+${supplyShift}` : supplyShift}%</span>
              </div>
              <input
                id="supply-range"
                type="range"
                min="-30"
                max="40"
                value={supplyShift}
                onChange={(e) => setSupplyShift(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-theme-muted mt-1 font-mono">
                <span>Thiếu hàng / Gián đoạn</span>
                <span>Chuẩn</span>
                <span>Bội thu / Mở rộng</span>
              </div>
            </div>
          </div>

          {/* Equilibrium Readout Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-surface-subtle border border-theme-subtle rounded-xl">
              <span className="text-theme-muted text-[11px] block">Mức giá cân bằng (P*):</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-lg font-black font-mono text-theme-heading tabular-nums">
                  {pEquilibrium.toFixed(1)}
                </span>
                <span className={`text-[11px] font-bold flex items-center font-mono ${
                  priceChangePercent > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}>
                  {priceChangePercent > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {priceChangePercent > 0 ? `+${priceChangePercent.toFixed(1)}%` : `${priceChangePercent.toFixed(1)}%`}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-surface-subtle border border-theme-subtle rounded-xl">
              <span className="text-theme-muted text-[11px] block">Sản lượng cân bằng (Q*):</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-lg font-black font-mono text-theme-heading tabular-nums">
                  {qEquilibrium.toFixed(1)}
                </span>
                <span className={`text-[11px] font-bold flex items-center font-mono ${
                  quantityChangePercent >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {quantityChangePercent >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {quantityChangePercent >= 0 ? `+${quantityChangePercent.toFixed(1)}%` : `${quantityChangePercent.toFixed(1)}%`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
