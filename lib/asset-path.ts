const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

export function withBasePath(path: string): string {
  if (!path) {
    return BASE_PATH || "/"
  }

  // Keep external/data URLs untouched.
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) {
    return path
  }

  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${BASE_PATH}${normalized}`
}
