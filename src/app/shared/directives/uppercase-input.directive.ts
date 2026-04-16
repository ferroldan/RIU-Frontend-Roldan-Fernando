import { Directive, ElementRef, HostListener, forwardRef, Renderer2, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appUppercaseInput]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UppercaseInputDirective),
      multi: true
    }
  ]
})
export class UppercaseInputDirective implements ControlValueAccessor {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    const formatted = value ? value.toUpperCase() : '';
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', formatted);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.toUpperCase();
    this.renderer.setProperty(input, 'value', value);
    this.onChange(value);
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }
}
