import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Labelled input used by the login / profile forms.
 * Any field with type="password" automatically gets a view / hide button.
 */
export function FormField({
  label,
  type,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  const isPassword = type === "password";
  const [visible, setVisible] = useState(false);

  return (
    <label className="block">
      <span className="block mb-1 text-xs font-semibold tracking-wider uppercase text-muted">
        {label}
      </span>
      <div className="relative">
        <input
          {...props}
          type={isPassword && visible ? "text" : type}
          className={`w-full rounded-xl border border-line bg-elevated/60 px-4 py-3 text-sm outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/30 ${isPassword ? "pr-12" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            onMouseDown={(e) => e.preventDefault()}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            title={visible ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex items-center px-3.5 text-muted transition hover:text-accent"
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </label>
  );
}
