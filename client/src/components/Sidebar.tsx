import { useEvents } from "@/hooks/use-content";
import { CalendarDays, MapPin } from "lucide-react";

export function SidebarEvents() {
  const { data: events = [], isLoading } = useEvents();

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/2"></div>
        <div className="h-32 bg-muted rounded"></div>
        <div className="h-32 bg-muted rounded"></div>
      </div>
    );
  }

  if (events.length === 0) return null;

  return (
    <div className="bg-secondary/30 rounded-xl p-6 border border-border">
      <h3 className="font-display font-bold text-2xl mb-6 flex items-center gap-2">
        <CalendarDays className="w-6 h-6 text-accent" />
        Upcoming Events
      </h3>

      <div className="space-y-6">
        {events.map((event) => (
          <div key={event.id} className="group relative pl-4 border-l-2 border-border hover:border-accent transition-colors">
            <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-border group-hover:bg-accent transition-colors" />
            
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1 font-mono">
              {event.date}
            </p>
            <h4 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary/80 transition-colors">
              {event.title}
            </h4>
            <div className="flex items-center text-sm text-muted-foreground gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {event.location}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-border/50 text-center">
        <button className="text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors">
          View All Events
        </button>
      </div>
    </div>
  );
}

export function NewsletterCard() {
  return (
    <div className="mt-8 bg-primary text-primary-foreground rounded-xl p-8 relative overflow-hidden">
      {/* Decorative circle */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      
      <h3 className="font-display font-bold text-2xl mb-3 relative z-10">Weekly Digest</h3>
      <p className="text-primary-foreground/80 text-sm mb-6 relative z-10 leading-relaxed">
        Get the latest stories and cultural insights delivered straight to your inbox every Friday morning.
      </p>
      
      <form className="space-y-3 relative z-10" onSubmit={(e) => e.preventDefault()}>
        <input 
          type="email" 
          placeholder="Your email address" 
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white/20 transition-all text-sm"
        />
        <button className="w-full py-3 px-4 bg-accent hover:bg-accent/90 text-white font-bold rounded-lg transition-colors text-sm uppercase tracking-wide">
          Subscribe
        </button>
      </form>
    </div>
  );
}
