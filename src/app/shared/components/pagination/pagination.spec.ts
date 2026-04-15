import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pagination } from './pagination';
import { ComponentRef } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

describe('Pagination', () => {
  let component: Pagination;
  let fixture: ComponentFixture<Pagination>;
  let componentRef: ComponentRef<Pagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagination]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pagination);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect the length input', () => {
    componentRef.setInput('length', 100);
    fixture.detectChanges();
    expect(component.length()).toBe(100);
  });

  it('should reflect the pageIndex input', () => {
    componentRef.setInput('pageIndex', 2);
    fixture.detectChanges();
    expect(component.pageIndex()).toBe(2);
  });

  it('should reflect the pageSize input', () => {
    componentRef.setInput('pageSize', 20);
    fixture.detectChanges();
    expect(component.pageSize()).toBe(20);
  });

  it('should render the mat-paginator element', () => {
    const paginator = fixture.nativeElement.querySelector('mat-paginator');
    expect(paginator).toBeTruthy();
  });

  it('should emit pageChange event on page change', () => {
    let emittedEvent: PageEvent | undefined;
    component.pageChange.subscribe(e => (emittedEvent = e));

    const mockEvent: PageEvent = { pageIndex: 1, pageSize: 10, length: 100 };
    component.onPageChange(mockEvent);

    expect(emittedEvent).toEqual(mockEvent);
  });
});
