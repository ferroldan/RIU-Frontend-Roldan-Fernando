import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PaginationResponse } from '../../../shared/interfaces/pagination-response';
import { Hero } from '../../../shared/interfaces/hero.interface';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/heroes`;

  getHeroes(name?: string, pageIndex: number = 0, pageSize: number = 10): Observable<PaginationResponse<Hero>> {
    let params = new HttpParams();
    if (name) {
      params = params.set('name', name);
    }

    params = params.set('page', pageIndex).set('size', pageSize);
    return this.http.get<PaginationResponse<Hero>>(this.apiUrl, { params });
  }

  getHeroById(id: number): Observable<Hero> {
    return this.http.get<Hero>(`${this.apiUrl}/${id}`);
  }

  createHero(hero: Partial<Hero>): Observable<Hero> {
    return this.http.post<Hero>(this.apiUrl, hero);
  }

  updateHero(id: number, hero: Partial<Hero>): Observable<Hero> {
    return this.http.put<Hero>(`${this.apiUrl}/${id}`, hero);
  }

  deleteHero(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
