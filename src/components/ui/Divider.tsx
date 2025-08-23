export function Divider({ children = "or sign in with" }: { children?: string }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <span className="h-px bg-gray-200 flex-1" />
      <span className="text-xs text-gray-500">{children}</span>
      <span className="h-px bg-gray-200 flex-1" />
    </div>
  );
}


