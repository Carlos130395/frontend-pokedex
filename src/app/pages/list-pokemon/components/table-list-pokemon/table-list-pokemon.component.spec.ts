import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { TableListPokemonComponent } from './table-list-pokemon.component';
import { ListService } from '../../services/list/list.service';
import { PokemonFilterService } from '../../services/filter/pokemon-filter.service';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa HttpClientTestingModule
import { of } from 'rxjs';

describe('TableListPokemonComponent', () => {
  let component: TableListPokemonComponent;
  let fixture: ComponentFixture<TableListPokemonComponent>;
  let listServiceMock: any;
  let filterServiceMock: any;

  beforeEach(async () => {
    // Mock de ListService
    listServiceMock = {
      getPokemonList: jasmine.createSpy('getPokemonList').and.returnValue(
        of({
          results: [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          ],
          count: 1,
        })
      ),
      getPokemonByIdOrName: jasmine
        .createSpy('getPokemonByIdOrName')
        .and.returnValue(
          of({
            name: 'bulbasaur',
            order: 1,
            weight: 69,
            height: 7,
            types: [{ type: { name: 'grass' } }],
            sprites: {},
          })
        ),
    };

    // Mock de PokemonFilterService
    filterServiceMock = {
      searchTerm$: of('bulbasaur'),
    };

    await TestBed.configureTestingModule({
      declarations: [TableListPokemonComponent],
      imports: [HttpClientTestingModule], // Importa HttpClientTestingModule aquí
      providers: [
        { provide: ListService, useValue: listServiceMock },
        { provide: PokemonFilterService, useValue: filterServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableListPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the list of Pokémon on init', () => {
    expect(listServiceMock.getPokemonList).toHaveBeenCalledWith(
      component.limit,
      component.offset
    );
    expect(component.pokemons.length).toBe(1);
    expect(component.pokemons[0].name).toBe('BULBASAUR');
  });

  it('should filter the list of Pokémon based on search term', () => {
    component.filterPokemons('bulba');
    expect(component.filteredPokemons.length).toBe(1);
    expect(component.filteredPokemons[0].name).toBe('BULBASAUR');
  });

  it('should call getPokemonDetails when a Pokémon is toggled as favorite', () => {
    component.toggleFavorite(0);
    expect(listServiceMock.getPokemonByIdOrName).toHaveBeenCalledWith('1');
  });

  it('should open the Pokémon modal when a Pokémon is selected', () => {
    spyOn(component, 'openPokemonModal');
    component.getPokemonDetails('bulbasaur');
    expect(component.openPokemonModal).toHaveBeenCalledWith(
      component.selectedPokemon
    );
  });

  it('should mark all Pokémon as favorites when selectAllFavorites is called', () => {
    component.selectAllFavorites();
    expect(
      component.pokemons.every((pokemon) => pokemon.isFavorite)
    ).toBeTrue();
  });

  it('should navigate to the next page when nextPage is called', () => {
    const initialOffset = component.offset;
    component.totalPokemons = 40;
    component.nextPage();
    expect(component.offset).toBe(initialOffset + component.limit);
    expect(listServiceMock.getPokemonList).toHaveBeenCalledWith(
      component.limit,
      component.offset
    );
  });

  it('should navigate to the previous page when previousPage is called', () => {
    component.offset = 20;
    const initialOffset = component.offset;
    component.previousPage();
    expect(component.offset).toBe(initialOffset - component.limit);
    expect(listServiceMock.getPokemonList).toHaveBeenCalledWith(
      component.limit,
      component.offset
    );
  });

  it('should show an alert if trying to view favorites when there are none', () => {
    spyOn(window, 'alert');
    const event = new Event('click');
    component.showFavorites(event);
    expect(window.alert).toHaveBeenCalledWith(
      'No hay Pokémon favoritos seleccionados.'
    );
  });
});
