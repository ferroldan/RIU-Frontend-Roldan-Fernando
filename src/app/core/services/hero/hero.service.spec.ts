import { TestBed } from '@angular/core/testing';
import { HeroService } from './hero.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Hero } from '../../../shared/interfaces/hero.interface';
import { PaginationResponse } from '../../../shared/interfaces/pagination-response';
import { provideHttpClient } from '@angular/common/http';

describe('HeroService', () => {
  let service: HeroService;
  let httpTestingController: HttpTestingController;
  const mockHeroes: Hero[] = [
    { id: 1, name: 'Spiderman', alias: 'Peter Parker', power: 'Marvel', age: 25 }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting(), HeroService, provideHttpClient]
    });
    service = TestBed.inject(HeroService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all heroes with pagination info', () => {
    service.getHeroes().subscribe((response: PaginationResponse<Hero>) => {
      expect(response.data.length).toBe(1);
      expect(response.data).toEqual(mockHeroes);
      expect(response.total).toBe(1);
    });
    const req = httpTestingController.expectOne('/api/heroes?page=0&size=10');
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockHeroes, total: 1 });
  });

  it('should return hero by name via query parameter', () => {
    service.getHeroes('Spider', 1, 5).subscribe((response: PaginationResponse<Hero>) => {
      expect(response.data).toEqual(mockHeroes);
    });
    const req = httpTestingController.expectOne('/api/heroes?name=Spider&page=1&size=5');
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockHeroes, total: 1 });
  });

  it('should return a hero by id', () => {
    service.getHeroById(1).subscribe(hero => {
      expect(hero).toEqual(mockHeroes[0]);
    });
    const req = httpTestingController.expectOne('/api/heroes/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes[0]);
  });

  it('should create a new hero', () => {
    const newHero: Partial<Hero> = { name: 'Batman', alias: 'Bruce Wayne', power: 'Money', age: 35 };
    const savedHero = { ...newHero, id: 2 } as Hero;

    service.createHero(newHero).subscribe(hero => {
      expect(hero).toEqual(savedHero);
    });
    const req = httpTestingController.expectOne('/api/heroes');
    expect(req.request.method).toBe('POST');
    req.flush(savedHero);
  });

  it('should update a hero', () => {
    const updateHero: Partial<Hero> = { name: 'Batman Updated' };
    const updatedHero = { ...mockHeroes[0], ...updateHero } as Hero;

    service.updateHero(1, updateHero).subscribe(hero => {
      expect(hero).toEqual(updatedHero);
    });
    const req = httpTestingController.expectOne('/api/heroes/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedHero);
  });

  it('should delete a hero', () => {
    service.deleteHero(1).subscribe(res => {
      expect(res).toBeNull();
    });
    const req = httpTestingController.expectOne('/api/heroes/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
