import { DEFAULT_THEME_PRESET, DEFAULT_THEME_PRIMARY, getPrimaryPresetExtension, resolveThemePresetName, resolveThemePrimaryName, resolveThemeSurfaceName } from '@/layout/utils/theme';
import { describe, expect, it } from 'vitest';

describe('resolveThemePresetName', () => {
    it('falls back to the default preset when the env value is invalid', () => {
        expect(resolveThemePresetName('InvalidPreset')).toBe(DEFAULT_THEME_PRESET);
    });

    it('keeps valid preset names', () => {
        expect(resolveThemePresetName('Nora')).toBe('Nora');
    });
});

describe('resolveThemePrimaryName', () => {
    it('falls back to the default primary palette when the env value is invalid', () => {
        expect(resolveThemePrimaryName('invalid-primary')).toBe(DEFAULT_THEME_PRIMARY);
    });

    it('keeps valid primary palette names', () => {
        expect(resolveThemePrimaryName('noir')).toBe('noir');
    });
});

describe('resolveThemeSurfaceName', () => {
    it('returns null for unknown surfaces', () => {
        expect(resolveThemeSurfaceName('unknown-surface')).toBeNull();
    });

    it('keeps valid surface names', () => {
        expect(resolveThemeSurfaceName('ocean')).toBe('ocean');
    });
});

describe('getPrimaryPresetExtension', () => {
    it('builds the noir preset from the surface scale', () => {
        const extension = getPrimaryPresetExtension('noir');
        const noirSemantic = extension.semantic as { primary: Record<string, string>; colorScheme: { light: { primary: { color: string } } } };

        expect(noirSemantic.primary['50']).toBe('{surface.50}');
        expect(noirSemantic.colorScheme.light.primary.color).toBe('{primary.950}');
    });
});
