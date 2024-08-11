import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-pokemon',
  templateUrl: './list-pokemon.component.html',
  styleUrls: ['./list-pokemon.component.scss'],
})
export class ListPokemonComponent implements OnInit {
  public ngOnInit(): void {
    // Ocultar el loader cuando se carga este componente
    const loader = document.getElementById('pokeballLoader');
    if (loader) {
      loader.style.display = 'none';
    }
  }
}
