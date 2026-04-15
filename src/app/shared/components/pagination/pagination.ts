import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [MatPaginatorModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Pagination {
  readonly length = input<number>(0);
  readonly pageSize = input<number>(5);
  readonly pageIndex = input<number>(0);
  readonly pageSizeOptions = input<number[]>([5, 10, 20]);
  readonly pageChange = output<PageEvent>();
  
  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }
}
