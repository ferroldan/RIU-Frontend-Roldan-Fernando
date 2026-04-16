import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  readonly currentLang = signal<string>('es');

  constructor(private translate: TranslateService) {
    this.translate.use(this.currentLang());
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLang.set(lang);
  }
}
