import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Download, ChevronRight, ChevronDown, ExternalLink } from 'lucide-react';

interface MindNode {
  id: string;
  label: string;
  page?: number;
  moduleId?: string;
  color?: string;
  children?: MindNode[];
}

const MINDMAP_DATA: MindNode = {
  id: 'root',
  label: 'Bốn quy luật cơ bản trong nền kinh tế hàng hóa (MLN122)',
  color: '#2563EB',
  children: [
    {
      id: 'm1',
      label: '1. Khái quát nền kinh tế hàng hóa',
      page: 1,
      moduleId: 'module-01',
      color: '#4F46E5',
      children: [
        { id: 'm1-1', label: 'Mục đích: Trao đổi, mua bán trên thị trường', page: 1 },
        { id: 'm1-2', label: '4 khâu: Sản xuất → Phân phối → Trao đổi → Tiêu dùng', page: 1 },
        { id: 'm1-3', label: 'Vận động theo các quy luật khách quan', page: 1 }
      ]
    },
    {
      id: 'm2',
      label: '2. Quy luật giá trị (Cơ bản nhất)',
      page: 1,
      moduleId: 'module-02',
      color: '#059669',
      children: [
        {
          id: 'm2-1',
          label: 'Nội dung cốt lõi',
          page: 1,
          children: [
            { id: 'm2-1-1', label: 'Dựa trên hao phí LĐXH cần thiết', page: 1 },
            { id: 'm2-1-2', label: 'Trao đổi ngang giá (giá cả xoay quanh giá trị)', page: 1 }
          ]
        },
        {
          id: 'm2-2',
          label: '3 tác động chính',
          page: 1,
          children: [
            { id: 'm2-2-1', label: '1. Điều tiết sản xuất và lưu thông', page: 1 },
            { id: 'm2-2-2', label: '2. Kích thích cải tiến kỹ thuật, tăng NSLĐ', page: 2 },
            { id: 'm2-2-3', label: '3. Phân hóa người sản xuất hàng hóa', page: 2 }
          ]
        },
        {
          id: 'm2-3',
          label: 'Thực nghiệm cà phê 2019',
          page: 2,
          children: [
            { id: 'm2-3-1', label: 'Hộ SC: Năng suất 3.215,77 kg/ha (+9,6%)', page: 2 },
            { id: 'm2-3-2', label: 'Hộ SC: Lợi nhuận 68,366 tr.đ/ha (+20,4%)', page: 2 },
            { id: 'm2-3-3', label: 'Kết luận: Bằng chứng thực nghiệm liên hệ', page: 3 }
          ]
        }
      ]
    },
    {
      id: 'm3',
      label: '3. Quy luật cung – cầu',
      page: 4,
      moduleId: 'module-03',
      color: '#D97706',
      children: [
        {
          id: 'm3-1',
          label: 'Cơ chế giá cả',
          page: 4,
          children: [
            { id: 'm3-1-1', label: 'Cầu > Cung: Áp lực tăng giá', page: 4 },
            { id: 'm3-1-2', label: 'Cung > Cầu: Áp lực giảm giá', page: 4 },
            { id: 'm3-1-3', label: 'Giá cả phát tín hiệu thị trường', page: 4 }
          ]
        },
        {
          id: 'm3-2',
          label: 'Thị trường Tết Ất Tỵ 2025',
          page: 4,
          children: [
            { id: 'm3-2-1', label: 'Thịt lợn: +2,45% do cầu Tết', page: 5 },
            { id: 'm3-2-2', label: 'Rau củ: -0,48% do cung dồi dào vụ đông xuân', page: 5 },
            { id: 'm3-2-3', label: 'TP.HCM: Dự trữ hàng >8.000 tỷ bình ổn', page: 5 }
          ]
        }
      ]
    },
    {
      id: 'm4',
      label: '4. Quy luật cạnh tranh',
      page: 6,
      moduleId: 'module-04',
      color: '#E11D48',
      children: [
        {
          id: 'm4-1',
          label: 'Hai mặt tác động',
          page: 6,
          children: [
            { id: 'm4-1-1', label: 'Tích cực: Phát triển LLSX, tối ưu nguồn lực', page: 6 },
            { id: 'm4-1-2', label: 'Tiêu cực: Cạnh tranh không lành mạnh', page: 6 },
            { id: 'm4-1-3', label: 'Quản lý Nhà nước: Luật Cạnh tranh 2018', page: 8 }
          ]
        },
        {
          id: 'm4-2',
          label: 'Case TMĐT 2024 (Shopee vs TikTok)',
          page: 7,
          children: [
            { id: 'm4-2-1', label: 'Shopee: GMV 9,3 tỷ USD (thị phần 66,7%, +41%)', page: 7 },
            { id: 'm4-2-2', label: 'TikTok Shop: GMV 3,8 tỷ USD (thị phần 26,9%, +99%)', page: 7 },
            { id: 'm4-2-3', label: 'Đổi mới: Shoppertainment & giao nhận', page: 8 }
          ]
        }
      ]
    },
    {
      id: 'm5',
      label: '5. Quy luật lưu thông tiền tệ',
      page: 8,
      moduleId: 'module-05',
      color: '#0891B2',
      children: [
        {
          id: 'm5-1',
          label: 'Công thức: M = (P × Q) / V',
          page: 8,
          children: [
            { id: 'm5-1-1', label: 'M: Lượng tiền cần thiết lưu thông', page: 8 },
            { id: 'm5-1-2', label: 'P × Q: Tổng giá cả hàng hóa dịch vụ', page: 8 },
            { id: 'm5-1-3', label: 'V: Tốc độ lưu thông bình quân của tiền', page: 8 }
          ]
        },
        {
          id: 'm5-2',
          label: 'Kinh tế Việt Nam 2025',
          page: 9,
          children: [
            { id: 'm5-2-1', label: 'M2 tăng 14,98%, Tín dụng tăng 17,65%', page: 9 },
            { id: 'm5-2-2', label: 'GDP tăng 8,02% tạo hàng hóa đối ứng', page: 9 },
            { id: 'm5-2-3', label: 'CPI 2025 tăng 3,31% (thấp hơn 3,63% năm 2024)', page: 9 }
          ]
        }
      ]
    }
  ]
};

