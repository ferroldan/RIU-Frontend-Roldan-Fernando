import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UppercaseInputDirective } from './uppercase-input.directive';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  template: `<input appUppercaseInput [formControl]="control">`,
  standalone: true,
  imports: [UppercaseInputDirective, ReactiveFormsModule]
})
class TestComponent {
  control = new FormControl('');
}

describe('UppercaseInputDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputEl = fixture.nativeElement.querySelector('input');
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should transform input to uppercase on initial write', () => {
    component.control.setValue('batman');
    fixture.detectChanges();
    expect(inputEl.value).toBe('BATMAN');
  });

  it('should transform user input to uppercase', () => {
    inputEl.value = 'superman';
    const event = new Event('input');
    inputEl.dispatchEvent(event);
    fixture.detectChanges();
    
    expect(inputEl.value).toBe('SUPERMAN');
    expect(component.control.value).toBe('SUPERMAN');
  });

  it('should handle null values correctly', () => {
    component.control.setValue(null);
    fixture.detectChanges();
    expect(inputEl.value).toBe('');
  });

  it('should disable the input when form control is disabled', () => {
    component.control.disable();
    fixture.detectChanges();
    expect(inputEl.disabled).toBeTrue();
  });

  it('should mark the control as touched on blur', () => {
    expect(component.control.touched).toBeFalse();
    const event = new Event('blur');
    inputEl.dispatchEvent(event);
    fixture.detectChanges();
    expect(component.control.touched).toBeTrue();
  });

  it('should register onTouched', () => {
    const directive = fixture.debugElement.children[0].injector.get(UppercaseInputDirective);
    let touched = false;
    directive.registerOnTouched(() => touched = true);
    directive.onTouched();
    expect(touched).toBeTrue();
  });

  it('should call default onChange and onTouched when not registered', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        UppercaseInputDirective,
        { provide: ElementRef, useValue: { nativeElement: document.createElement('input') } },
        { provide: Renderer2, useValue: jasmine.createSpyObj('Renderer2', ['setProperty']) }
      ]
    });
    const directive = TestBed.inject(UppercaseInputDirective);
    expect(() => directive.onChange('test')).not.toThrow();
    expect(() => directive.onTouched()).not.toThrow();
  });
});
