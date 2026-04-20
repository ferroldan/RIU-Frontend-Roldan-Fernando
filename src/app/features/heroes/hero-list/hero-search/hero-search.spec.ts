import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

import { HeroSearch } from './hero-search';

describe('HeroSearch', () => {
  let component: HeroSearch;
  let fixture: ComponentFixture<HeroSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeroSearch,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useValue: { getTranslation: () => of({}) } }
        })
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit searchChange with a term after debounce', fakeAsync(() => {
    let emittedValue: string | undefined;
    component.searchChange.subscribe(v => (emittedValue = v));

    component.searchControl.setValue('Spider');
    tick(300);

    expect(emittedValue).toBe('Spider');
  }));

  it('should emit empty string when value is cleared', fakeAsync(() => {
    let emittedValue: string | undefined;
    component.searchChange.subscribe(v => (emittedValue = v));

    component.searchControl.setValue('Spider');
    tick(300);
    component.searchControl.setValue('');
    tick(300);

    expect(emittedValue).toBe('');
  }));

  it('should emit addHero when button is clicked', () => {
    let clicked = false;
    component.addHero.subscribe(() => (clicked = true));

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[mat-raised-button]');
    button.click();

    expect(clicked).toBeTruthy();
  });
});
