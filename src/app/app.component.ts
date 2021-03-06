import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Inject } from '@angular/core';

// custom imports
import { BeakerComponent } from './beaker/beaker.component';
import { TdmCocktailRecipe, TdmCocktailLayer, TdmCocktailProgram, TdmCocktailComponent, TdmCocktailComponentService } from 'tdm-common';
import { MatDialog } from '@angular/material';
import { ComponentListDialogComponent } from '../public_api';

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
  cocktail: TdmCocktailProgram;
  components: TdmCocktailComponent[] = [];
  editMode: EditMode = EditMode.None;

  showRecommendedComponents = true
  showInstalledComponents = true
  showAvailableComponents = true

  constructor(
    private componentService: TdmCocktailComponentService,
    public dialog: MatDialog,
  ) {
    this.cocktail = new TdmCocktailProgram();
    componentService.setComponents([
      new TdmCocktailComponent("1", "Apfelsaft", "#7d7"),
      new TdmCocktailComponent("2", "Kirschsaft", "#d77"),
      new TdmCocktailComponent("3", "Bananensaft", "#dd7"),
      new TdmCocktailComponent("4", "Maracujasaft", "#da7"),
      new TdmCocktailComponent("5", "Ananassaft", "#dc9"),
      new TdmCocktailComponent("6", "Reserved 1", "#ddf"),
      new TdmCocktailComponent("7", "Reserved 2", "#ddf"),
      new TdmCocktailComponent("8", "Reserved 3", "#ddf"),
    ]
    )
    componentService.setRecommendComponentIds(
      [
        "1", "2", "3", "4", "5", "6", "7", "8"
      ]
    )
    componentService.availableComponents.subscribe(components => {
      this.components = components;
      let layer1 = new TdmCocktailLayer();
      layer1.components.push(this.components[0]);
      this.cocktail.layers.push(layer1);

      let layer2 = new TdmCocktailLayer();
      layer2.components.push(this.components[2]);
      this.cocktail.layers.push(layer2);

      let layer3 = new TdmCocktailLayer();
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

  selectComponent(callback: (component: TdmCocktailComponent) => any) {
    let dialogRef = this.dialog.open(ComponentListDialogComponent, {
      width: '300px',
      data: {
        showRecommended: this.showRecommendedComponents,
        showInstalled: this.showInstalledComponents,
        showAvailable: this.showAvailableComponents,
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        callback(result)
      }
    });

    // console.log(callback)
    // callback(this.components[0])
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
