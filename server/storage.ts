
import { db } from "./db";
import {
  articles,
  categories,
  events,
  type Article,
  type InsertArticle,
  type Category,
  type Event,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Articles
  getArticles(categorySlug?: string): Promise<(Article & { category: Category })[]>;
  getArticle(slug: string): Promise<(Article & { category: Category }) | undefined>;
  getArticleById(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article>;
  deleteArticle(id: number): Promise<void>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;

  // Events
  getEvents(): Promise<Event[]>;
}

export class DatabaseStorage implements IStorage {
  async getArticles(categorySlug?: string): Promise<(Article & { category: Category })[]> {
    let query = db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        description: articles.description,
        content: articles.content,
        coverImageUrl: articles.coverImageUrl,
        authorName: articles.authorName,
        categoryId: articles.categoryId,
        createdAt: articles.createdAt,
        category: categories,
      })
      .from(articles)
      .innerJoin(categories, eq(articles.categoryId, categories.id))
      .orderBy(desc(articles.createdAt));

    if (categorySlug) {
      // Filter in memory or add where clause if we join category
      // Since we joined, we can filter by category slug
      // But drizzle types with raw join can be tricky, let's just filter the result if simple query
      // Better: Add where clause
      return await db
        .select({
            id: articles.id,
            title: articles.title,
            slug: articles.slug,
            description: articles.description,
            content: articles.content,
            coverImageUrl: articles.coverImageUrl,
            authorName: articles.authorName,
            categoryId: articles.categoryId,
            createdAt: articles.createdAt,
            category: categories,
        })
        .from(articles)
        .innerJoin(categories, eq(articles.categoryId, categories.id))
        .where(eq(categories.slug, categorySlug))
        .orderBy(desc(articles.createdAt));
    }

    return await query;
  }

  async getArticle(slug: string): Promise<(Article & { category: Category }) | undefined> {
    const [result] = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        description: articles.description,
        content: articles.content,
        coverImageUrl: articles.coverImageUrl,
        authorName: articles.authorName,
        categoryId: articles.categoryId,
        createdAt: articles.createdAt,
        category: categories,
      })
      .from(articles)
      .innerJoin(categories, eq(articles.categoryId, categories.id))
      .where(eq(articles.slug, slug));
    
    return result;
  }

  async getArticleById(id: number): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article;
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db.insert(articles).values(insertArticle).returning();
    return article;
  }

  async updateArticle(id: number, updates: Partial<InsertArticle>): Promise<Article> {
    const [updated] = await db
      .update(articles)
      .set(updates)
      .where(eq(articles.id, id))
      .returning();
    return updated;
  }

  async deleteArticle(id: number): Promise<void> {
    await db.delete(articles).where(eq(articles.id, id));
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async getEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }
}

export const storage = new DatabaseStorage();
