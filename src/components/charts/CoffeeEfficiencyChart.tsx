import React, { useState } from 'react';
import { COFFEE_METRICS } from '../../data/lessonsData';
import { Info, ExternalLink, TrendingUp } from 'lucide-react';

export const CoffeeEfficiencyChart: React.FC<{ onOpenPdf?: (page: number) => void }> = ({ onOpenPdf }) => {
  const [selectedMetricIndex, setSelectedMetricIndex] = useState<number>(4); // Default to Gross Profit
  const metric = COFFEE_METRICS[selectedMetricIndex];

  const maxVal = Math.max(metric.scValue, metric.nonScValue) * 1.15;
  const scHeightPercent = (metric.scValue / maxVal) * 100;
  const nonScHeightPercent = (metric.nonScValue / maxVal) * 100;

  return (
    <div className="bg-surface border border-theme-subtle rounded-2xl p-5 md:p-6 shadow-theme-card my-6 transition-colors">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-theme-subtle">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-theme-primary uppercase">
              Thực nghiệm kinh tế · Nghiên cứu 2019
            </span>
            <span className="text-theme-faint">·</span>
            <button
              type="button"
              onClick={() => onOpenPdf?.(2)}
              className="text-xs text-theme-muted hover:text-theme-primary inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              PDF Trang 2-3 <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          <h4 className="text-lg font-bold text-theme-heading mt-1">
            So sánh hiệu quả sản xuất cà phê giữa hai nhóm hộ tại Việt Nam
          </h4>
          <p className="text-xs text-theme-muted mt-0.5">
            Nguồn: Tạp chí <em>Economies</em> (2019) · Nguyen Hung Anh et al. (Tây Nguyên)
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap gap-1 p-1 bg-surface-subtle border border-theme-subtle rounded-xl">
          {COFFEE_METRICS.map((m, idx) => (
            <button
              key={m.metric}
              type="button"
              onClick={() => setSelectedMetricIndex(idx)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedMetricIndex === idx
                  ? 'bg-surface text-theme-primary shadow-xs font-bold'
                  : 'text-theme-muted hover:text-theme-heading'
              }`}
            >
              {m.metric.split(' ')[0]} {m.metric.includes('Lợi nhuận') ? 'Lợi nhuận' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart Graphic & Comparison Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-center">
        {/* Dynamic Bar Visualizer */}
        <div className="lg:col-span-7 flex flex-col justify-end bg-surface-subtle rounded-2xl p-5 border border-theme-subtle min-h-[290px] transition-colors">
          <div className="text-center mb-4">
            <span className="text-sm font-bold text-theme-heading">
              {metric.metric} ({metric.unit})
            </span>
          </div>

          <div className="grid grid-cols-2 gap-8 items-end h-44 px-6 pb-2 border-b border-theme-subtle">
            {/* SC Bar */}
            <div className="flex flex-col items-center h-full justify-end group">
              <div className="mb-2 text-center">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block tabular-nums">
                  {metric.scValue.toLocaleString('vi-VN')} {metric.unit}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  {metric.diffPercent}
                </span>
              </div>
              <div
                style={{ height: `${scHeightPercent}%` }}
                className="w-full max-w-[88px] bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-xl transition-all duration-500 shadow-xs relative group-hover:brightness-110"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl" />
              </div>
              <span className="text-xs font-bold text-theme-heading mt-2.5 text-center">
                Có chứng nhận (SC)
              </span>
            </div>

            {/* Non-SC Bar */}
            <div className="flex flex-col items-center h-full justify-end group">
              <div className="mb-2 text-center">
                <span className="text-xs font-medium text-theme-muted block tabular-nums">
                  {metric.nonScValue.toLocaleString('vi-VN')} {metric.unit}
                </span>
                <span className="text-[10px] text-theme-faint">Đối chứng</span>
              </div>
              <div
                style={{ height: `${nonScHeightPercent}%` }}
                className="w-full max-w-[88px] bg-gradient-to-t from-slate-400 to-slate-500 dark:from-slate-600 dark:to-slate-700 rounded-t-xl transition-all duration-500 shadow-xs relative group-hover:brightness-110"
              />
              <span className="text-xs font-medium text-theme-muted mt-2.5 text-center">
                Không chứng nhận (Non-SC)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-theme-muted pt-2.5 px-2">
            <span>Khảo sát hộ nông dân cà phê Tây Nguyên (Đắk Lắk, Lâm Đồng)</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              Chênh lệch: {metric.diffPercent}
            </span>
          </div>
        </div>

        {/* Detailed Insights & Theoretical Link */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 mb-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>Liên hệ với quy luật giá trị:</span>
            </div>
            <p className="text-xs text-theme-body leading-relaxed">
              {metric.note}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 bg-surface-subtle border border-theme-subtle rounded-xl">
              <div className="text-theme-muted text-[11px]">Lợi nhuận gộp SC:</div>
              <div className="font-bold text-theme-heading text-sm tabular-nums mt-0.5">
                68,366 <span className="text-[10px] font-normal text-theme-muted">tr.đ/ha</span>
              </div>
            </div>
            <div className="p-3 bg-surface-subtle border border-theme-subtle rounded-xl">
              <div className="text-theme-muted text-[11px]">Chênh lệch ròng:</div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm tabular-nums mt-0.5">
                +11,603 <span className="text-[10px] font-normal">tr.đ (+20,4%)</span>
              </div>
            </div>
          </div>

          {/* Academic Caution Box */}
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-900 dark:text-amber-300 leading-relaxed">
              <strong>Lưu ý từ tài liệu gốc:</strong> Số liệu là bằng chứng thực nghiệm dùng để liên hệ với quy luật giá trị, nhưng <em>chưa đủ để khẳng định riêng quy luật giá trị là nguyên nhân duy nhất tạo ra chênh lệch</em>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
