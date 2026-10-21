import { User } from "@/types/api.types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  user: User | null;
  loading: boolean;
  isSigningOut?: boolean;
  onSignOut: () => void;
  signInHref: string;
  shopCatalogHref: string;
}

export function UserMenu({
  user,
  loading,
  isSigningOut = false,
  onSignOut,
  signInHref,
  shopCatalogHref,
}: UserMenuProps) {
  if (loading) {
    return (
      <div className="w-24 h-10 rounded-full bg-secondary/50 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Link
        href={signInHref}
        className={cn(
          buttonVariants({ size: "sm" }),
          "h-10 px-5 rounded-full bg-linear-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-white font-bold shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all duration-150 ease-out ml-1 cursor-pointer",
        )}
      >
        Sign in
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="rounded-full pl-2 pr-3.5 border border-border hover:border-primary/50 bg-secondary/30 hover:bg-secondary/60 shadow-sm"
          />
        }
      >
        <Avatar className="h-6.5 w-6.5 ring-2 ring-primary/30 transition-all duration-150 ease-out">
          {user.image ? (
            <AvatarImage src={user.image} alt={user.name} />
          ) : (
            <AvatarFallback className="text-[10px] font-bold bg-primary text-white">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          )}
        </Avatar>
        <span className="text-xs font-bold text-foreground max-w-20 truncate">
          {user.name?.split(" ").pop()}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 rounded-2xl border border-border bg-background/95 backdrop-blur-md shadow-xl p-1.5 animate-in fade-in duration-150"
      >
        <div className="px-3 py-2.5">
          <p className="text-sm font-bold text-foreground truncate">
            {user.name}
          </p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {user.email}
          </p>
        </div>

        <DropdownMenuSeparator className="bg-border/60" />

        <DropdownMenuItem
          className="w-full flex items-center justify-between font-semibold rounded-xl hover:bg-primary/5 transition-all duration-150 ease-out cursor-pointer"
          render={<Link href="/product/account" />}
        >
          <span>Account</span>
          <span className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
        </DropdownMenuItem>

        <DropdownMenuItem
          className="w-full flex items-center justify-between font-semibold rounded-xl hover:bg-primary/5 transition-all duration-150 ease-out cursor-pointer"
          render={<Link href={shopCatalogHref} />}
        >
          <span>Products</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border/60" />

        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            if (!isSigningOut) onSignOut();
          }}
          disabled={isSigningOut}
          className="rounded-xl text-destructive focus:bg-destructive/10 focus:text-destructive transition-all duration-150 ease-out font-bold cursor-pointer"
        >
          {isSigningOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing out...
            </>
          ) : (
            "Sign out"
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
