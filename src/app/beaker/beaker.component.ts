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
  draggingComponent: CocktailLayerComponent;

  constructor(private dragAndDropService: DragAndDropService) {
    dragAndDropService.dragStart.subscribe(draggable => {
      if (draggable.origin !== this) {
        this.draggingComponent = draggable.object;
        this.addPlaceholders();
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

  private addPlaceholders() {
    this.cocktail.layers.forEach(layer => {
      let placeholderComponent = new CocktailLayerComponent(null, 0);
      layer.components.push(placeholderComponent);
    });
    let placeholderLayer = new CocktailLayer();
    let placeholderComponent = new CocktailLayerComponent(null, 0);
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
    var draggable = new Draggable();
    draggable.object = component;
    draggable.origin = this;
    this.dragAndDropService.onDragStart(draggable);
  }

  onDragEnd() {

  }
}
