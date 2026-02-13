import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertArticleSchema, type InsertArticle } from "@shared/schema";
import { useArticle, useCreateArticle, useUpdateArticle, useCategories } from "@/hooks/use-content";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useParams } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft, Save, Sparkles } from "lucide-react";
import { api, buildUrl } from "@shared/routes";

// Need to find article by ID for edit mode, but our hook uses slug.
// For simplicity in this demo, we'll fetch list and find. 
// In prod, add a getById endpoint.
const useArticleById = (id?: string) => {
  // This is a hack for the demo since we didn't make a getById hook
  const { data: articles } = useCreateArticle().isIdle ? {data: []} : {data: []}; 
  // Proper implementation would be a new hook or endpoint
  // For now let's just use the form default values if creating, or fetch if editing
  return { data: null, isLoading: false }; 
};

export default function AdminEditor() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isEditing = !!id;

  const { data: categories = [] } = useCategories();
  
  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();

  // If editing, we need to fetch the existing data. 
  // Since we don't have getById hook exposed easily and I can't modify schema now,
  // I will rely on the user to have clicked edit from the dashboard where we could pass state,
  // but better yet, let's just implement a quick fetch in useEffect for this component
  
  const form = useForm<InsertArticle>({
    resolver: zodResolver(insertArticleSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      content: "",
      coverImageUrl: "",
      authorName: "",
      categoryId: 1, // Default to first category
    },
  });

  // Fetch data if editing
  useEffect(() => {
    if (isEditing) {
      // Direct fetch since we need ID lookup but our hook is by slug
      // In a real app, I'd add useArticleById
      fetch(api.articles.list.path)
        .then(res => res.json())
        .then(data => {
          const article = data.find((a: any) => a.id === Number(id));
          if (article) {
            form.reset({
              title: article.title,
              slug: article.slug,
              description: article.description,
              content: article.content,
              coverImageUrl: article.coverImageUrl,
              authorName: article.authorName,
              categoryId: article.categoryId,
            });
          }
        });
    }
  }, [id, isEditing, form]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (data: InsertArticle) => {
    try {
      // Ensure categoryId is a number
      const payload = { ...data, categoryId: Number(data.categoryId) };
      
      if (isEditing) {
        await updateMutation.mutateAsync({ id: Number(id), ...payload });
        toast({ title: "Article updated successfully" });
      } else {
        await createMutation.mutateAsync(payload);
        toast({ title: "Article published successfully" });
      }
      setLocation("/admin");
    } catch (error: any) {
      toast({ 
        title: "Error saving article", 
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  // Auto-generate slug from title
  const generateSlug = () => {
    const title = form.getValues("title");
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    form.setValue("slug", slug);
  };

  return (
    <div className="min-h-screen bg-background font-body pb-24">
      <Navbar />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4 pl-0 hover:bg-transparent hover:text-accent" 
            onClick={() => setLocation("/admin")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
          <h1 className="font-display text-4xl font-bold">
            {isEditing ? "Edit Article" : "New Story"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update your existing content." : "Craft a new narrative for your readers."}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Headline</FormLabel>
                      <FormControl>
                        <Input placeholder="The Future of Design..." {...field} onBlur={generateSlug} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input placeholder="the-future-of-design" {...field} />
                          <Button type="button" variant="outline" size="icon" onClick={generateSlug} title="Generate from Title">
                            <Sparkles className="w-4 h-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={(val) => field.onChange(Number(val))} 
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="authorName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Author Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="coverImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image URL (Unsplash)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://images.unsplash.com/photo-..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Use a high-quality Unsplash URL for the best results.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt / Summary</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="A brief summary of the article..." 
                        className="resize-none h-24" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write your story here..." 
                        className="min-h-[400px] font-serif text-lg leading-relaxed p-6" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4 border-t border-border">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setLocation("/admin")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> {isEditing ? "Update Article" : "Publish Article"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
