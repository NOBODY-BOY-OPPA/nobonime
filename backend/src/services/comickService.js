export async function getChapter(mangaId, chapterId) {
  const template = process.env.COMICK_CHAPTER_URL;
  if (!template) { const error = new Error('ComicK integration is not configured'); error.status = 503; throw error; }
  const url = template
    .replaceAll('{mangaId}', encodeURIComponent(mangaId))
    .replaceAll('{chapterId}', encodeURIComponent(chapterId));
  const response = await fetch(url);
  if (!response.ok) { const error = new Error(`ComicK returned ${response.status}`); error.status = 503; throw error; }
  const data = await response.json();
  if (!Array.isArray(data.pages)) { const error = new Error('ComicK response has no pages'); error.status = 503; throw error; }
  return { ...data, source: 'ComicK' };
}
