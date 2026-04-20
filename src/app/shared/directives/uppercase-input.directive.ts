import { Directive, HostListener, inject, ElementRef } from '@angular/core';

@Directive({
  selector: '[appUppercaseInput]',
  standalone: true
})
export class UppercaseInputDirective {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);

  @HostListener('input')
  onInput(): void {
    const input = this.elementRef.nativeElement;
    const transformed = input.value.toUpperCase();

    if (input.value === transformed) return;

    input.value = transformed;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
}