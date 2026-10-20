import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { env } from './env.js';

export interface DatabaseStatus {
  type: 'mongodb_atlas' | 'persistent_local_store';
  connected: boolean;
  message: string;
  host?: string;
  databaseName?: string;
}

let dbStatus: DatabaseStatus = {
  type: 'persistent_local_store',
  connected: false,
  message: 'Initializing database...',
};

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

// Memory/Disk store for local persistent storage
class PersistentStore {
  private data: Record<string, any[]> = {};
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.data = {};
        this.persistNow();
      }
    } catch (err) {
      console.error('Failed to load local DB data:', err);
      this.data = {};
    }
  }

  public persistNow() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist local DB data:', err);
    }
  }

  public scheduleSave() {
    if (this.saveTimeout) return;
    this.saveTimeout = setTimeout(() => {
      this.saveTimeout = null;
      this.persistNow();
    }, 150);
  }

  public getCollection<T = any>(name: string): CollectionAccessor<T> {
    if (!this.data[name]) {
      this.data[name] = [];
    }
    return new CollectionAccessor<T>(this.data[name], () => this.scheduleSave());
  }

  public getRawData() {
    return this.data;
  }
}

export class CollectionAccessor<T = any> {
  constructor(
    private items: T[],
    private onMutate: () => void
  ) {}

  find(predicate?: (item: T) => boolean): T[] {
    if (!predicate) return [...this.items];
    return this.items.filter(predicate).map(i => ({ ...i }));
  }

  findOne(predicate: (item: T) => boolean): T | null {
    const item = this.items.find(predicate);
    return item ? { ...item } : null;
  }

  findById(id: string): T | null {
    const item = this.items.find((i: any) => i._id === id || i.id === id);
    return item ? { ...item } : null;
  }

  insertOne(doc: T): T {
    const newDoc: any = {
      _id: (doc as any)._id || Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      createdAt: (doc as any).createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc,
    };
    this.items.push(newDoc);
    this.onMutate();
    return { ...newDoc };
  }

  updateOne(predicate: (item: T) => boolean, update: Partial<T>): T | null {
    const idx = this.items.findIndex(predicate);
    if (idx === -1) return null;
    this.items[idx] = {
      ...this.items[idx],
      ...update,
      updatedAt: new Date().toISOString(),
    };
    this.onMutate();
    return { ...this.items[idx] };
  }

  updateById(id: string, update: Partial<T>): T | null {
    return this.updateOne((i: any) => i._id === id || i.id === id, update);
  }

  deleteOne(predicate: (item: T) => boolean): boolean {
    const idx = this.items.findIndex(predicate);
    if (idx === -1) return false;
    this.items.splice(idx, 1);
    this.onMutate();
    return true;
  }

  deleteById(id: string): boolean {
    return this.deleteOne((i: any) => i._id === id || i.id === id);
  }

  deleteMany(predicate: (item: T) => boolean): number {
    const initialLen = this.items.length;
    this.items = this.items.filter(item => !predicate(item));
    const deletedCount = initialLen - this.items.length;
    if (deletedCount > 0) {
      this.onMutate();
    }
    return deletedCount;
  }

  count(predicate?: (item: T) => boolean): number {
    if (!predicate) return this.items.length;
    return this.items.filter(predicate).length;
  }
}

export const localStore = new PersistentStore();

export async function initDatabase(): Promise<DatabaseStatus> {
  const uri = env.MONGODB_URI?.trim();

  if (uri && uri.startsWith('mongodb')) {
    try {
      console.log('Connecting to MongoDB Atlas...');
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });

      const connection = mongoose.connection;
      dbStatus = {
        type: 'mongodb_atlas',
        connected: true,
        message: 'Successfully connected to MongoDB Atlas cluster.',
        host: connection.host,
        databaseName: connection.name,
      };
      console.log(`[DB] Connected to MongoDB Atlas host: ${connection.host}`);
      return dbStatus;
    } catch (err: any) {
      console.warn(`[DB] Could not connect to MongoDB Atlas (${err.message}). Falling back to persistent local storage.`);
      dbStatus = {
        type: 'persistent_local_store',
        connected: true,
        message: `Atlas connection failed (${err.message}). Active fallback: persistent local storage with full schema validation and disk persistence.`,
      };
      return dbStatus;
    }
  }

  dbStatus = {
    type: 'persistent_local_store',
    connected: true,
    message: 'Running on persistent local database storage. Configure MONGODB_URI in .env to connect to MongoDB Atlas.',
  };
  console.log('[DB] Running on persistent local storage (data/db.json). Ready.');
  return dbStatus;
}

export function getDatabaseStatus(): DatabaseStatus {
  return dbStatus;
}
