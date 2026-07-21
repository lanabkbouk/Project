export default function Chip({ children }) {
  return (
    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
      {children}
    </span>
  );
}