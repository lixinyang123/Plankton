import type { IncomingMessage, ServerResponse } from "node:http";

export interface PlanktonRequest extends IncomingMessage {
  pathname: string;
  cookie: Record<string, string | undefined>;
  query: Record<string, string>;
  body(): Promise<unknown>;
  session?: Map<string, unknown>;
}

export interface PlanktonResponse extends ServerResponse {
  cookie(key: string, value: string, time?: number, path?: string): void;
  redirect(path: string): void;
  json(value: unknown): void;
  render(fileName: string, data?: Record<string, unknown>): Promise<void>;
  bad(text?: string): void;
  forbidden(text?: string): void;
  notfound(text?: string): void;
  error(text?: string): void;
  session?: Map<string, unknown>;
}

export type NextFunction = (
  req: PlanktonRequest,
  res: PlanktonResponse,
) => Promise<void>;

export type RequestHandler = (
  req: PlanktonRequest,
  res: PlanktonResponse,
) => void | Promise<void>;

export type MiddlewareHandler = (
  req: PlanktonRequest,
  res: PlanktonResponse,
  next: NextFunction,
) => void | Promise<void>;

export type LoggerHandler = (message: string, level: string) => void;

export interface Group {
  map(routePath: string, callback: RequestHandler, method?: string): void;
  mapGroup(basePath: string, callback: (group: Group) => void): void;
}

export interface Plankton {
  use(callback: MiddlewareHandler): this;
  useLogger(callback: LoggerHandler): this;
  useCors(): this;
  useSession(expires?: number, prefix?: string): this;
  usePathBase(basePath: string): this;
  useStaticFile(wwwroot?: string, requestPath?: string): this;
  useDevErrorPage(): this;
  map(routePath: string, callback: RequestHandler, method?: string): this;
  mapGroup(basePath: string, callback: (group: Group) => void): this;
  mapController(dir?: string, basePath?: string): this;
  build(): this;
  start(port?: number): void;
  dispose(): Promise<void>;
}

export default function plankton(): Plankton;
