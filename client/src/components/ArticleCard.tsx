import { Link } from "wouter";
import { type Article, type Category } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface ArticleCardProps {
  article: Article & { category?: Category };
  featured?: boolean;
  className?: string;
}

export function ArticleCard({ article, featured = false, className }: ArticleCardProps) {
  return (
    <Link href={`/article/${article.slug}`} className={cn(
      "group block h-full bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:border-accent/30 transition-all duration-300 transform hover:-translate-y-1",
      featured ? "md:grid md:grid-cols-2 md:gap-8 items-center" : "flex flex-col",
      className
    )}>
      {/* Image Container */}
      <div className={cn(
        "relative overflow-hidden bg-muted",
        featured ? "h-64 md:h-full w-full" : "h-56 w-full"
      )}>
        <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10" />
        <img 
          src={article.coverImageUrl} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {article.category && (
          <span className="absolute top-4 left-4 z-20 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-background/90 text-foreground backdrop-blur-sm rounded-sm shadow-sm border border-border/50">
            {article.category.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className={cn(
        "flex flex-col flex-1",
        featured ? "p-6 md:p-8 lg:p-12" : "p-5"
      )}>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 font-mono">
          <span className="font-semibold text-accent">{article.authorName}</span>
          <span>•</span>
          {article.createdAt && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {format(new Date(article.createdAt), "MMM d, yyyy")}
            </span>
          )}
        </div>

        <h3 className={cn(
          "font-display font-bold leading-tight group-hover:text-accent transition-colors mb-3",
          featured ? "text-3xl md:text-4xl lg:text-5xl mb-4" : "text-xl"
        )}>
          {article.title}
        </h3>

        <p className={cn(
          "text-muted-foreground line-clamp-3 mb-6",
          featured ? "text-lg md:text-xl" : "text-sm leading-relaxed"
        )}>
          {article.description}
        </p>

        <div className="mt-auto flex items-center text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
          Read Story <ArrowRight className="ml-2 w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
