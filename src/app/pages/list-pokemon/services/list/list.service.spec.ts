import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ListService } from './list.service';
import { IResponsePokemon } from '../../interface/pokemon';

describe('ListService', () => {
  let service: ListService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ListService],
    });
    service = TestBed.inject(ListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica que no queden solicitudes pendientes después de cada prueba
    httpMock.verify();
  });

  it('should be created', () => {
    // Verifica que el servicio fue creado correctamente
    expect(service).toBeTruthy();
  });

  it('should fetch a list of Pokémon', () => {
    const mockResponse: IResponsePokemon = {
      count: 1118,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      ],
    };

    // Llama al método y suscríbete al Observable que retorna
    service.getPokemonList(20, 0).subscribe((response) => {
      // Verifica que la respuesta sea igual a la simulada
      expect(response).toEqual(mockResponse);
      // Verifica que el número de resultados sea el esperado
      expect(response.results.length).toBe(2);
      // Verifica el nombre del primer Pokémon en la lista
      expect(response.results[0].name).toBe('bulbasaur');
    });

    // Verifica que la solicitud HTTP se haya hecho con la URL correcta
    const req = httpMock.expectOne(
      'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0'
    );
    expect(req.request.method).toBe('GET');
    // Responde con los datos simulados
    req.flush(mockResponse);
  });

  it('should fetch a Pokémon by ID or name', () => {
    const mockPokemon = {
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
    };

    // Llama al método con un ID o nombre de Pokémon
    service.getPokemonByIdOrName('bulbasaur').subscribe((response) => {
      // Verifica que la respuesta coincida con el Pokémon simulado
      expect(response).toEqual(mockPokemon);
      expect(response.name).toBe('bulbasaur');
      expect(response.id).toBe(1);
    });

    // Verifica que la solicitud HTTP se haya hecho con la URL correcta
    const req = httpMock.expectOne(
      'https://pokeapi.co/api/v2/pokemon/bulbasaur'
    );
    expect(req.request.method).toBe('GET');
    // Responde con los datos simulados
    req.flush(mockPokemon);
  });
});
