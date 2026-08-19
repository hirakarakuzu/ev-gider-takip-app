import { X } from "lucide-react";

export function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-xl2 shadow-card border border-slate-200/70 ${className}`}>{children}</div>;
}

export function Button({ children, variant = "primary", size = "md", className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2.5 text-sm", lg: "px-5 py-3 text-base" };
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
    secondary: "bg-brand-50 text-brand-700 hover:bg-brand-100",
    ghost: "text-ink-700 hover:bg-slate-100",
    danger: "bg-coral-500 text-white hover:bg-coral-600",
    outline: "border border-slate-300 text-ink-700 hover:bg-slate-50",
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Badge({ children, tone = "brand" }) {
  const tones = {
    brand: "bg-brand-50 text-brand-700",
    mint: "bg-emerald-50 text-mint-600",
    coral: "bg-red-50 text-coral-600",
    slate: "bg-slate-100 text-ink-700",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-xl2 rounded-t-2xl shadow-pop max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h3 className="font-display font-semibold text-lg text-ink-900">{title}</h3>
          <button onClick={onClose} aria-label="Kapat" className="p-1.5 rounded-lg hover:bg-slate-100 text-ink-700">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="px-5 py-4 border-t border-slate-100 flex justify-end gap-2 sticky bottom-0 bg-white">{footer}</div>}
      </div>
    </div>
  );
}

export function Field({ label, children, hint }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium text-ink-800 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-ink-700/60 mt-1">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-700/40 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors";

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
          <Icon size={22} />
        </div>
      )}
      <h4 className="font-display font-semibold text-ink-900 mb-1">{title}</h4>
      {description && <p className="text-sm text-ink-700/70 max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}
