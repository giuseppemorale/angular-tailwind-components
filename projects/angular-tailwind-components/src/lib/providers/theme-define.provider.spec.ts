import { buildTailwindThemeVariableEntries } from './theme-define.provider';

describe('buildTailwindThemeVariableEntries', () => {
  it('maps string palette to var references for each shade', () => {
    const entries = buildTailwindThemeVariableEntries({
      colors: { primary: 'indigo' }
    });
    expect(entries).toContainEqual(['--color-primary-600', 'var(--color-indigo-600)']);
    expect(entries.find(([k]) => k === '--color-on-primary-600')).toBeUndefined();
  });

  it('writes flat shade object as CSS colors (legacy)', () => {
    const entries = buildTailwindThemeVariableEntries({
      colors: { success: { 600: '#abc', 700: '#def' } }
    });
    expect(entries).toContainEqual(['--color-success-600', '#abc']);
    expect(entries).toContainEqual(['--color-success-700', '#def']);
  });

  it('writes on-* variables from structured palette', () => {
    const entries = buildTailwindThemeVariableEntries({
      colors: {
        danger: {
          shades: { 600: '#900', 700: '#800' },
          on: { 600: '#fff', 700: '#f0f0f0' }
        }
      }
    });
    expect(entries).toContainEqual(['--color-danger-600', '#900']);
    expect(entries).toContainEqual(['--color-on-danger-600', '#fff']);
    expect(entries).toContainEqual(['--color-on-danger-700', '#f0f0f0']);
  });

  it('maps error alias to danger semantic keys', () => {
    const entries = buildTailwindThemeVariableEntries({
      colors: { error: { 500: '#e00' } }
    });
    expect(entries).toContainEqual(['--color-danger-500', '#e00']);
  });

  it('ignores invalid shade keys on flat objects', () => {
    const entries = buildTailwindThemeVariableEntries({
      colors: { info: { 600: '#00f', foo: 'x' } as Record<string, string> }
    });
    expect(entries).toContainEqual(['--color-info-600', '#00f']);
    expect(entries.some(([k]) => k.includes('foo'))).toBe(false);
  });
});
