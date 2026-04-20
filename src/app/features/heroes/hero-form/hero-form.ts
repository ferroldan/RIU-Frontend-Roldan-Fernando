import { Component, ChangeDetectionStrategy, inject, signal, DestroyRef } from '@angular/core';
import { HeroService } from '../../../core/services/hero/hero.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Hero } from '../../../shared/interfaces/hero.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UppercaseInputDirective } from '../../../shared/directives/uppercase-input.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    TranslateModule,
    UppercaseInputDirective
  ],
  templateUrl: './hero-form.html',
  styleUrl: './hero-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroForm {
  private formBuilder = inject(FormBuilder);
  private heroService = inject(HeroService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly heroId = signal<number | null>(null);
  readonly isEditMode = signal<boolean>(false);
  readonly heroForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    alias: ['', [Validators.required]],
    power: ['', [Validators.required]],
    age: this.formBuilder.nonNullable.control<number>(0, [Validators.required, Validators.min(10), Validators.max(100)])
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.heroId.set(+id);
      this.isEditMode.set(true);
      this.searchHeroById(+id);
    }
  }

  searchHeroById(id: number): void {
    this.heroService.getHeroById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (hero) => this.heroForm.patchValue(hero),
        error: () => this.router.navigate(['/heroes'])
      });
  }

  onSubmit(): void {
    if (this.heroForm.invalid) {
      this.heroForm.markAllAsTouched();
      return;
    }
    const formValue = this.heroForm.value as Partial<Hero>;

    if (this.isEditMode() && this.heroId()) {
      this.heroService.updateHero(this.heroId() as number, formValue)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.snackBar.open(this.translate.instant('SHARED.SNACKBAR.UPDATE_SUCCESS'), this.translate.instant('SHARED.SNACKBAR.CLOSE'), { duration: 3000 });
            this.router.navigate(['/heroes']);
          },
          error: () => {
            this.snackBar.open(this.translate.instant('SHARED.SNACKBAR.UPDATE_ERROR'), this.translate.instant('SHARED.SNACKBAR.CLOSE'), { duration: 3000 });
          }
        });
    } else {
      this.heroService.createHero(formValue)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.snackBar.open(this.translate.instant('SHARED.SNACKBAR.CREATE_SUCCESS'), this.translate.instant('SHARED.SNACKBAR.CLOSE'), { duration: 3000 });
            this.router.navigate(['/heroes']);
          },
          error: () => {
            this.snackBar.open(this.translate.instant('SHARED.SNACKBAR.CREATE_ERROR'), this.translate.instant('SHARED.SNACKBAR.CLOSE'), { duration: 3000 });
          }
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/heroes']);
  }
}
