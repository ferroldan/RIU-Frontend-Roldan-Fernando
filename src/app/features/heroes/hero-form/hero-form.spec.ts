import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { HeroForm } from './hero-form';
import { HeroService } from '../../../core/services/hero/hero.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Hero } from '../../../shared/interfaces/hero.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('HeroForm', () => {
  let component: HeroForm;
  let fixture: ComponentFixture<HeroForm>;
  let mockHeroService: jasmine.SpyObj<HeroService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let routeId: string | null = null;

  const mockHero: Hero = { id: 1, name: 'testname', alias: 'testalias', power: 'testpower', age: 30 };

  beforeEach(async () => {
    mockHeroService = jasmine.createSpyObj<HeroService>('HeroService', ['createHero', 'updateHero', 'getHeroById']);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);
    mockSnackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        HeroForm,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useValue: { getTranslation: () => of({}) } }
        })
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => routeId } } }
        },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();
  });

  describe('Create Mode', () => {
    beforeEach(() => {
      routeId = null;
      fixture = TestBed.createComponent(HeroForm);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should create form with default empty values', () => {
      expect(component.isEditMode()).toBeFalse();
      expect(component.heroForm.invalid).toBeTrue();
    });

    it('should call createHero on submit when form is valid', () => {
      component.heroForm.patchValue({ name: 'BATMAN', alias: 'Bruce', power: 'Money', age: 30 });
      mockHeroService.createHero.and.returnValue(of(mockHero));

      component.onSubmit();

      expect(mockHeroService.createHero).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes']);
      expect(mockSnackBar.open).toHaveBeenCalled();
    });

    it('should show error snackbar when createHero fails', () => {
      component.heroForm.patchValue({ name: 'BATMAN', alias: 'Bruce', power: 'Money', age: 30 });
      mockHeroService.createHero.and.returnValue(throwError(() => new Error('Create failed')));

      component.onSubmit();

      expect(mockHeroService.createHero).toHaveBeenCalled();
      expect(mockSnackBar.open).toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should not call createHero if form is invalid', () => {
      component.heroForm.patchValue({ name: 'B' });
      component.onSubmit();
      expect(mockHeroService.createHero).not.toHaveBeenCalled();
    });

    it('should navigate back on cancel', () => {
      component.onCancel();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes']);
    });
  });

  describe('Edit Mode', () => {
    beforeEach(() => {
      routeId = '13';
      mockHeroService.getHeroById.and.returnValue(of(mockHero));
      fixture = TestBed.createComponent(HeroForm);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should load hero and set edit mode', () => {
      expect(component.isEditMode()).toBeTrue();
      expect(component.heroId()).toBe(13);
      expect(mockHeroService.getHeroById).toHaveBeenCalledWith(13);
      expect(component.heroForm.value.name).toBe('testname');
    });

    it('should call updateHero on submit', () => {
      component.heroForm.patchValue({ name: 'updated' });
      mockHeroService.updateHero.and.returnValue(of({ ...mockHero, name: 'updated' }));

      component.onSubmit();

      expect(mockHeroService.updateHero).toHaveBeenCalledWith(13, jasmine.any(Object));
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes']);
      expect(mockSnackBar.open).toHaveBeenCalled();
    });

    it('should show error snackbar when updateHero fails', () => {
      component.heroForm.patchValue({ name: 'updated' });
      mockHeroService.updateHero.and.returnValue(throwError(() => new Error('Update failed')));
      
      component.onSubmit();

      expect(mockSnackBar.open).toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Edit Mode - Error', () => {
    beforeEach(() => {
      routeId = '10';
      mockHeroService.getHeroById.and.returnValue(throwError(() => new Error('Not found')));
      fixture = TestBed.createComponent(HeroForm);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should navigate back to heroes if hero not found', () => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes']);
    });
  });
});
