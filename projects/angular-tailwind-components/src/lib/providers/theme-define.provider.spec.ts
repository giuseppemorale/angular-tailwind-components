import { TestBed } from '@angular/core/testing';
import { TAILWIND_BUTTON_KIND, TAILWIND_COMPONENTS_SIZE } from '../tokens';
import { defineTheme } from './theme-define.provider';

describe('defineTheme', () => {
  it('registers injection token providers from config', () => {
    TestBed.configureTestingModule({
      providers: [
        defineTheme({
          buttonKind: 'flat',
          componentsSize: 'lg'
        })
      ]
    });

    expect(TestBed.inject(TAILWIND_BUTTON_KIND)).toBe('flat');
    expect(TestBed.inject(TAILWIND_COMPONENTS_SIZE)).toBe('lg');
  });
});
