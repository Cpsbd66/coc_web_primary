import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/use-content";
import { Menu, X, Search, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { data: categories = [] } = useCategories();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 -ml-2 text-foreground hover:bg-secondary rounded-md transition-colors"
          onClick={toggleMenu}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-xl md:text-2xl rounded-sm shadow-md group-hover:rotate-3 transition-transform duration-300">
            M
          </div>
          <span className="font-display font-bold text-xl md:text-2xl tracking-tight text-foreground group-hover:text-accent transition-colors">
            Magazina
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link href="/" className={cn(
            "text-sm font-medium tracking-wide uppercase border-b-2 border-transparent hover:border-accent hover:text-accent transition-all duration-200 py-1",
            location === "/" && "border-primary text-primary"
          )}>
            Home
          </Link>
          
          {categories.slice(0, 4).map((cat) => (
            <Link 
              key={cat.id} 
              href={`/category/${cat.slug}`} 
              className={cn(
                "text-sm font-medium tracking-wide uppercase border-b-2 border-transparent hover:border-accent hover:text-accent transition-all duration-200 py-1",
                location === `/category/${cat.slug}` && "border-primary text-primary"
              )}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Admin / Search */}
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="hidden md:flex text-muted-foreground hover:text-primary">
            <Search className="h-5 w-5" />
          </Button>
          
          <Link href="/admin">
            <Button variant="outline" size="sm" className="hidden sm:flex gap-2 border-primary/20 hover:border-primary hover:bg-secondary">
              <ShieldCheck className="h-4 w-4" />
              <span className="sr-only md:not-sr-only">Admin</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b border-border shadow-lg animate-in slide-in-from-top-2">
          <div className="container px-4 py-6 flex flex-col gap-4">
            <Link href="/" onClick={() => setIsOpen(false)} className="text-lg font-medium py-2 border-b border-border/50">
              Home
            </Link>
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/category/${cat.slug}`} 
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium py-2 border-b border-border/50"
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/admin" onClick={() => setIsOpen(false)} className="text-lg font-medium py-2 text-muted-foreground">
              Admin Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
