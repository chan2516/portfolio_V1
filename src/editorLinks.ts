import { SiteConfig } from './siteConfig';
export function linkValue(config: SiteConfig, field: string) {
  const [group, id, key] = field.split(':');
  const value = config.content[group];
  return key && Array.isArray(value) ? value.find(item => item.id === id)?.[key] || '' : value?.[id] || '';
}
export function updateLink(config: SiteConfig, field: string, url: string): SiteConfig {
  const [group, id, key] = field.split(':');
  const value = config.content[group];
  if (!['contactData', 'projectsData', 'experienceData'].includes(group) || !/Url$/.test(key || id)) return config;
  return { ...config, content: { ...config.content, [group]: key && Array.isArray(value) ? value.map(item => item.id === id ? { ...item, [key]: url } : item) : { ...value, [id]: url } } };
}
