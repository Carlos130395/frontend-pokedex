import { Component, OnInit } from '@angular/core';
import { ListService } from '../../services/list/list.service';
import { Pokemon, PokemonWithFavorite } from '../../interface/pokemon';
import { Subscription } from 'rxjs';
import { PokemonFilterService } from '../../services/filter/pokemon-filter.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-table-list-pokemon',
  templateUrl: './table-list-pokemon.component.html',
  styleUrls: ['./table-list-pokemon.component.scss'],
})
export class TableListPokemonComponent implements OnInit {
  public pokemons: PokemonWithFavorite[] = [];
  public pokemon: any;
  public favorites: PokemonWithFavorite[] = [];
  public filteredPokemons: PokemonWithFavorite[] = [];
  public limit: number = 20;
  public offset: number = 0;
  public totalPokemons: number = 0;
  private searchSubscription!: Subscription;
  public selectedPokemon: PokemonWithFavorite | null = null;

  constructor(
    private pokemonService: ListService,
    private filterService: PokemonFilterService
  ) {}

  public ngOnInit(): void {
    this.getListPokemon();
    // Suscribirse al término de búsqueda
    this.searchSubscription = this.filterService.searchTerm$.subscribe(
      (term) => {
        this.filterPokemons(term);
      }
    );
  }

  // Método para obtener la lista básica de Pokémon
  public getListPokemon(): void {
    this.pokemonService
      .getPokemonList(this.limit, this.offset)
      .subscribe((data) => {
        this.pokemons = data.results.map((pokemon: Pokemon) => {
          const isFavorite = this.favorites.some(
            (fav) => fav.name === pokemon.name
          );
          return {
            name: pokemon.name.toUpperCase(),
            url: pokemon.url,
            isFavorite: isFavorite,
          };
        });
        this.totalPokemons = data.count;
        this.filterPokemons('');
      });
  }

  // Método para obtener detalles completos del Pokémon desde su URL
  public getPokemonDetails(pokemonIdOrName: string): void {
    this.pokemonService.getPokemonByIdOrName(pokemonIdOrName).subscribe(
      (data) => {
        this.selectedPokemon = {
          name: data.name.toUpperCase(),
          url: `https://pokeapi.co/api/v2/pokemon/${pokemonIdOrName}`,
          order: data.order,
          weight: data.weight,
          height: data.height,
          types: data.types.map((typeObj: any) => typeObj.type.name),
          sprites: data.sprites,
          isFavorite: this.favorites.some(
            (fav) => fav.name === data.name.toUpperCase()
          ),
        };
        this.openPokemonModal(this.selectedPokemon);
      },
      (error) => {
        console.error('Error al obtener los detalles del Pokémon:', error);
      }
    );
  }

  // Método para filtrar la lista de Pokémon basada en el término de búsqueda
  public filterPokemons(term: string): void {
    this.filteredPokemons = this.pokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(term.toLowerCase())
    );
  }

  // Función para marcar o desmarcar un Pokémon individualmente
  public toggleFavorite(index: number): void {
    const pokemon = this.pokemons[index];
    pokemon.isFavorite = !pokemon.isFavorite;

    if (pokemon.isFavorite) {
      // Agregar a la lista de favoritos global
      if (!this.favorites.some((fav) => fav.name === pokemon.name)) {
        this.favorites.push(pokemon);
      }

      // Obtener los detalles del Pokémon y abrir el modal solo si se marcó como favorito
      this.getPokemonDetails(
        pokemon.url.split('/').filter(Boolean).pop() || ''
      );
    } else {
      // Remover de la lista de favoritos global
      this.favorites = this.favorites.filter(
        (fav) => fav.name !== pokemon.name
      );
    }
  }

  public openPokemonModal(pokemon: PokemonWithFavorite | null): void {
    if (!pokemon) {
      console.error('No Pokémon selected');
      return;
    }

    const modalElement = document.getElementById('pokemonModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  public showFavorites(event: Event): void {
    if (this.favorites.length === 0) {
      event.preventDefault();
      event.stopPropagation();
      alert('No hay Pokémon favoritos seleccionados.');
    } else {
      // Mostrar el modal manualmente
      const modalElement = document.getElementById('favoritesModal');
      if (modalElement) {
        modalElement.classList.add('show', 'd-block'); // Añadir clases para mostrar el modal
        modalElement.style.display = 'block';
        modalElement.setAttribute('aria-modal', 'true');
        modalElement.removeAttribute('aria-hidden');
      }
    }
  }

  public closeFavoritesModal(): void {
    const modalElement = document.getElementById('favoritesModal');
    if (modalElement) {
      modalElement.classList.remove('show', 'd-block');
      modalElement.style.display = 'none'; // Asegúrate de que el estilo se establece correctamente
      modalElement.removeAttribute('aria-modal');
      modalElement.setAttribute('aria-hidden', 'true');
    }
  }

  // Función para marcar todos los Pokémon como favoritos
  public selectAllFavorites(): void {
    const allSelected = this.pokemons.every((pokemon) => pokemon.isFavorite);

    if (allSelected) {
      // Si todos están seleccionados, desmarcar todos
      this.pokemons.forEach((pokemon) => {
        pokemon.isFavorite = false;
        this.favorites = this.favorites.filter(
          (fav) => fav.name !== pokemon.name
        );
      });
    } else {
      // Si no todos están seleccionados, marcar todos
      this.pokemons.forEach((pokemon) => {
        pokemon.isFavorite = true;
        // Agregar a la lista de favoritos global si no está ya en ella
        if (!this.favorites.some((fav) => fav.name === pokemon.name)) {
          this.favorites.push(pokemon);
        }
      });
    }
  }

  public nextPage(): void {
    if (this.offset + this.limit < this.totalPokemons) {
      this.offset += this.limit;
      this.getListPokemon();
    }
  }

  public previousPage(): void {
    if (this.offset >= this.limit) {
      this.offset -= this.limit;
      this.getListPokemon();
    }
  }
}
