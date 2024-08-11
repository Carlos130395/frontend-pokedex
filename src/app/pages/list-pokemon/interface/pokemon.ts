export interface IResponsePokemon {
  count: number;
  next: string;
  previous: any;
  results: Pokemon[];
}

export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonWithFavorite extends Pokemon {
  isFavorite: boolean;
}

export interface PokemonWithFavorite {
  name: string;
  url: string;
  isFavorite: boolean;
  order?: number;
  weight?: number;
  height?: number;
  types?: string[];
  sprites?: {
    front_default: string;
    [key: string]: string;
  };
}
