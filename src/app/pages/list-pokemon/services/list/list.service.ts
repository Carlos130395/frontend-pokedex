import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponsePokemon } from '../../interface/pokemon';
import { environment } from 'src/environments/environment ';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private apiUrl = environment.envVar.BACKEND_URL;

  constructor(private http: HttpClient) {}

  // Método para obtener un Pokémon por su nombre o ID
  getPokemonList(
    limit: number = 20,
    offset: number = 0
  ): Observable<IResponsePokemon> {
    const url = `${this.apiUrl}pokemon?limit=${limit}&offset=${offset}`;
    return this.http.get<IResponsePokemon>(url);
  }

  // Método para obtener un Pokémon por su nombre o ID
  getPokemonByIdOrName(idOrName: string | number): Observable<any> {
    const url = `${this.apiUrl}pokemon/${idOrName}`;
    return this.http.get<any>(url);
  }
}
