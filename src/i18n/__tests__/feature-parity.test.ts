import { ar } from '../locales/ar';
import { en } from '../locales/en';
import { tr } from '../locales/tr';

function leafKeys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix];
  return Object.entries(value)
    .flatMap(([key, child]) => leafKeys(child, prefix ? `${prefix}.${key}` : key))
    .sort();
}

describe('new mode translation parity', () => {
  it.each(['privateWorship', 'travel', 'demo'] as const)('%s has the same TR, EN and AR keys', (section) => {
    const expected = leafKeys(tr[section]);
    expect(leafKeys(en[section])).toEqual(expected);
    expect(leafKeys(ar[section])).toEqual(expected);
  });
});
