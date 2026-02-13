
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertArticleSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Articles
  app.get(api.articles.list.path, async (req, res) => {
    const categorySlug = req.query.category as string | undefined;
    const articles = await storage.getArticles(categorySlug);
    res.json(articles);
  });

  app.get(api.articles.get.path, async (req, res) => {
    const article = await storage.getArticle(req.params.slug);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  });

  app.post(api.articles.create.path, async (req, res) => {
    try {
      const input = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(input);
      res.status(201).json(article);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.articles.update.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const input = insertArticleSchema.partial().parse(req.body);
      const article = await storage.updateArticle(id, input);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (err) {
       if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.articles.delete.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const existing = await storage.getArticleById(id);
    if (!existing) {
      return res.status(404).json({ message: "Article not found" });
    }
    await storage.deleteArticle(id);
    res.status(204).send();
  });

  // Categories
  app.get(api.categories.list.path, async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  // Events
  app.get(api.events.list.path, async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  return httpServer;
}

// Seed function
import { db } from "./db";
import { categories, events, articles } from "@shared/schema";

async function seed() {
  const existingCats = await db.select().from(categories);
  if (existingCats.length === 0) {
    console.log("Seeding database...");
    
    // Categories
    const cats = await db.insert(categories).values([
      { name: "Technology", slug: "technology" },
      { name: "Design", slug: "design" },
      { name: "Culture", slug: "culture" },
      { name: "Travel", slug: "travel" },
    ]).returning();

    // Events
    await db.insert(events).values([
      { title: "Tech Summit 2024", date: "Oct 15, 2024", location: "San Francisco, CA" },
      { title: "Design Week", date: "Nov 02, 2024", location: "New York, NY" },
      { title: "Writers Retreat", date: "Dec 10, 2024", location: "Portland, OR" },
    ]);

    // Articles
    await db.insert(articles).values([
      {
        title: "The Future of AI in Publishing",
        slug: "future-of-ai-publishing",
        description: "How artificial intelligence is reshaping the landscape of modern journalism and content creation.",
        content: "Artificial intelligence is rapidly transforming the publishing industry...",
        coverImageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
        authorName: "Sarah Connor",
        categoryId: cats[0].id,
      },
      {
        title: "Minimalism in Web Design",
        slug: "minimalism-web-design",
        description: "Why less is more when it comes to creating effective and accessible user interfaces.",
        content: "Minimalism isn't just an aesthetic choice; it's a functional one...",
        coverImageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8",
        authorName: "John Doe",
        categoryId: cats[1].id,
      },
      {
        title: "Coffee Culture Around the World",
        slug: "coffee-culture-world",
        description: "Exploring how different cultures prepare and enjoy their daily brew.",
        content: "From Italian espresso to Turkish coffee, the world loves its caffeine...",
        coverImageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
        authorName: "Emily Chen",
        categoryId: cats[2].id,
      },
      {
        title: "Hidden Gems of Kyoto",
        slug: "hidden-gems-kyoto",
        description: "Off the beaten path locations in Japan's ancient capital.",
        content: "Beyond the Golden Pavilion lies a world of quiet temples and tea houses...",
        coverImageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
        authorName: "Michael Smith",
        categoryId: cats[3].id,
      }
    ]);
    
    console.log("Database seeded successfully.");
  }
}

// Run seed on startup
seed().catch(console.error);
