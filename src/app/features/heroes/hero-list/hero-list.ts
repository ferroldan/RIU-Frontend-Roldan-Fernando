import { Component, ChangeDetectionStrategy, inject, signal, DestroyRef, computed } from '@angular/core';
import { HeroSearch } from "./hero-search/hero-search";
import { HeroTable } from "./hero-table/hero-table";
import { Pagination } from "../../../shared/components/pagination/pagination";
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HeroService } from '../../../core/services/hero/hero.service';
import { Hero } from '../../../shared/interfaces/hero.interface';
import { PageEvent } from '@angular/material/paginator';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, EMPTY, filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [HeroSearch, HeroTable, Pagination],
  templateUrl: './hero-list.html',
  styleUrl: './hero-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroList {
  private readonly router = inject(Router);
  private readonly heroService = inject(HeroService);
  private readonly dialog = inject(MatDialog);
  private readonly translate = inject(TranslateService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  readonly heroes = computed(() => this.heroesResponse().data);
  readonly totalHeroes = computed(() => this.heroesResponse().total);
  readonly currentPageIndex = signal<number>(0);
  readonly currentPageSize = signal<number>(5);
  readonly currentSearch = signal('');
  readonly refreshPage = signal(0);

  private readonly heroesResponse = toSignal(
    combineLatest([
      toObservable(this.currentSearch),
      toObservable(this.currentPageIndex),
      toObservable(this.currentPageSize),
      toObservable(this.refreshPage)
    ]).pipe(
      switchMap(([search, pageIndex, pageSize]) =>
        this.heroService.getHeroes(search, pageIndex, pageSize).pipe(
          tap(response => {
            if (!response.data.length && pageIndex > 0) {
              this.currentPageIndex.update(v => v - 1);
            }
          }),
          filter(response => response.data.length > 0 || pageIndex === 0),
          catchError(() => {
            this.showLoadError();
            return EMPTY;
          })
        )
      )
    ),
    {
      initialValue: {
        data: [],
        total: 0
      }
    }
  );

  searchHeroes(query: string): void {
    this.currentSearch.set(query);
    this.currentPageIndex.set(0);
  }

  addHero(): void {
    this.router.navigate(['/heroes/new']);
  }

  editHero(hero: Hero): void {
    this.router.navigate(['/heroes/edit', hero.id]);
  }

  onPageChange(event: PageEvent): void {
    this.currentPageIndex.set(event.pageIndex);
    this.currentPageSize.set(event.pageSize);
  }

  deleteHero(hero: Hero): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: this.translate.instant('SHARED.CONFIRM_DIALOG.DELETE_MESSAGE', { name: hero.name }) }
    });

    dialogRef.afterClosed().pipe(
      filter(Boolean),
      switchMap(() => this.heroService.deleteHero(hero.id)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.snackBar.open(this.translate.instant('SHARED.SNACKBAR.DELETE_SUCCESS'), this.translate.instant('SHARED.SNACKBAR.CLOSE'), { duration: 3000 });
        this.refreshPage.update(v => v + 1);
      },
      error: () => {
        this.snackBar.open(this.translate.instant('SHARED.SNACKBAR.DELETE_ERROR'), this.translate.instant('SHARED.SNACKBAR.CLOSE'), { duration: 3000 });
      }
    });
  }

  private showLoadError(): void {
    this.snackBar.open(
      this.translate.instant('SHARED.SNACKBAR.LOAD_ERROR'),
      this.translate.instant('SHARED.SNACKBAR.CLOSE'),
      { duration: 3000 }
    );
  }
}
