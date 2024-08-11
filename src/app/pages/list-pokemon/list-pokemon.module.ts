import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListPokemonRoutingModule } from './list-pokemon-routing.module';
import { ListPokemonComponent } from './list-pokemon.component';
import { FilterListPokemonComponent } from './components/filter-list-pokemon/filter-list-pokemon.component';
import { TableListPokemonComponent } from './components/table-list-pokemon/table-list-pokemon.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ListPokemonComponent,
    FilterListPokemonComponent,
    TableListPokemonComponent
  ],
  imports: [
    CommonModule,
    ListPokemonRoutingModule,
    ReactiveFormsModule
  ],
})
export class ListPokemonModule { }
