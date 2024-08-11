import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListPokemonComponent } from './list-pokemon.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { FilterListPokemonComponent } from './components/filter-list-pokemon/filter-list-pokemon.component';
import { TableListPokemonComponent } from './components/table-list-pokemon/table-list-pokemon.component';
import { ListService } from './services/list/list.service';
import { PokemonFilterService } from './services/filter/pokemon-filter.service';

describe('ListPokemonComponent', () => {
  let component: ListPokemonComponent;
  let fixture: ComponentFixture<ListPokemonComponent>;
  let listServiceMock: any;
  let filterServiceMock: any;

  beforeEach(async () => {
    listServiceMock = {
      getPokemonList: jasmine.createSpy('getPokemonList').and.returnValue(of({
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' }
        ],
        count: 2
      })),
      getPokemonByIdOrName: jasmine.createSpy('getPokemonByIdOrName').and.returnValue(of({}))
    };

    filterServiceMock = {
      searchTerm$: of('bulbasaur')
    };

    await TestBed.configureTestingModule({
      declarations: [
        ListPokemonComponent,
        FilterListPokemonComponent,
        TableListPokemonComponent
      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: ListService, useValue: listServiceMock },
        { provide: PokemonFilterService, useValue: filterServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should filter the Pokémon list based on search term', () => {
    const filterComponent = fixture.debugElement.query(By.directive(FilterListPokemonComponent)).componentInstance;
    const tableComponent = fixture.debugElement.query(By.directive(TableListPokemonComponent)).componentInstance;

    filterComponent.searchControl.setValue('bulbasaur');
    fixture.detectChanges();

    expect(tableComponent.filteredPokemons.length).toBe(1);
    expect(tableComponent.filteredPokemons[0].name).toBe('BULBASAUR');
  });
});
