import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPokemonComponent } from './list-pokemon.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ListPokemonComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListPokemonRoutingModule {}
