import { Component, OnInit } from '@angular/core';
import { PokemonFilterService } from '../../services/filter/pokemon-filter.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-filter-list-pokemon',
  templateUrl: './filter-list-pokemon.component.html',
  styleUrls: ['./filter-list-pokemon.component.scss'],
})
export class FilterListPokemonComponent implements OnInit {
  public searchControl = new FormControl<string | null | undefined>('');

  constructor(private filterService: PokemonFilterService) {}

  public ngOnInit(isTesting: boolean = false): void {
    this.searchControl.valueChanges
      .pipe(isTesting ? (source) => source : debounceTime(300))
      .subscribe((searchTerm) => {
        this.filterService.setSearchTerm(searchTerm ?? '');
      });
  }
}
