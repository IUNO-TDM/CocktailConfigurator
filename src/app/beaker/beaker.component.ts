import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Cocktail, CocktailLayer, CocktailLayerComponent, TdmComponent } from '../model/cocktail';
import { DragAndDropService, Draggable } from '../services/drag-and-drop.service';

@Component({
  selector: 'beaker',
  templateUrl: './beaker.component.html',
  styleUrls: ['./beaker.component.css']
})
export class BeakerComponent implements OnInit {
  @Input() cocktail: Cocktail;
  @Input() capacity: number;
  draggingComponent: CocktailLayerComponent;
  editingComponent: CocktailLayerComponent = null;
  editingAmount: number = 0;

  constructor(private dragAndDropService: DragAndDropService) {
    dragAndDropService.dragStart.subscribe(draggable => {
      if (draggable.origin !== this) {
        this.draggingComponent = draggable.object;
        this.addPlaceholders(this.draggingComponent);
      }
    });

    dragAndDropService.dragEnd.subscribe(() => {
      this.removePlaceholders();
    });

    dragAndDropService.drop.subscribe(event => {
      if (event.target !== this && event.draggable.origin === this) {
        // remove component
        this.cocktail.layers.forEach(layer => {
          for (var index = layer.components.length - 1; index >= 0; index -= 1) {
            let c = layer.components[index];
            if (c === event.draggable.object) {
              layer.components.splice(index, 1);
            }
          }
        });

        this.removePlaceholders();
      }
    });
  }

  isPlaceholder(component: CocktailLayerComponent): boolean {
    var placeholder = false;
    if (component.component == null) {
      placeholder = true;
    }
    return placeholder;
  }

  private addPlaceholders(component: CocktailLayerComponent) {
    this.cocktail.layers.forEach(layer => {
      // check if component already used in layer
      var used = false;
      layer.components.forEach(c => {
        if (c.component.id == component.component.id) {
          used = true;
        }
      });
      if (!used) {
        let placeholderComponent = new CocktailLayerComponent(null, component.amount);
        layer.components.push(placeholderComponent);
      }
    });
    let placeholderLayer = new CocktailLayer();
    let placeholderComponent = new CocktailLayerComponent(null, component.amount);
    placeholderLayer.components.push(placeholderComponent);
    this.cocktail.layers.splice(0, 0, placeholderLayer);
  }

  private removePlaceholders() {
    // remove placeholder components
    this.cocktail.layers.forEach(layer => {
      for (var index = layer.components.length - 1; index >= 0; index -= 1) {
        let c = layer.components[index];
        if (c.component == null) {
          layer.components.splice(index, 1);
        }
      }
    });

    // remove empty layers
    for (var index = this.cocktail.layers.length - 1; index >= 0; index -= 1) {
      let layer = this.cocktail.layers[index];
      if (layer.components.length == 0) {
        this.cocktail.layers.splice(index, 1);
      }
    }
  }

  ngOnInit() {
  }

  getRemainingAmount() {
    // calculate total amount
    var totalAmount = 0;
    this.cocktail.layers.forEach(layer => {
      layer.components.forEach(c => {
        totalAmount += c.amount;
      });
    });

    var remainingAmount = this.capacity - totalAmount;
    return remainingAmount;
  }

  getEmptySpaceHeight() {
    var remainingAmount = this.getRemainingAmount();
    var height = 100 * remainingAmount / this.capacity;
    return height;
  }

  getLayerHeight(layer: CocktailLayer) {
    // calculate layer size
    var layerSize = 0;
    layer.components.forEach(component => {
      layerSize += component.amount;
    });

    var height = 100 * layerSize / this.capacity;
    return height;
  }

  getComponentWidth(layer: CocktailLayer, component: CocktailLayerComponent) {
    // calculate layer size
    var layerSize = 0;
    layer.components.forEach(component => {
      layerSize += component.amount;
    });

    var width = 100 * component.amount / layerSize;
    return width;
  }

  onDropComponent(placeholderComponent) {
    console.log("Dropping component:");
    console.log(this.draggingComponent);
    // replace placeholderComponent by dragged component
    this.cocktail.layers.forEach(layer => {
      for (var index = layer.components.length - 1; index >= 0; index -= 1) {
        let c = layer.components[index];
        if (c === placeholderComponent) {
          layer.components.splice(index, 1, this.draggingComponent);
        }
      }
    });
    this.dragAndDropService.onDrop(this);
  }

  onDragStart(component: CocktailLayerComponent) {
    this.editingComponent = null;
    var draggable = new Draggable();
    draggable.object = component;
    draggable.origin = this;
    this.dragAndDropService.onDragStart(draggable);
  }

  onClick(component: CocktailLayerComponent) {
    if (this.editingComponent == component) {
      // this.editingComponent = null;
    } else {
      this.editingComponent = component;
      this.editingAmount = component.amount;
    }
    console.log("Clicke!");
  }

  changeAmount(component: CocktailLayerComponent) {
    component.amount = this.editingAmount;
    console.log("Setting amount to "+this.editingAmount);
  }

  onDragEnd() {

  }
}
