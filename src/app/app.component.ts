import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

// custom imports
import { TdmComponent } from './model/cocktail';
import { Cocktail } from './model/cocktail';
import { CocktailLayer } from './model/cocktail';
import { CocktailLayerComponent } from './model/cocktail';
import { BeakerComponent } from './beaker/beaker.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  @ViewChild(BeakerComponent) beaker: BeakerComponent;
  title = 'app';
  cocktail: Cocktail;
  components: TdmComponent[] = [];

  constructor() {
    this.components = [
      new TdmComponent("1", "Apfelsaft", "#7d7"),
      new TdmComponent("2", "Bananensaft", "#dd7"),
      new TdmComponent("3", "Kirschsaft", "#d77"),
      new TdmComponent("4", "Marakujasaft", "#da7"),
      new TdmComponent("5", "Ananassaft", "#dc9"),
    ];
    
    this.cocktail = new Cocktail();
    let layer1 = new CocktailLayer();
    layer1.components.push(new CocktailLayerComponent(this.components[0], 50));
    layer1.components.push(new CocktailLayerComponent(this.components[1], 25));

    let layer2 = new CocktailLayer();
    layer2.components.push(new CocktailLayerComponent(this.components[2], 100));
    this.cocktail.layers.push(layer2);
    this.cocktail.layers.push(layer1);

  }

  ngOnInit() {
  }

  convert() {
    var lines = [];
    this.cocktail.layers.forEach(layer => {
      var components = [];
      layer.components.forEach(layerComponent => {
        components.push({
          "ingredient": layerComponent.component.id,
          "amount": layerComponent.amount
        });
      });
      lines.push({
        "components": components,
        "timing": 2,
        "sleep": 0
      });
    });
    var program = {
      "lines": lines
    };
    var jsonString = JSON.stringify(program);
    console.log(jsonString);
  }
}
