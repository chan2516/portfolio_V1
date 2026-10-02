export function invalidLinkField(value, path = '') {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) { const error = invalidLinkField(value[i], `${path}[${i}]`); if (error) return error; }
    return null;
  }
  if (!value || typeof value !== 'object') return null;
  for (const [key, item] of Object.entries(value)) {
    const field = path ? path + '.' + key : key;
    if (/(?:Url|link)$/.test(key)) {
      if (item === undefined || item === null || item === '') continue;
      if (typeof item !== 'string' || item.length > 2000 || /\s/.test(item)) return field;
      try { const url = new URL(item); if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return field; } catch { return field; }
    } else {
      const error = invalidLinkField(item, field); if (error) return error;
    }
  }
  return null;
}
export const validLinks = value => !invalidLinkField(value);
export function validateLinkRequest(req, res, next) {
  const field = invalidLinkField(req.body);
  if (field) return res.status(400).json({ message: `${field}: enter a complete HTTP or HTTPS URL without embedded credentials, or leave this optional link blank.` });
  next();
}
