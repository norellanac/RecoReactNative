import * as SQLite from 'expo-sqlite';

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  HTTP = 'HTTP',
  NAV = 'NAV',
}

export interface LogEntry {
  id?: number;
  timestamp: string;
  level: LogLevel;
  tag: string;
  message: string;
  data?: any;
}

const DATABASE_NAME = 'app_logs_v1.db';
const MAX_LOGS = 1000;

// Configuration for development terminal logging
export const SHOW_LOGS_ON_TERMINAL = true;

class Logger {
  private static instance: Logger;
  private db: SQLite.SQLiteDatabase | null = null;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public async init() {
    if (this.isInitialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
        await this.db.execAsync(`
          PRAGMA journal_mode = WAL;
          PRAGMA synchronous = NORMAL;
          CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            level TEXT,
            tag TEXT,
            message TEXT,
            data TEXT
          );
        `);
        this.isInitialized = true;
      } catch (e) {
        console.error('Failed to initialize SQLite logger', e);
        this.initPromise = null;
      }
    })();

    return this.initPromise;
  }

  private async cleanup() {
    try {
      if (!this.isInitialized) await this.init();
      if (!this.db) return;
      
      await this.db.runAsync(
        'DELETE FROM logs WHERE id NOT IN (SELECT id FROM logs ORDER BY id DESC LIMIT ?)',
        [MAX_LOGS],
      );
    } catch (e) {
      console.warn('Cleanup failed:', e);
    }
  }

  public async log(level: LogLevel, tag: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const dataStr = data ? JSON.stringify(data) : null;

    if (__DEV__ && SHOW_LOGS_ON_TERMINAL) {
      const color =
        level === LogLevel.ERROR
          ? '\x1b[31m'
          : level === LogLevel.WARN
            ? '\x1b[33m'
            : level === LogLevel.HTTP
              ? '\x1b[36m'
              : level === LogLevel.NAV
                ? '\x1b[35m'
                : '\x1b[32m';

      const timeStr = new Date().toLocaleTimeString();
      const logData = {
        time: timeStr,
        level,
        tag,
        message,
        ...(data && { data }),
      };
      console.log(`${color}${JSON.stringify(logData)}\x1b[0m`);
    }

    // Attempt to persist to SQLite without blocking UI
    this.persistLog(timestamp, level, tag, message, dataStr);
  }

  private async persistLog(
    timestamp: string,
    level: string,
    tag: string,
    message: string,
    dataStr: string | null,
  ) {
    try {
      await this.init();
      if (!this.db) return;

      await this.db.runAsync(
        'INSERT INTO logs (timestamp, level, tag, message, data) VALUES (?, ?, ?, ?, ?)',
        [timestamp, level, tag, message, dataStr],
      );
    } catch {
      // If SQLite fails, we still have the terminal logs
    }
  }

  public info(tag: string, message: string, data?: any) {
    return this.log(LogLevel.INFO, tag, message, data);
  }

  public warn(tag: string, message: string, data?: any) {
    return this.log(LogLevel.WARN, tag, message, data);
  }

  public error(tag: string, message: string, error?: any) {
    return this.log(LogLevel.ERROR, tag, message, {
      message: error?.message,
      stack: error?.stack,
      ...error,
    });
  }

  public http(tag: string, message: string, data?: any) {
    return this.log(LogLevel.HTTP, tag, message, data);
  }

  public nav(tag: string, message: string, data?: any) {
    return this.log(LogLevel.NAV, tag, message, data);
  }

  public async getLogs(): Promise<LogEntry[]> {
    try {
      if (!this.isInitialized) await this.init();
      if (!this.db) return [];

      // Using getAllAsync with individual arguments to avoid the prepareAsync rejection
      const rows = await this.db.getAllAsync<any>(
        'SELECT * FROM logs ORDER BY id DESC LIMIT ?',
        MAX_LOGS,
      );
      
      return rows.map((row) => ({
        ...row,
        data: row.data ? JSON.parse(row.data) : null,
      }));
    } catch (e) {
      console.error('Failed to fetch logs', e);
      return [];
    }
  }

  public async clearLogs() {
    if (!this.isInitialized) await this.init();
    if (!this.db) return;
    try {
      await this.db.runAsync('DELETE FROM logs');
    } catch (e) {
      console.error('Failed to clear logs', e);
    }
  }
}

export const logger = Logger.getInstance();
