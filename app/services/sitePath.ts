const rawBasePath = process.env.NEXT_BASE_PATH?.trim();
const normalizedBasePath = rawBasePath
  ? `/${rawBasePath.replace(/^\/+|\/+$/g, "")}`
  : "";

export function withBasePath(path: string): string {
  if (!normalizedBasePath || !path.startsWith("/")) {
    return path;
  }

  return `${normalizedBasePath}${path}`;
}
