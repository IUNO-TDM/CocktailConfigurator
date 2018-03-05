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
  components : CocktailComponent[] = [];
  visibleComponents : CocktailComponent[] = [];
  queryString = "";

  constructor(
    private dragAndDropService: DragAndDropService,
    private componentService: ComponentService
  ) {
    componentService.components.subscribe(components => {
      this.components = components;
      this.updateVisibleComponents()
    });
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
    this.visibleComponents = this.components.filter(component => {
      let visible = component.name.toUpperCase().indexOf(this.queryString.toUpperCase()) != -1
      return visible
    });
  }

}
