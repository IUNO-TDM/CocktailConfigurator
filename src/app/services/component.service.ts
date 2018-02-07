import { Injectable } from '@angular/core';
import { TdmComponent } from '../model/cocktail';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Injectable()
export class ComponentService {
  components = [
    new TdmComponent("1", "Apfelsaft", "#7d7"),
    new TdmComponent("2", "Bananensaft", "#dd7"),
    new TdmComponent("3", "Kirschsaft", "#d77"),
    new TdmComponent("4", "Maracujasaft", "#da7"),
    new TdmComponent("5", "Ananassaft", "#dc9"),
    new TdmComponent("6", "Reserved 1", "#ddf"),
    new TdmComponent("7", "Reserved 2", "#ddf"),
    new TdmComponent("8", "Reserved 3", "#ddf"),
];

  constructor() { }

  getComponents(): Observable<TdmComponent[]> {
    return of(this.components);
  }

}
