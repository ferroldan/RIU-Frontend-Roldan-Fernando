import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

import { HeroList } from './hero-list';
import { HeroService } from '../../../core/services/hero/hero.service';
import { Router } from '@angular/router';
import { Hero } from '../../../shared/interfaces/hero.interface';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';

describe('HeroList', () => {
  let component: HeroList;
  let fixture: ComponentFixture<HeroList>;
  let mockHeroService: jasmine.SpyObj<HeroService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  const mockHeroes: Hero[] = [
    { id: 1, name: 'Spiderman', alias: 'Peter Parker', power: 'spider-sense', age: 35 }
  ];

  beforeEach(async () => {
    mockHeroService = jasmine.createSpyObj('HeroService', ['getHeroes', 'deleteHero']);
    mockHeroService.getHeroes.and.returnValue(of({ data: mockHeroes, total: mockHeroes.length }));
    mockHeroService.deleteHero.and.returnValue(of(undefined));
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockDialog.open.and.returnValue({ afterClosed: () => of(true) } as any);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        HeroList,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useValue: { getTranslation: () => of({}) } }
        })
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeroList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create and load heroes initially', () => {
    expect(component).toBeTruthy();
    expect(mockHeroService.getHeroes).toHaveBeenCalledWith('', 0, 5);
    expect(component.heroes()).toEqual(mockHeroes);
  });

  it('should display error snackbar if loadHeroes fails', () => {
    mockHeroService.getHeroes.and.returnValue(throwError(() => new Error('Load failed')));
    component.refreshPage.update(v => v + 1);
    fixture.detectChanges();
    expect(mockSnackBar.open).toHaveBeenCalled();
  });

  it('should load heroes with the search term when onSearchChange is called', () => {
    component.searchHeroes('Spider');
    fixture.detectChanges();
    expect(mockHeroService.getHeroes).toHaveBeenCalledWith('Spider', 0, 5);
  });

  it('should reset currentPageIndex to 0 when onSearchChange is called', () => {
    component.currentPageIndex.set(2);
    component.searchHeroes('Spider');
    expect(component.currentPageIndex()).toBe(0);
  });

  it('should navigate to add hero page', () => {
    component.addHero();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes/new']);
  });

  it('should navigate to edit hero page', () => {
    component.editHero(mockHeroes[0]);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes/edit', 1]);
  });

  it('should open confirmation dialog and delete hero on confirm', () => {
    component.deleteHero(mockHeroes[0]);
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockHeroService.deleteHero).toHaveBeenCalledWith(1);
    fixture.detectChanges();
    expect(mockHeroService.getHeroes).toHaveBeenCalledTimes(2);
    expect(mockSnackBar.open).toHaveBeenCalled();
  });

  it('should display error snackbar if delete fails', () => {
    mockHeroService.deleteHero.and.returnValue(throwError(() => new Error('Delete failed')));
    component.deleteHero(mockHeroes[0]);
    expect(mockSnackBar.open).toHaveBeenCalled();
  });

  it('should not delete hero if dialog is cancelled', () => {
    (mockDialog.open as jasmine.Spy).and.returnValue({
      afterClosed: () => of(false)
    } as any);
    component.deleteHero(mockHeroes[0]);
    expect(mockHeroService.deleteHero).not.toHaveBeenCalled();
  });

  it('should update currentPageIndex and currentPageSize on page change', () => {
    component.onPageChange({ pageIndex: 1, pageSize: 10, length: 50 } as any);
    fixture.detectChanges();
    expect(component.currentPageIndex()).toBe(1);
    expect(component.currentPageSize()).toBe(10);
    expect(mockHeroService.getHeroes).toHaveBeenCalledWith('', 1, 10);
  });

  it('should use currentSearch when loading after a page change', () => {
    component.searchHeroes('Spider');
    fixture.detectChanges();
    component.onPageChange({ pageIndex: 2, pageSize: 20, length: 100 } as any);
    fixture.detectChanges();
    expect(mockHeroService.getHeroes).toHaveBeenCalledWith('Spider', 2, 20);
  });

  it('should decrement page index if empty page is loaded and page > 0', () => {
    mockHeroService.getHeroes.and.returnValue(of({ data: [], total: 5 }));
    component.currentPageIndex.set(1);
    fixture.detectChanges();
    expect(component.currentPageIndex()).toBe(0);
  });

  it('should not decrement page index when already on the first page', () => {
    component.currentPageIndex.set(0);
    component.deleteHero(mockHeroes[0]);
    fixture.detectChanges();
    expect(component.currentPageIndex()).toBe(0);
  });

  it('should load heroes with currentSearch when page size is current value', () => {
    component.currentPageSize.set(10);
    component.searchHeroes('Batman');
    fixture.detectChanges();
    expect(mockHeroService.getHeroes).toHaveBeenCalledWith('Batman', 0, 10);
  });
});
