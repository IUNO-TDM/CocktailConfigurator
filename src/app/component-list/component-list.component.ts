import { Component, OnInit } from '@angular/core';
import { CocktailComponent, ComponentService } from 'tdm-common';
import { Draggable } from '../services/drag-and-drop.service';
import { DragAndDropService } from '../services/drag-and-drop.service';

@Component({
  selector: 'cocktail-component-list',
  templateUrl: './component-list.component.html',
  styleUrls: ['./component-list.component.css']
})
export class ComponentListComponent implements OnInit {
  components : CocktailComponent[] = [];

  constructor(
    private dragAndDropService: DragAndDropService,
    private componentService: ComponentService
  ) {
    componentService.components.subscribe(components => {
      this.components = components;
    });
  }

  ngOnInit() {
  }

  onDragStart(component: CocktailComponent) {
    // var layerComponent = new CocktailLayerComponent(component, 25);
    var draggable = new Draggable();
    draggable.object = component;
    draggable.origin = this;
    this.dragAndDropService.onDragStart(draggable);
  }

  onDragEnd() {
    this.dragAndDropService.onDragEnd();
  }

  onDrop() {
    this.dragAndDropService.onDrop(this);
  }

}
