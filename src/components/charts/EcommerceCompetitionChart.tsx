import React, { useState } from 'react';
import { ExternalLink, TrendingUp, ShoppingBag, Video, ShieldCheck } from 'lucide-react';

export const EcommerceCompetitionChart: React.FC<{ onOpenPdf?: (page: number) => void }> = ({ onOpenPdf }) => {
  const [activeTab, setActiveTab] = useState<'market_share' | 'growth'>('market_share');

  return (
    <div className="bg-surface border border-theme-subtle rounded-2xl p-5 md:p-6 shadow-theme-card my-6 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-theme-subtle">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
              Thực tế cạnh tranh TMĐT · Năm 2024
            </span>
            <span className="text-theme-faint">·</span>
            <button
              type="button"
              onClick={() => onOpenPdf?.(7)}
              className="text-xs text-theme-muted hover:text-theme-primary inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              PDF Trang 7-8 <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          <h4 className="text-lg font-bold text-theme-heading mt-1">
            Cạnh tranh giữa Shopee và TikTok Shop tại Việt Nam
          </h4>
          <p className="text-xs text-theme-muted mt-0.5">
            Nguồn: Báo cáo YouNet ECI được VCCI dẫn lại (2025) · Tổng GMV 4 sàn đạt 13,82 tỷ USD
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex p-1 bg-surface-subtle border border-theme-subtle rounded-xl self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('market_share')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'market_share'
                ? 'bg-surface text-theme-heading shadow-xs font-bold'
                : 'text-theme-muted hover:text-theme-heading'
            }`}
          >
            Thị phần & GMV 2024
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('growth')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'growth'
                ? 'bg-surface text-theme-heading shadow-xs font-bold'
                : 'text-theme-muted hover:text-theme-heading'
            }`}
          >
            Tăng trưởng GMV (%)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-center">
        {/* Dynamic Comparison Visualizer */}
        <div className="lg:col-span-7 bg-surface-subtle rounded-2xl p-5 border border-theme-subtle transition-colors">
          <div className="flex justify-between items-center text-xs font-bold text-theme-heading mb-6">
            <span>{activeTab === 'market_share' ? 'So sánh Thị phần GMV (%)' : 'Tốc độ tăng trưởng so với năm 2023 (%)'}</span>
            <span className="text-theme-muted text-[11px] font-mono">Đơn vị: %</span>
          </div>

          <div className="grid grid-cols-2 gap-8 items-end h-48 px-6 pb-2 border-b border-theme-subtle">
            {/* Shopee */}
            <div className="flex flex-col items-center h-full justify-end group">
              <div className="mb-2 text-center">
                <span className="text-sm font-bold text-orange-600 dark:text-orange-400 block tabular-nums">
                  {activeTab === 'market_share' ? '66,7%' : '+41%'}
                </span>
                <span className="text-[11px] text-theme-muted block">
                  {activeTab === 'market_share' ? '9,3 tỷ USD' : 'Ổn định vị thế'}
                </span>
              </div>
              <div
                style={{
                  height: activeTab === 'market_share' ? '66.7%' : '41%'
                }}
                className="w-full max-w-[92px] bg-gradient-to-t from-orange-600 to-amber-500 rounded-t-xl transition-all duration-500 shadow-xs relative group-hover:brightness-110 flex items-center justify-center"
              >
                <ShoppingBag className="w-5 h-5 text-white/80" />
              </div>
              <span className="text-xs font-bold text-theme-heading mt-2.5">Shopee</span>
            </div>

            {/* TikTok Shop */}
            <div className="flex flex-col items-center h-full justify-end group">
              <div className="mb-2 text-center">
                <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400 block tabular-nums">
                  {activeTab === 'market_share' ? '26,9%' : '+99%'}
                </span>
                <span className="text-[11px] text-theme-muted block">
                  {activeTab === 'market_share' ? '3,8 tỷ USD' : 'Tăng gấp gần 2 lần'}
                </span>
              </div>
              <div
                style={{
                  height: activeTab === 'market_share' ? '26.9%' : '99%'
                }}
                className="w-full max-w-[92px] bg-gradient-to-t from-cyan-600 to-blue-500 rounded-t-xl transition-all duration-500 shadow-xs relative group-hover:brightness-110 flex items-center justify-center"
              >
                <Video className="w-5 h-5 text-white/80" />
              </div>
              <span className="text-xs font-bold text-theme-heading mt-2.5">TikTok Shop</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-theme-muted pt-3 px-2">
            <span>Shopee giữ vững thị phần chi phối</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-bold font-mono">
              TikTok Shop tăng tốc thần tốc +99%
            </span>
          </div>
        </div>

        {/* Detailed Insights & Legal Framework */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="p-4 bg-surface-subtle rounded-xl border border-theme-subtle">
            <h5 className="text-xs font-bold text-theme-heading mb-1.5 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-theme-primary" />
              Động lực đổi mới sáng tạo
            </h5>
            <p className="text-xs text-theme-body leading-relaxed">
              TikTok Shop phát triển hình thức mua sắm gắn với video ngắn và livestream (Shoppertainment), tạo sức ép đổi mới trực tiếp lên Shopee. Cạnh tranh thúc đẩy cả hai nâng cấp hệ thống logistics, tối ưu trải nghiệm và tung khuyến mãi cho người dùng.
            </p>
          </div>

          <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-xl">
            <h5 className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Tuân thủ Luật Cạnh tranh số 23/2018/QH14
            </h5>
            <p className="text-[11px] text-amber-900 dark:text-amber-300 leading-relaxed">
              Cạnh tranh phải lành mạnh, minh bạch. Luật nghiêm cấm các hành vi cung cấp thông tin không trung thực về đối thủ nhằm gây thiệt hại hoặc trục lợi bất chính, bảo vệ quyền lợi người tiêu dùng và nền kinh tế số.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