export const InteractiveMindmap: React.FC<{
  onSelectModule?: (moduleId: string) => void;
  onOpenPdf?: (page: number) => void;
}> = ({ onSelectModule, onOpenPdf }) => {
  const [zoom, setZoom] = useState<number>(1);
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<string>('root');
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleCollapse = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const handleExportSvg = () => {
    if (!containerRef.current) return;
    const element = containerRef.current.querySelector('svg');
    if (!element) return;
    const svgData = new XMLSerializer().serializeToString(element);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'MLN122_Mindmap_Quy_Luat_Kinh_Te.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const renderTree = (node: MindNode, level = 0) => {
    const isCollapsed = collapsedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = activeNodeId === node.id;

    return (
      <div key={node.id} className="relative flex flex-col items-start">
        <div
          onClick={() => {
            setActiveNodeId(node.id);
            if (node.moduleId && onSelectModule) onSelectModule(node.moduleId);
          }}
          className={`group flex items-center gap-2 py-2 px-3.5 rounded-xl border transition-all cursor-pointer text-xs mb-2 select-none ${
            level === 0
              ? 'bg-theme-primary text-white font-bold text-sm shadow-theme-card border-theme-primary'
              : level === 1
              ? 'bg-surface font-bold text-theme-heading shadow-xs border-theme-subtle hover:border-theme-strong'
              : 'bg-surface-subtle text-theme-body border-theme-subtle hover:border-theme-strong'
          } ${
            isSelected && level > 0
              ? 'ring-2 ring-blue-500 border-theme-primary bg-theme-primary-subtle text-theme-primary font-bold'
              : ''
          }`}
        >
          {hasChildren && (
            <button
              type="button"
              onClick={(e) => toggleCollapse(node.id, e)}
              className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}

          <span>{node.label}</span>

          {node.page && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (node.page) onOpenPdf?.(node.page);
              }}
              className="opacity-70 hover:opacity-100 text-[10px] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded inline-flex items-center gap-0.5 font-mono cursor-pointer"
              title="Mở tài liệu PDF gốc"
            >
              Tr.{node.page}
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          )}
        </div>

        {hasChildren && !isCollapsed && (
          <div className="pl-6 border-l-2 border-theme-subtle ml-4 space-y-1">
            {node.children!.map((child) => renderTree(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-surface border border-theme-subtle rounded-2xl p-5 md:p-7 shadow-theme-card transition-colors">
      {/* Mindmap Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-theme-subtle">
        <div>
          <h4 className="text-lg font-bold text-theme-heading">
            Sơ đồ tư duy (Interactive Mindmap)
          </h4>
          <p className="text-xs text-theme-muted mt-0.5">
            Cấu trúc phân nhánh toàn diện 4 quy luật, số trang PDF và mối quan hệ kiến thức.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-surface-subtle border border-theme-subtle rounded-xl">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
              className="p-1.5 rounded-lg hover:bg-surface text-theme-muted hover:text-theme-heading transition-colors cursor-pointer"
              title="Phóng to"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono px-2 text-theme-heading font-semibold">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
              className="p-1.5 rounded-lg hover:bg-surface text-theme-muted hover:text-theme-heading transition-colors cursor-pointer"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              className="p-1.5 rounded-lg hover:bg-surface text-theme-muted hover:text-theme-heading transition-colors cursor-pointer"
              title="Đặt lại zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportSvg}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-subtle hover:bg-slate-200/50 dark:hover:bg-slate-800 text-theme-heading border border-theme-subtle text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất SVG</span>
          </button>
        </div>
      </div>

      {/* Mindmap Interactive Canvas */}
      <div
        ref={containerRef}
        className="mt-6 p-6 overflow-auto bg-surface-subtle rounded-2xl border border-theme-subtle min-h-[500px]"
      >
        <div
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
          className="transition-transform duration-200"
        >
          {renderTree(MINDMAP_DATA)}
        </div>
      </div>
    </div>
  );
};
