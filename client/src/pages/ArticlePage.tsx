import { useArticle } from "@/hooks/use-content";
import { Navbar } from "@/components/Navbar";
import { SidebarEvents } from "@/components/Sidebar";
import { useParams, Link } from "wouter";
import { Loader2, Calendar, User, Share2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function ArticlePage() {
  const { slug } = useParams();
  const { data: article, isLoading } = useArticle(slug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <h1 className="font-display text-4xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-8">The story you're looking for doesn't exist or has been moved.</p>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body text-foreground pb-24">
      <Navbar />

      <article className="animate-fade-in">
        {/* Header */}
        <header className="container mx-auto px-4 pt-12 pb-8 md:pb-12 max-w-5xl text-center">
          {article.category && (
            <Link 
              href={`/category/${article.category.slug}`}
              className="inline-block px-3 py-1 mb-6 text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 rounded-full hover:bg-accent/20 transition-colors"
            >
              {article.category.name}
            </Link>
          )}
          
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 text-primary text-balance">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground font-mono border-y border-border py-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-bold text-foreground">{article.authorName}</span>
            </div>
            {article.createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(article.createdAt), "MMMM d, yyyy")}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="bg-secondary px-2 py-0.5 rounded text-xs">5 min read</span>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="container mx-auto px-4 max-w-6xl mb-16">
          <div className="aspect-[21/9] w-full rounded-xl overflow-hidden shadow-2xl">
            <img 
              src={article.coverImageUrl} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground italic max-w-2xl mx-auto">
            Image via Unsplash • {article.description}
          </p>
        </div>

        {/* Content Layout */}
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl">
          {/* Social Share (Left Sticky) */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-32 flex flex-col gap-4 items-end">
              <p className="text-xs font-bold uppercase text-muted-foreground mb-2">Share</p>
              <Button variant="outline" size="icon" className="rounded-full w-12 h-12">
                <Share2 className="w-5 h-5" />
              </Button>
              {/* Fake social buttons */}
              <button className="w-12 h-12 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </button>
            </div>
          </div>

          {/* Main Text */}
          <div className="lg:col-span-7 prose prose-lg prose-slate dark:prose-invert max-w-none">
             <p className="lead text-xl md:text-2xl font-display text-foreground/80 mb-8 border-l-4 border-accent pl-6 italic">
              {article.description}
             </p>
             <div className="whitespace-pre-wrap font-serif text-lg leading-loose">
               {article.content}
             </div>
             
             <div className="mt-16 pt-8 border-t border-border">
               <h4 className="font-bold text-lg mb-4">About the Author</h4>
               <div className="flex items-center gap-4 bg-secondary/30 p-6 rounded-xl">
                 <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-display text-2xl font-bold">
                   {article.authorName.charAt(0)}
                 </div>
                 <div>
                   <p className="font-bold text-lg">{article.authorName}</p>
                   <p className="text-sm text-muted-foreground">Senior Editor at Magazina</p>
                 </div>
               </div>
             </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-8">
             <SidebarEvents />
          </div>
        </div>
      </article>
    </div>
  );
}
