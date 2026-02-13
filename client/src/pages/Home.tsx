import { useArticles, useCategories } from "@/hooks/use-content";
import { Navbar } from "@/components/Navbar";
import { ArticleCard } from "@/components/ArticleCard";
import { SidebarEvents, NewsletterCard } from "@/components/Sidebar";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const { data: articles = [], isLoading } = useArticles();
  const { data: categories = [] } = useCategories();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
        <p className="mt-4 text-muted-foreground font-mono text-sm animate-pulse">Loading Magazina...</p>
      </div>
    );
  }

  // Get the featured article (first one)
  const featuredArticle = articles[0];
  const recentArticles = articles.slice(1, 5); // Next 4
  const olderArticles = articles.slice(5); // Rest

  return (
    <div className="min-h-screen bg-background font-body text-foreground selection:bg-accent/20">
      <Navbar />

      <main className="container mx-auto px-4 pb-24 pt-8 md:pt-12">
        {/* Hero Section */}
        <section className="mb-16 md:mb-24 animate-fade-in">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4 text-primary">
              The <span className="text-accent italic font-serif pr-2">Zeitgeist</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Curated stories on culture, technology, and modern life from voices that matter.
            </p>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Link 
              href="/" 
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform"
            >
              All Stories
            </Link>
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/category/${cat.slug}`}
                className="px-5 py-2 rounded-full bg-white border border-border text-foreground text-sm font-medium hover:border-accent hover:text-accent hover:bg-accent/5 transition-all"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Featured Article */}
          {featuredArticle && (
            <div className="mb-16">
              <ArticleCard article={featuredArticle} featured />
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-16">
            {/* Recent Grid */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-display font-bold">Trending Now</h2>
                <div className="h-px bg-border flex-1" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {recentArticles.map((article, i) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    className={cn(i % 3 === 0 ? "md:col-span-2" : "")}
                  />
                ))}
              </div>
            </section>

            {/* More Stories List */}
            {olderArticles.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-2xl font-display font-bold">Latest Stories</h2>
                  <div className="h-px bg-border flex-1" />
                </div>
                
                <div className="space-y-8 divide-y divide-border/50">
                  {olderArticles.map((article) => (
                    <div key={article.id} className="pt-8 first:pt-0">
                      <ArticleCard article={article} className="shadow-none border-0 bg-transparent hover:shadow-none p-0" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 space-y-10">
            <SidebarEvents />
            <NewsletterCard />
            
            {/* Sticky Ad / Promo placeholder */}
            <div className="sticky top-24 bg-card p-6 rounded-xl border border-dashed border-border text-center">
              <span className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Sponsor</span>
              <div className="h-64 bg-secondary/50 rounded flex items-center justify-center">
                <span className="text-muted-foreground font-display italic">Ad Space</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="w-12 h-12 bg-white text-primary rounded-sm flex items-center justify-center font-display font-bold text-2xl mx-auto mb-6">M</div>
          <h2 className="font-display text-3xl font-bold mb-8">Magazina Publishing</h2>
          <div className="flex justify-center gap-8 text-sm font-medium tracking-wide opacity-80 mb-12">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <Link href="/about" className="hover:text-accent transition-colors">About</Link>
            <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
          </div>
          <p className="text-xs opacity-40 font-mono">
            © {new Date().getFullYear()} Magazina Inc. All rights reserved. Designed with precision.
          </p>
        </div>
      </footer>
    </div>
  );
}
