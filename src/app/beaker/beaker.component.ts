import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { ComponentListDialogComponent } from '../component-list-dialog/component-list-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Cocktail, CocktailComponent, CocktailLayer } from 'tdm-common';
import { Draggable } from '../services/drag-and-drop.service';
import { DragAndDropService } from '../services/drag-and-drop.service';

@Component({
  selector: 'cocktail-beaker',
  templateUrl: './beaker.component.html',
  styleUrls: ['./beaker.component.css']
})
export class BeakerComponent implements OnInit {
  @Input() cocktail: Cocktail;
  @Input() editMode: boolean = false;
  draggingComponent: CocktailComponent;
  draggingIndex = {};
  layerPlaceholdersVisible = false;
  // editMode = false;
  draggingMode = false;
  maxComponentsPerLayer = 8;
  maxLayers = 8;
  layersToDisplay: CocktailLayer[] = [];

  constructor(
    private dragAndDropService: DragAndDropService,
    public dialog: MatDialog,
  ) {
    dragAndDropService.dragStart.subscribe(draggable => {
      if (draggable.origin !== this) {
        this.draggingComponent = draggable.object;
        this.setDraggingMode(true);
      }
    });

    dragAndDropService.dragEnd.subscribe(() => {
      this.setDraggingMode(false);
    });

    dragAndDropService.drop.subscribe(event => {
      if (event.target !== this && event.draggable.origin === this) {
        let layerIndex = this.draggingIndex['layerIndex'];
        let componentIndex = this.draggingIndex['componentIndex'];
        let layer = this.cocktail.layers[layerIndex];
        layer.components.splice(componentIndex, 1);
        if (layer.components.length == 0) {
          this.cocktail.removeLayer(layerIndex);
        }
        this.updateLayersToDisplay();
      }
    });
  }

  isPlaceholder(component: CocktailComponent): boolean {
    var placeholder = (component.id == null);
    return placeholder;
  }

  private updateLayersToDisplay() {
    function createPlaceholderComponent() {
      let placeholderComponent = new CocktailComponent(null, null, "#aaa");
      return placeholderComponent;
    }

    function createPlaceholderLayer() {
      let placeholderLayer = new CocktailLayer();
      let placeholderComponent = createPlaceholderComponent();
      placeholderLayer.components.push(placeholderComponent);
      return placeholderLayer;
    }

    var placeholdersVisible = false
    this.layerPlaceholdersVisible = false;    
    if (this.editMode || this.draggingMode) {
      placeholdersVisible = true
      if (this.cocktail.layers.length < this.maxLayers) {
        this.layerPlaceholdersVisible = true;
      }
    }

    var layersToDisplay: CocktailLayer[] = [];
    if (this.layerPlaceholdersVisible) {
      let placeholderLayer = createPlaceholderLayer();
      layersToDisplay.push(placeholderLayer);
    }

    this.cocktail.layers.forEach(layer => {
      var components: CocktailComponent[] = []
      layer.components.forEach(component => {
        components.push(component);
      });
      if (placeholdersVisible && layer.components.length < this.maxComponentsPerLayer) {
        let placeholderComponent = createPlaceholderComponent();
        components.push(placeholderComponent);
      }
      var displayLayer = new CocktailLayer()
      displayLayer.components = components
      layersToDisplay.push(displayLayer)
      if (this.layerPlaceholdersVisible) {
        let placeholderLayer = createPlaceholderLayer();
        layersToDisplay.push(placeholderLayer);
      }
    });
    this.layersToDisplay = layersToDisplay;
  }

  isEmpty() {
    let empty = this.cocktail.layers.length == 0
    return empty
  }

  setEditMode(editMode: boolean) {
    this.editMode = editMode;
    this.updateLayersToDisplay();
  }

  setDraggingMode(draggingMode: boolean) {
    this.draggingMode = draggingMode;
    this.updateLayersToDisplay();
  }

  ngOnInit() {
    this.updateLayersToDisplay();
  }

  getDisplayComponentsCount() {
    var count = 0;
    this.layersToDisplay.forEach(layer => {
      count += layer.components.length;
    });
    return count;
  }

  getDisplayLayerHeight(layer: CocktailLayer) {
    var total = this.getDisplayComponentsCount();
    var layerCount = layer.components.length;
    var height = 100 * layerCount / total;
    return height;
  }

  getComponentWidth(layer: CocktailLayer, component: CocktailComponent) {
    var width = 100 / layer.components.length;
    return width;
  }

  getCocktailLayerIndex(layerIndex: number) {
    var index = layerIndex;
    if (this.layerPlaceholdersVisible) {
      index = (layerIndex - 1) / 2;
    }
    return index;
  }

  // ------------------------------------------
  //  Functions with position indexes
  // ------------------------------------------
  onPlaceholderClicked(layerIndex: number, componentIndex: number) {
    if (!this.editMode) {
      return
    }
    let cocktailLayerIndex = this.getCocktailLayerIndex(layerIndex);
    let dialogRef = this.dialog.open(ComponentListDialogComponent, {
      width: '250px',
      data: {
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.insertComponent(result, layerIndex, componentIndex);
      }
    });
  }

  insertComponent(component: CocktailComponent, layerIndex: number, componentIndex: number) {
    if (this.layerPlaceholdersVisible) {
      if (layerIndex % 2 == 0) {
        var newLayer = new CocktailLayer();
        newLayer.components.push(component);
        this.cocktail.layers.splice(layerIndex / 2, 0, newLayer);
      } else {
        // subtract first placeholder layer, then each second layer is a placeholder
        let cocktailLayerIndex = (layerIndex - 1) / 2;
        this.cocktail.layers[cocktailLayerIndex].components.push(component);
      }
    } else {
      if (this.cocktail.layers.length == 0) {
        var newLayer = new CocktailLayer();
        this.cocktail.layers.splice(layerIndex / 2, 0, newLayer);
      }
      this.cocktail.layers[layerIndex].components.push(component);
    }
    this.updateLayersToDisplay();
  }

  onDragStart(layerIndex: number, componentIndex: number) {
    let cocktailLayerIndex = this.getCocktailLayerIndex(layerIndex);
    var component = this.cocktail.layers[cocktailLayerIndex].components[componentIndex];
    this.draggingIndex = { layerIndex: cocktailLayerIndex, componentIndex: componentIndex };
    var draggable = new Draggable();
    draggable.object = component;
    draggable.origin = this;
    this.dragAndDropService.onDragStart(draggable);
  }

  onDropComponent(layerIndex: number, componentIndex: number) {
    this.insertComponent(this.draggingComponent, layerIndex, componentIndex);
  }

  onRemoveComponent(layerIndex: number, componentIndex: number) {
    let cocktailLayerIndex = this.getCocktailLayerIndex(layerIndex);
    this.cocktail.layers[cocktailLayerIndex].components.splice(componentIndex, 1);
    if (this.cocktail.layers[cocktailLayerIndex].components.length == 0) {
      this.cocktail.removeLayer(cocktailLayerIndex);
    }
    this.updateLayersToDisplay();
  }

  onClick(component: CocktailComponent) {
  }

  onDragEnd() {

  }
}
