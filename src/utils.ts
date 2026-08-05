/**
 * Helper to convert Google Drive share links and regular image links into direct, web-addressable URLs.
 */
export function getDirectImageUrl(url: string | undefined): string {
  if (!url) return "";
  
  const trimmed = url.trim();
  
  // 1. Check for standard Google Drive "file/d/FILE_ID" folder paths
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`;
  }
  
  // 2. Check for "id=FILE_ID" query parameters
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }

  // 3. Check for drive.google.com/uc?id=FILE_ID or export=download
  const ucMatch = trimmed.match(/\/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (ucMatch && ucMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${ucMatch[1]}`;
  }
  
  return trimmed;
}

/**
 * Sanitizes URLs to prevent XSS injection (e.g. javascript: or data: schemes).
 */
export function sanitizeUrl(url: string | undefined): string {
  if (!url) return "";
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:") || lower.startsWith("vbscript:")) {
    return "#";
  }
  // If it doesn't start with a protocol, prefix with https:// if it is an external link
  if (trimmed.length > 0 && !lower.startsWith("http://") && !lower.startsWith("https://") && !lower.startsWith("/") && !lower.startsWith("#") && !lower.startsWith("mailto:") && !lower.startsWith("tel:")) {
    return `https://${trimmed}`;
  }
  return trimmed;
}
