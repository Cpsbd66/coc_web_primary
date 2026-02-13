import { useArticles, useCategories } from "@/hooks/use-content";
import { Navbar } from "@/components/Navbar";
import { ArticleCard } from "@/components/ArticleCard";
import { SidebarEvents, NewsletterCard } from "@/components/Sidebar";
import { useParams, Link } from "wouter";
import { Loader2, ArrowLeft } from "lucide-react";

export default function CategoryPage() {
  const { slug } = useParams();
  const { data: articles = [], isLoading: articlesLoading } = useArticles(slug);
  const { data: categories = [] } = useCategories();
  
  const currentCategory = categories.find(c => c.slug === slug);

  if (articlesLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-accent mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
          </Link>
          
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 capitalize">
            {currentCategory?.name || slug}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Browse the latest articles, essays, and stories in {currentCategory?.name}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-secondary/30 rounded-xl border border-dashed border-border">
                <h3 className="font-display text-xl font-bold mb-2">No articles found</h3>
                <p className="text-muted-foreground">There are no stories in this category yet.</p>
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 space-y-10">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <h3 className="font-bold text-lg mb-4 font-display">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <Link 
                    key={c.id} 
                    href={`/category/${c.slug}`}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      c.slug === slug 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-white"
                    }`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <SidebarEvents />
            <NewsletterCard />
          </aside>
        </div>
      </main>
    </div>
  );
}
