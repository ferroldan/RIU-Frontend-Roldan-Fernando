import { Component, ChangeDetectionStrategy, OnInit, inject, OnDestroy, signal } from '@angular/core';
import { HeroSearch } from "./hero-search/hero-search";
import { HeroTable } from "./hero-table/hero-table";
import { Pagination } from "../../../shared/components/pagination/pagination";
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { HeroService } from '../../../core/services/hero/hero.service';
import { Hero } from '../../../shared/interfaces/hero.interface';
import { PageEvent } from '@angular/material/paginator';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [HeroSearch, HeroTable, Pagination],
  templateUrl: './hero-list.html',
  styleUrl: './hero-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroList implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly heroService = inject(HeroService);
  private readonly dialog = inject(MatDialog);
  private readonly translate = inject(TranslateService);
  private readonly snackBar = inject(MatSnackBar);

  readonly destroy$ = new Subject<void>();

  readonly heroes = signal<Hero[]>([]);
  readonly totalHeroes = signal<number>(0);
  readonly currentPageIndex = signal<number>(0);
  readonly currentPageSize = signal<number>(5);
  
  private currentSearch = '';

  ngOnInit(): void {
    this.loadHeroes();
  }

  loadHeroes(name?: string, pageIndex: number = 0, pageSize: number = 5): void {
    this.heroService.getHeroes(name, pageIndex, pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.heroes.set(response.data);
        this.totalHeroes.set(response.total);
      });
  }

  searchHeroes(query: string): void {
    this.currentSearch = query;
    this.currentPageIndex.set(0);
    this.loadHeroes(query, 0, this.currentPageSize());
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
    this.loadHeroes(this.currentSearch, event.pageIndex, event.pageSize);
  }

  deleteHero(hero: Hero): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: this.translate.instant('SHARED.CONFIRM_DIALOG.DELETE_MESSAGE', { name: hero.name }) }
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result) {
        this.heroService.deleteHero(hero.id).pipe(takeUntil(this.destroy$)).subscribe({
          next: () => {
            let targetPage = this.currentPageIndex();
            const pageSize = this.currentPageSize();
            const currentTotal = this.totalHeroes();

            if (currentTotal > 0 && currentTotal % pageSize === 1 && targetPage > 0) {
              targetPage--;
              this.currentPageIndex.set(targetPage);
            }

            this.snackBar.open(this.translate.instant('SHARED.SNACKBAR.DELETE_SUCCESS'), this.translate.instant('SHARED.SNACKBAR.CLOSE'), { duration: 3000 });
            this.loadHeroes(this.currentSearch, targetPage, pageSize);
          },
          error: () => {
            this.snackBar.open(this.translate.instant('SHARED.SNACKBAR.DELETE_ERROR'), this.translate.instant('SHARED.SNACKBAR.CLOSE'), { duration: 3000 });
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
