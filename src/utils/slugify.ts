import { v4 as uuidv4 } from 'uuid';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .concat('-', uuidv4());
}
