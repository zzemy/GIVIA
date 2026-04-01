export function withBasePath(path: string): string {
  if (!path) {
    return "/"
  }

  // Keep external/data URLs untouched.
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) {
    return path
  }

  // Return path as-is since we no longer use sub-path deployment
  return path.startsWith("/") ? path : `/${path}`
}
