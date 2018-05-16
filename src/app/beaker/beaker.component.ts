import { Component, EventEmitter, Output } from '@angular/core';
import { OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { ComponentListDialogComponent } from '../component-list-dialog/component-list-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Cocktail, CocktailComponent, CocktailLayer } from 'tdm-common';
import { Draggable } from '../services/drag-and-drop.service';
import { DragAndDropService } from '../services/drag-and-drop.service';

class DisplayLayer {
  displayComponents: CocktailComponent[] = []
  cocktailLayer: CocktailLayer
  cocktailLayerIndex = 0
}

@Component({
  selector: 'cocktail-beaker',
  templateUrl: './beaker.component.html',
  styleUrls: ['./beaker.component.css']
})
export class BeakerComponent implements OnInit {
  @Input() cocktail: Cocktail;
  @Input() editMode: boolean = false;
  // @Input() onSelectComponent: boolean = false;
  @Output() onSelectComponent: EventEmitter<any> = new EventEmitter();
  @Input() showRecommended = true
  @Input() showAvailable = true
  @Input() showInstalled = false
  @Input() dragComponentText = "Zutat per<br>Drag & Drop<br>hinzufügen."
  @Input() touchComponentText = "Hier tippen um Zutat<br>hinzuzufügen."
  private draggingComponent: CocktailComponent;
  private draggingIndex = {};
  private layerPlaceholdersVisible = false;
  private draggingMode = false;
  private movingComponent = false;
  private maxComponentsPerLayer = 8;
  private maxLayers = 8;
  private layersToDisplay: DisplayLayer[] = [];

  constructor(
    private dragAndDropService: DragAndDropService,
  ) {
    dragAndDropService.dragStart.subscribe(draggable => {
      // console.log("Start")
      this.draggingComponent = draggable.object;
      setTimeout(() => { // necessary 
        this.setDraggingMode(true);
      })
      if (draggable.origin !== this) {
        this.draggingIndex = null
        this.movingComponent = false
      }
    });

    dragAndDropService.dragEnd.subscribe(() => {
      // console.log("End")
      this.setDraggingMode(false);
    });

    dragAndDropService.drop.subscribe(event => {
      // console.log("drop")
      this.setDraggingMode(false);
      // remove if dragged outside
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

  private isPlaceholder(component: CocktailComponent): boolean {
    var placeholder = (component.id == null);
    return placeholder;
  }

  private updateLayersToDisplay() {
    var placeholderLayerId = -1
    // console.log("editMode = "+this.editMode+", draggingMode = "+this.draggingMode);
    function createPlaceholderComponent() {
      let placeholderComponent = new CocktailComponent(null, null, "#aaa");
      return placeholderComponent;
    }

    function createPlaceholderLayer() {
      let placeholderLayer = new DisplayLayer();
      placeholderLayer.cocktailLayerIndex = placeholderLayerId
      placeholderLayerId -= 1
      let placeholderComponent = createPlaceholderComponent();
      placeholderLayer.displayComponents.push(placeholderComponent);
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

    var layersToDisplay: DisplayLayer[] = [];

    // if (this.draggingIndex != null) { // dragging a component from beaker

    // } else { // dragging a component from somewhere to beaker

    // }
    var skipNextPlaceholderLayer = false
    this.cocktail.layers.forEach((layer, index) => {

      // add placeholder layer on top of this layer?
      if (this.layerPlaceholdersVisible) {
        if (!skipNextPlaceholderLayer) {
          if (this.draggingIndex == null || this.draggingIndex['layerIndex'] != index || layer.components.length > 1) {
            let placeholderLayer = createPlaceholderLayer();
            layersToDisplay.push(placeholderLayer);
          } else {
            skipNextPlaceholderLayer = true
          }
        } else {
          skipNextPlaceholderLayer = false
        }
      }

      var components: CocktailComponent[] = []
      layer.components.forEach(component => {
        components.push(component);
      });
      if (placeholdersVisible && layer.components.length < this.maxComponentsPerLayer) {
        if (this.draggingIndex == null || this.draggingIndex['layerIndex'] != index) { // do not show placeholder in a layer where we drag from
          let placeholderComponent = createPlaceholderComponent();
          components.push(placeholderComponent);
        }
      }
      var displayLayer = new DisplayLayer()
      displayLayer.displayComponents = components
      displayLayer.cocktailLayer = layer
      displayLayer.cocktailLayerIndex = index
      layersToDisplay.push(displayLayer)
      // if (this.layerPlaceholdersVisible) {
      //   let placeholderLayer = createPlaceholderLayer();
      //   layersToDisplay.push(placeholderLayer);
      // }
    });

    // add placeholder layer on bottom
    if (this.layerPlaceholdersVisible && !skipNextPlaceholderLayer) {
      let placeholderLayer = createPlaceholderLayer();
      layersToDisplay.push(placeholderLayer);
    }

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

  private getDisplayComponentsCount() {
    var count = 0;
    this.layersToDisplay.forEach(layer => {
      count += layer.displayComponents.length;
    });
    return count;
  }

  private getDisplayLayerHeight(layer: DisplayLayer) {
    var total = this.getDisplayComponentsCount();
    var layerCount = layer.displayComponents.length;
    var height = 100 * layerCount / total;
    return height;
  }

  private getComponentWidth(layer: DisplayLayer, component: CocktailComponent) {
    var width = 100 / layer.displayComponents.length;
    return width;
  }

  private trackByLayerId(index: number, layer: DisplayLayer): number {
    return layer.cocktailLayerIndex
  }

  // getCocktailLayerIndex(layerIndex: number) {
  //   var index = layerIndex;
  //   if (this.layerPlaceholdersVisible) {
  //     index = (layerIndex - 1) / 2;
  //   }
  //   return index;
  // }

  private getCocktailLayerIndexFromDisplayLayerIndex(displayLayerIndex) {
    // console.log("--------------------")
    // console.log("displayLayerIndex = " + displayLayerIndex)
    // console.log(this.layersToDisplay)
    var layerIndex = 0
    var newLayer = false

    // check if displayLayerIndex is a placeholder layer
    var displayLayer = this.layersToDisplay[displayLayerIndex]
    if (displayLayer.displayComponents.length == 1 && this.isPlaceholder(displayLayer.displayComponents[0])) {
      newLayer = true
    }

    for (var index = 0; index < displayLayerIndex; index += 1) {
      var displayLayer = this.layersToDisplay[index]
      // console.log("Testing index " + index)
      // console.log(displayLayer)
      if (!(displayLayer.displayComponents.length == 1 && this.isPlaceholder(displayLayer.displayComponents[0]))) {
        layerIndex += 1
      }
    }
    // console.log("index = " + layerIndex + ", newLayer = " + newLayer)
    return {
      index: layerIndex,
      newLayer: newLayer
    }
  }

  // ------------------------------------------
  //  Functions with position indexes
  // ------------------------------------------
  private onPlaceholderClicked(layerIndex: number, componentIndex: number) {
    if (!this.editMode) {
      return
    }
    // let cocktailLayerIndex = this.getCocktailLayerIndex(layerIndex);
    if (this.onSelectComponent.observers.length == 0) {
      console.log("no handler subscribed!")
    }
    this.onSelectComponent.emit(component => {
      if (component) {
        this.insertComponent(component, layerIndex, componentIndex);
      }
    })
  }

  private insertComponent(component: CocktailComponent, layerIndex: number, componentIndex: number) {
    var i = this.getCocktailLayerIndexFromDisplayLayerIndex(layerIndex)
    if (i.newLayer) {
      var layer = new CocktailLayer()
      this.cocktail.addLayer(layer, i.index)
    }
    this.cocktail.addComponent(component, i.index)
    // console.log(i)
    // if (this.layerPlaceholdersVisible) {
    //   if (layerIndex % 2 == 0) { // insert into a new layer (maybe between existing layers)
    //     var newLayer = new CocktailLayer();
    //     newLayer.components.push(component);
    //     this.cocktail.layers.splice(layerIndex / 2, 0, newLayer);
    //   } else {
    //     // subtract first placeholder layer, then each second layer is a placeholder
    //     let cocktailLayerIndex = (layerIndex - 1) / 2;
    //     this.cocktail.layers[cocktailLayerIndex].components.push(component);
    //   }
    // } else {
    //   if (this.cocktail.layers.length == 0) {
    //     var newLayer = new CocktailLayer();
    //     this.cocktail.layers.splice(layerIndex / 2, 0, newLayer);
    //   }
    //   this.cocktail.layers[layerIndex].components.push(component);
    // }
    this.reorderComponents();
    this.updateLayersToDisplay();
  }

  private reorderComponents() {
    this.cocktail.layers.forEach(layer => {
      layer.components.sort(function (c1, c2) {
        return c1.name.localeCompare(c2.name)
      })
    })
  }

  private onDragStart(displayLayerIndex: number, componentIndex: number) {
    // let cocktailLayerIndex = this.getCocktailLayerIndexFromDisplayLayerIndex(layerIndex).index;
    let cocktailLayerIndex = this.layersToDisplay[displayLayerIndex].cocktailLayerIndex
    var component = this.cocktail.layers[cocktailLayerIndex].components[componentIndex];
    this.draggingIndex = { layerIndex: cocktailLayerIndex, componentIndex: componentIndex };
    this.movingComponent = true
    var draggable = new Draggable();
    draggable.object = component;
    draggable.origin = this;
    this.dragAndDropService.onDragStart(draggable);
  }


  private onDropComponent(displayLayerIndex: number, componentIndex: number) {
    if (this.draggingIndex != null) { // component should be moved => remove first, then add
      let dragLayerIndex = this.draggingIndex['layerIndex']
      let dragComponentIndex = this.draggingIndex['componentIndex']
      // let i = this.getLayerIndexFromDisplayLayerIndex(dragLayerIndex)
      this.cocktail.removeComponent(dragLayerIndex, dragComponentIndex)
      let layer = this.cocktail.layers[dragLayerIndex]
      // layer.components.splice(dragComponentIndex, 1)
      this.insertComponent(this.draggingComponent, displayLayerIndex, componentIndex)

      // remove empty layers
      if (layer.components.length == 0) {
        this.cocktail.layers = this.cocktail.layers.filter(l => {
          return l !== layer;
        });
        this.updateLayersToDisplay()
      }
    } else { // component from 'outside', just insertfg
      this.insertComponent(this.draggingComponent, displayLayerIndex, componentIndex)
    }
    this.draggingIndex = null
    this.dragAndDropService.onDrop(this)
  }

  private onRemoveComponent(layerIndex: number, componentIndex: number) {
    let cocktailLayerIndex = this.getCocktailLayerIndexFromDisplayLayerIndex(layerIndex).index;
    this.cocktail.layers[cocktailLayerIndex].components.splice(componentIndex, 1);
    if (this.cocktail.layers[cocktailLayerIndex].components.length == 0) {
      this.cocktail.removeLayer(cocktailLayerIndex);
    }
    this.updateLayersToDisplay();
  }

  onClick(component: CocktailComponent) {
  }

  private onDragEnd() {
    this.dragAndDropService.onDragEnd()
  }
}
