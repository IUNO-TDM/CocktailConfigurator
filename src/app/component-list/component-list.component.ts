import { NgModule }      from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CocktailComponent, ComponentService, Cocktail } from 'tdm-common';
import { Draggable } from '../services/drag-and-drop.service';
import { DragAndDropService } from '../services/drag-and-drop.service';

@Component({
  selector: 'cocktail-component-list',
  templateUrl: './component-list.component.html',
  styleUrls: ['./component-list.component.css']
})
export class ComponentListComponent implements OnInit {
  @Input() draggingMode = 'true';
  @Output() onComponentSelected: EventEmitter<CocktailComponent> = new EventEmitter<CocktailComponent>();
  private components : CocktailComponent[] = [];
  private recommendedComponents : CocktailComponent[] = [];
  private visibleComponents : CocktailComponent[] = [];
  private queryString = "";

  constructor(
    private dragAndDropService: DragAndDropService,
    private componentService: ComponentService
  ) {
    componentService.components.subscribe(components => {
      this.components = components
      this.updateVisibleComponents()
    });
    componentService.recommendedComponents.subscribe(components => {
      let sortedComponents = this.sortedComponents(components)
      this.recommendedComponents = sortedComponents
    });
  }

  private sortedComponents(components: CocktailComponent[]) {
    let sorted = components.sort((c1, c2) => {
      var compareValue = 0
      if (c1.name.toUpperCase() > c2.name.toUpperCase()) {
        compareValue = 1
      } else if (c1.name.toUpperCase() < c2.name.toUpperCase()) {
        compareValue = -1
      }
      return compareValue
    });
    return sorted
  }

  ngOnInit() {
  }

  onDragStart(component: CocktailComponent) {
    var draggable = new Draggable()
    draggable.object = component
    draggable.origin = this
    this.dragAndDropService.onDragStart(draggable)
  }

  onDragEnd() {
    this.dragAndDropService.onDragEnd()
  }

  onDrop() {
    this.dragAndDropService.onDrop(this)
  }

  onComponentClicked(component: CocktailComponent) {
    this.onComponentSelected.emit(component)
  }

  updateVisibleComponents() {
    var visibles = this.components.filter(component => {
      var visible = component.name.toUpperCase().indexOf(this.queryString.toUpperCase()) != -1
      return visible
    });
    this.visibleComponents = this.sortedComponents(visibles)
  }

}
