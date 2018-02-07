import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Cocktail, CocktailLayer, TdmComponent } from '../model/cocktail';
import { DragAndDropService, Draggable } from '../services/drag-and-drop.service';
import { ComponentListDialogComponent } from '../component-list-dialog/component-list-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'beaker',
  templateUrl: './beaker.component.html',
  styleUrls: ['./beaker.component.css']
})
export class BeakerComponent implements OnInit {
  @Input() cocktail: Cocktail;
  draggingComponent: TdmComponent;
  draggingIndex = {};
  placeholdersAdded = false;
  editMode = false;
  maxComponentsPerLayer = 8;
  maxLayers = 8;

  constructor(
    private dragAndDropService: DragAndDropService,
    public dialog: MatDialog,
  ) {
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
        let layerIndex = this.draggingIndex['layerIndex'];
        let componentIndex = this.draggingIndex['componentIndex'];
        let layer = this.cocktail.layers[layerIndex];
        layer.components.splice(componentIndex, 1);
        this.removeUnneededLayers();
        // if (this.isLayerEmpty(layer)) {
        //   this.cocktail.layers.splice(layerIndex, 1);
        // }
        // this.setEditMode(false);
      }
    });
  }

  isPlaceholder(component: TdmComponent): boolean {
    var placeholder = (component.id == null);
    return placeholder;
  }

  isLayerEmpty(layer: CocktailLayer) {
    var empty = true;
    layer.components.forEach(component => {
      if (component.id != null) { // ignore placeholders
        empty = false;
      }
    });
    return empty;
  }

  // removes empty layers with respect to placeholders
  private removeUnneededLayers() {
    var emptyLayer = false;
    for (var i = this.cocktail.layers.length - 1; i >= 0; i -= 1) {
      var layer = this.cocktail.layers[i];
      if (this.isLayerEmpty(layer)) {
        if (emptyLayer) {
          this.cocktail.layers.splice(i, 1);
        } else {
          emptyLayer = true;
        }
      } else {
        emptyLayer = false;
      }
    }
  }

  setEditMode(editMode: boolean) {
    this.editMode = editMode;
    if (editMode) {
      this.addPlaceholders();
    } else {
      this.removePlaceholders();
    }
  }

  private addPlaceholders() {
    if (!this.placeholdersAdded) {
      this.placeholdersAdded = true;
      this.cocktail.layers.forEach(layer => {
        let placeholderComponent = new TdmComponent(null, null, "#aaa");
        if (layer.components.length < this.maxComponentsPerLayer) {
          layer.components.push(placeholderComponent);
        }
      });
      var count = this.cocktail.layers.length;
      if (count < this.maxLayers) {
        var index = 0;
        do {
          let placeholderLayer = new CocktailLayer();
          let placeholderComponent = new TdmComponent(null, null, "#aaa");
          placeholderLayer.components.push(placeholderComponent);
          this.cocktail.layers.splice(index * 2, 0, placeholderLayer);
          index += 1;
        } while (index < count);
      }
    }
  }

  private removePlaceholders() {
    if (this.placeholdersAdded) {
      this.placeholdersAdded = false;
      // remove placeholder components
      this.cocktail.layers.forEach(layer => {
        for (var index = layer.components.length - 1; index >= 0; index -= 1) {
          let c = layer.components[index];
          if (c.id == null) {
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
  }

  ngOnInit() {
  }

  getComponentCount() {
    var count = 0;
    this.cocktail.layers.forEach(layer => {
      count += layer.components.length;
    });
    return count;
  }

  getLayerHeight(layer: CocktailLayer) {
    var total = this.getComponentCount();
    var layerCount = layer.components.length;
    var height = 100 * layerCount / total;
    return height;
  }

  getComponentWidth(layer: CocktailLayer, component: TdmComponent) {
    var width = 100 / layer.components.length;
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

  onPlaceholderClicked(placeholderComponent) {
    let dialogRef = this.dialog.open(ComponentListDialogComponent, {
      width: '250px',
      data: {
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cocktail.layers.forEach(layer => {
          for (var index = layer.components.length - 1; index >= 0; index -= 1) {
            let c = layer.components[index];
            if (c === placeholderComponent) {
              layer.components.splice(index, 1, result);
            }
          }
        });
        this.removePlaceholders();
        this.addPlaceholders();
      }
    });
  }

  onDragStart(layerIndex: number, componentIndex: number) {
    var component = this.cocktail.layers[layerIndex].components[componentIndex];
    this.draggingIndex = { layerIndex: layerIndex, componentIndex: componentIndex };
    var draggable = new Draggable();
    draggable.object = component;
    draggable.origin = this;
    this.dragAndDropService.onDragStart(draggable);
  }

  onRemoveComponent(layerIndex: number, componentIndex: number) {
    this.cocktail.layers[layerIndex].components.splice(componentIndex, 1);
    this.removeUnneededLayers();
  }

  onClick(component: TdmComponent) {
  }

  onDragEnd() {

  }
}
