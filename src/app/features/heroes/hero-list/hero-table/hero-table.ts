import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Hero } from '../../../../shared/interfaces/hero.interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hero-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    TranslateModule
  ],
  templateUrl: './hero-table.html',
  styleUrl: './hero-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroTable {
  readonly heroes = input<Hero[]>([]);
  readonly editHero = output<Hero>();
  readonly deleteHero = output<Hero>();

  readonly displayedColumns = ['name', 'alias', 'power', 'age', 'actions'];
}
