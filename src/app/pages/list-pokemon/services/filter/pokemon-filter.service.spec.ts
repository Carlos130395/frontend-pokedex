import { TestBed } from '@angular/core/testing';
import { PokemonFilterService } from './pokemon-filter.service';

describe('PokemonFilterService', () => {
  let service: PokemonFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have an initial search term of an empty string', (done) => {
    service.searchTerm$.subscribe(term => {
      expect(term).toBe('');
      done(); // Llamamos done para indicar que la prueba asíncrona ha terminado
    });
  });

  it('should update the search term', (done) => {
    const newTerm = 'Pikachu';
    service.setSearchTerm(newTerm);

    service.searchTerm$.subscribe(term => {
      expect(term).toBe(newTerm);
      done(); // Llamamos done para indicar que la prueba asíncrona ha terminado
    });
  });
});

