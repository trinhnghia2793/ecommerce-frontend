import Link from "next/link";
import { cn } from "@/lib/utils";

export function NavLink({
  href,
  active,
  isAnchor,
  children,
}: {
  href: string;
  active: boolean;
  isAnchor?: boolean;
  children: React.ReactNode;
}) {
  const className = cn(
    "text-sm font-semibold transition-colors",
    active ? "text-primary" : "text-foreground hover:text-primary",
  );

  if (isAnchor)
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
    
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
