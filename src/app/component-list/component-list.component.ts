import { Component, OnInit } from '@angular/core';
import { DragAndDropService, Draggable } from '../services/drag-and-drop.service';
import { ComponentService } from '../services/component.service';
import { CocktailComponent } from '../model/cocktail';

@Component({
  selector: 'app-component-list',
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
