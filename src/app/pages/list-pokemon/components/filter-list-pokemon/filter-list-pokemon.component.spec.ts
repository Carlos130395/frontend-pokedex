import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FilterListPokemonComponent } from './filter-list-pokemon.component';
import { PokemonFilterService } from '../../services/filter/pokemon-filter.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('FilterListPokemonComponent', () => {
  let component: FilterListPokemonComponent;
  let fixture: ComponentFixture<FilterListPokemonComponent>;
  let filterServiceMock: any;

  beforeEach(async () => {
    filterServiceMock = {
      setSearchTerm: jasmine.createSpy('setSearchTerm')
    };

    await TestBed.configureTestingModule({
      declarations: [FilterListPokemonComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: PokemonFilterService, useValue: filterServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterListPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update search term in the service when search control value changes', fakeAsync(() => {
    const searchTerm = 'Pikachu';

    component.searchControl.setValue(searchTerm);

    // Simula el paso del tiempo igual al debounceTime
    tick(300);

    expect(filterServiceMock.setSearchTerm).toHaveBeenCalledWith(searchTerm);
  }));

  it('should call setSearchTerm with empty string if search term is null or undefined', fakeAsync(() => {
    component.searchControl.setValue(null);

    // Simula el paso del tiempo igual al debounceTime
    tick(300);

    expect(filterServiceMock.setSearchTerm).toHaveBeenCalledWith('');

    component.searchControl.setValue(undefined);

    // Simula el paso del tiempo igual al debounceTime
    tick(300);

    expect(filterServiceMock.setSearchTerm).toHaveBeenCalledWith('');
  }));
});
