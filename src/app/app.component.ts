import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Inject } from '@angular/core';

// custom imports
import { BeakerComponent } from './beaker/beaker.component';
import { Cocktail, CocktailComponent, ComponentService, CocktailLayer } from 'tdm-common';

export enum EditMode {
  None = 0,
  AddComponent = 1,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  @ViewChild(BeakerComponent) beaker: BeakerComponent;
  title = 'app';
  cocktail: Cocktail;
  components: CocktailComponent[] = [];
  editMode: EditMode = EditMode.None;

  constructor(
    private componentService: ComponentService,
  ) {
    this.cocktail = new Cocktail();
    componentService.setComponents([
      new CocktailComponent("1", "Apfelsaft", "#7d7"),
      new CocktailComponent("2", "Bananensaft", "#dd7"),
      new CocktailComponent("3", "Kirschsaft", "#d77"),
      new CocktailComponent("4", "Maracujasaft", "#da7"),
      new CocktailComponent("5", "Ananassaft", "#dc9"),
      new CocktailComponent("6", "Reserved 1", "#ddf"),
      new CocktailComponent("7", "Reserved 2", "#ddf"),
      new CocktailComponent("8", "Reserved 3", "#ddf"),
    ]
    )
    componentService.setRecommendComponentIds(
      [
        "1", "4", "7"
      ]
    )
    componentService.components.subscribe(components => {
      this.components = components;
      let layer1 = new CocktailLayer();
      layer1.components.push(this.components[0]);
      this.cocktail.layers.push(layer1);

      let layer2 = new CocktailLayer();
      layer2.components.push(this.components[2]);
      this.cocktail.layers.push(layer2);

      let layer3 = new CocktailLayer();
      layer3.components.push(this.components[0]);
      layer3.components.push(this.components[1]);
      // layer3.components.push(this.components[1]);
      layer3.components.push(this.components[0]);
      // layer3.components.push(new CocktailLayerComponent(this.components[2], 10));
      // layer3.components.push(new CocktailLayerComponent(this.components[3], 10));
      // layer3.components.push(new CocktailLayerComponent(this.components[4], 10));
      // layer3.components.push(new CocktailLayerComponent(this.components[5], 10));
      // layer3.components.push(new CocktailLayerComponent(this.components[6], 10));
      // layer3.components.push(new CocktailLayerComponent(this.components[7], 10));
      this.cocktail.layers.push(layer3);
    })
    // this.components = [
    //   new CocktailComponent("1", "Apfelsaft", "#7d7"),
    //   new CocktailComponent("2", "Bananensaft", "#dd7"),
    //   new CocktailComponent("3", "Kirschsaft", "#d77"),
    //   new CocktailComponent("4", "Marakujasaft", "#da7"),
    //   new CocktailComponent("5", "Ananassaft", "#dc9"),
    //   new CocktailComponent("6", "Reserved 1", "#ddf"),
    //   new CocktailComponent("7", "Reserved 2", "#ddf"),
    //   new CocktailComponent("8", "Reserved 3", "#ddf"),
    // ];
  }

  ngOnInit() {
  }

  isAddComponentMode() {
    return this.editMode == EditMode.AddComponent;
  }

  isIdleMode() {
    return this.editMode == EditMode.None;
  }

  toggleEditCocktail() {
    if (this.editMode == EditMode.AddComponent) {
      this.editMode = EditMode.None;
      this.beaker.setEditMode(false);
    } else {
      this.editMode = EditMode.AddComponent;
      this.beaker.setEditMode(true);
    }
  }

  convert() {
    var lines = [];
    // total fragments
    var count = 0;
    this.cocktail.layers.forEach(layer => {
      count += layer.components.length;
    })

    this.cocktail.layers.forEach(layer => {
      var programComponents = [];
      layer.components.forEach(component => {
        var addNewComponent = true;
        programComponents.forEach(pc => {
          if (pc["ingredient"] == component.id) {
            addNewComponent = false;
            var amount = pc["amount"] + this.cocktail.amount / count;
            pc["amount"] = amount;
          }
        });
        if (addNewComponent) {
          programComponents.push({
            "ingredient": component.id,
            "amount": this.cocktail.amount / count
          });
        }
        // if (components
        // components.push({
        //   "ingredient": layerComponent.component.id,
        //   "amount": layerComponent.amount
        // });
      });
      lines.push({
        "components": programComponents,
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
