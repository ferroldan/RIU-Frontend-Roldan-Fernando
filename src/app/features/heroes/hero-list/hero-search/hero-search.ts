import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hero-search',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './hero-search.html',
  styleUrl: './hero-search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroSearch {
  readonly searchChange = output<string>();
  readonly addHero = output<void>();
  readonly searchControl = new FormControl('');

  constructor() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed()
      ).subscribe(value => {
        this.searchChange.emit(value ?? '');
      }
    )
  }
}
