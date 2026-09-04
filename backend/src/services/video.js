import axios from 'axios';
import * as cheerio from 'cheerio';

const cooldownMs = Number(process.env.VIDEO_PROVIDER_COOLDOWN_MS || 60_000);
const failures = new Map();

function configuredProviders() {
  try {
    const configured = process.env.VIDEO_PROVIDERS_JSON ? JSON.parse(process.env.VIDEO_PROVIDERS_JSON) : [];
    if (!Array.isArray(configured)) throw new Error('VIDEO_PROVIDERS_JSON must be an array');
    return configured.filter((item) => item?.url).map((item, index) => ({
      name: item.name || `provider-${index + 1}`,
      template: item.url,
      quality: item.quality || 'auto',
      type: item.type || 'direct'
    }));
  } catch (error) {
    if (process.env.VIDEO_PROVIDERS_JSON) console.error(`[video] invalid provider configuration: ${error.message}`);
    return [
      { name: 'primary', template: process.env.VIDEO_PRIMARY_URL, quality: '1080p', type: 'direct' },
      { name: 'fallback', template: process.env.VIDEO_FALLBACK_URL, quality: '720p', type: 'direct' }
    ].filter((provider) => provider.template);
  }
}

function isCooling(name) {
  return (failures.get(name) || 0) > Date.now();
}

async function resolveProvider(provider, id) {
  const target = provider.template.replaceAll('{id}', encodeURIComponent(id));
  if (provider.type === 'html') {
    const response = await axios.get(target, { timeout: 10_000 });
    const $ = cheerio.load(response.data);
    const url = $('video source[src], source[src], video[src]').first().attr('src');
    if (!url || !/\.(m3u8|mp4)(\?|$)/i.test(url)) throw new Error('No playable media URL found');
    return { provider: provider.name, url: new URL(url, target).toString(), quality: provider.quality };
  }
  if (!/\.(m3u8|mp4)(\?|$)/i.test(target)) throw new Error('Provider URL must resolve to .m3u8 or .mp4');
  return { provider: provider.name, url: target, quality: provider.quality };
}

export async function resolveVideo(id) {
  const providers = configuredProviders();
  if (!providers.length) { console.warn('[video] no providers configured'); return null; }
  for (const provider of providers) {
    if (isCooling(provider.name)) continue;
    try {
      const result = await resolveProvider(provider, id);
      failures.delete(provider.name);
      return result;
    } catch (error) {
      failures.set(provider.name, Date.now() + cooldownMs);
      console.warn(`[video] ${provider.name} failed for ${id}: ${error.message}`);
    }
  }
  return null;
}
