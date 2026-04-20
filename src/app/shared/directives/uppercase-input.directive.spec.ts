import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UppercaseInputDirective } from './uppercase-input.directive';

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
    inputEl.value = 'batman';
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(inputEl.value).toBe('BATMAN');
    expect(component.control.value).toBe('BATMAN');
  });

  it('should preserve already uppercase values', () => {
    inputEl.value = 'SUPERMAN';
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(inputEl.value).toBe('SUPERMAN');
    expect(component.control.value).toBe('SUPERMAN');
  });

  it('should handle empty input correctly', () => {
    inputEl.value = '';
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(inputEl.value).toBe('');
    expect(component.control.value).toBe('');
  });

  it('should update form control programmatically', () => {
    component.control.setValue('wonder woman');
    fixture.detectChanges();

    expect(inputEl.value).toBe('wonder woman');
  });
});