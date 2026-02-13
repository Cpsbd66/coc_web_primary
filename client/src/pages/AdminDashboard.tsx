import { useArticles, useDeleteArticle } from "@/hooks/use-content";
import { Navbar } from "@/components/Navbar";
import { Link } from "wouter";
import { Loader2, Plus, Edit2, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { data: articles = [], isLoading } = useArticles();
  const deleteArticle = useDeleteArticle();
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    try {
      await deleteArticle.mutateAsync(id);
      toast({
        title: "Article deleted",
        description: "The article has been permanently removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete article. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">Content Dashboard</h1>
            <p className="text-muted-foreground">Manage your publication's articles.</p>
          </div>
          <Link href="/admin/create">
            <Button className="gap-2 bg-accent hover:bg-accent/90 text-white font-bold shadow-lg shadow-accent/20">
              <Plus className="w-4 h-4" /> Create New Article
            </Button>
          </Link>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow>
                  <TableHead className="w-[400px]">Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      No articles found. Create your first one!
                    </TableCell>
                  </TableRow>
                ) : (
                  articles.map((article) => (
                    <TableRow key={article.id} className="hover:bg-secondary/20 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <img 
                            src={article.coverImageUrl} 
                            alt="" 
                            className="w-10 h-10 rounded object-cover bg-muted"
                          />
                          <span className="line-clamp-1 font-display font-semibold">{article.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-secondary text-xs font-bold uppercase tracking-wider">
                          {article.category?.name || "Uncategorized"}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{article.authorName}</TableCell>
                      <TableCell className="text-sm font-mono text-muted-foreground">
                        {article.createdAt && format(new Date(article.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/article/${article.slug}`}>
                            <Button variant="ghost" size="icon" title="View">
                              <Eye className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </Link>
                          <Link href={`/admin/edit/${article.id}`}>
                            <Button variant="ghost" size="icon" title="Edit">
                              <Edit2 className="w-4 h-4 text-primary" />
                            </Button>
                          </Link>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" title="Delete">
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Article?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete "{article.title}" from the database.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-destructive text-white hover:bg-destructive/90"
                                  onClick={() => handleDelete(article.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
}
