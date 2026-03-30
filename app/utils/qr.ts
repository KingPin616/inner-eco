export function getPlantPath(id: string): string {
  return `/plant/${encodeURIComponent(id.trim())}`;
}

export function getPlantAbsoluteUrl(id: string, origin: string): string {
  const path = getPlantPath(id);
  return new URL(path, origin).toString();
}
