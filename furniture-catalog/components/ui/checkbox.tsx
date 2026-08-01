export function Checkbox({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#f8f9fa] cursor-pointer transition-colors">
      <input type="checkbox" className="w-[18px] h-[18px] accent-[#e67e22] cursor-pointer" {...props} />
      <span className="text-[15px] text-[#555]">{label}</span>
    </label>
  );
}
