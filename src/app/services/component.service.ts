import { Injectable, Inject, Optional } from '@angular/core';
import { CocktailComponent } from '../model/cocktail';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ComponentService {
  private _components: BehaviorSubject<CocktailComponent[]> = new BehaviorSubject([]);
  public readonly components: Observable<CocktailComponent[]> = this._components.asObservable();

  private sourceUrl?: string;

  constructor(
    private http: HttpClient,
    @Inject('componentSourceUrl') @Optional() public componentSourceUrl?: string) {
      this.sourceUrl = componentSourceUrl
      this.updateComponents();
  }

  setComponents(components: CocktailComponent[]) {
    this._components.next(components);
  }

  updateComponents() {
    if (this.sourceUrl != null) {
      this.http.get<CocktailComponent[]>(this.sourceUrl).subscribe(components => {
          this._components.next(components);
      });
    }
  }

}
