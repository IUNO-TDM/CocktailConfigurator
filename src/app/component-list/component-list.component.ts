import { NgModule }      from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TdmCocktailComponent, TdmCocktailComponentService, TdmCocktailProgram } from 'tdm-common';
import { Draggable } from '../services/drag-and-drop.service';
import { DragAndDropService } from '../services/drag-and-drop.service';

@Component({
  selector: 'cocktail-component-list',
  templateUrl: './component-list.component.html',
  styleUrls: ['./component-list.component.css']
})
export class ComponentListComponent implements OnInit {
  @Input() draggable = true
  @Input() showRecommended = true
  @Input() showAvailable = true
  @Input() showInstalled = false
  @Input() removeComponentText = "Zutat hier ablegen<br>um diese zu entfernen."
  @Input() searchComponentTitle = "Suchen"
  @Input() recommendedComponentsTitle = "Vorgeschlagene Komponenten"
  @Input() installedComponentsTitle = "Installierte Komponenten"
  @Input() availableComponentsTitle = "Alle Komponenten"
  @Input() emptySearchResultText = "Keine Komponenten gefunden."
  // @Input() components : CocktailComponent[] = []
  // @Input() recommendedComponents : CocktailComponent[] = []
  @Output() onComponentSelected: EventEmitter<TdmCocktailComponent> = new EventEmitter<TdmCocktailComponent>()
  availableComponents : TdmCocktailComponent[] = []
  recommendedComponents : TdmCocktailComponent[] = []
  installedComponents : TdmCocktailComponent[] = []
  queryComponents : TdmCocktailComponent[] = []
  queryString = ""
  isDropTarget: boolean = false;

  constructor(
    private dragAndDropService: DragAndDropService,
    private componentService: TdmCocktailComponentService
  ) {
    this.componentService.availableComponents.subscribe(components => {
      let sortedComponents = this.sortedComponents(components)
      this.availableComponents = sortedComponents
      this.updateSearchResult()
    });
    this.componentService.recommendedComponents.subscribe(components => {
      let sortedComponents = this.sortedComponents(components)
      this.recommendedComponents = sortedComponents
    });
    this.componentService.installedComponents.subscribe(components => {
      let sortedComponents = this.sortedComponents(components)
      this.installedComponents = sortedComponents
      this.updateSearchResult()
    });

    // Drag and Drop
    dragAndDropService.dragStart.subscribe(draggable => {
      if (draggable.origin !== this) {
        this.isDropTarget = true
      }
    });

    dragAndDropService.dragEnd.subscribe(() => {
      this.isDropTarget = false
    });

    dragAndDropService.drop.subscribe(event => {
      this.isDropTarget = false
    });
  }

  private sortedComponents(components: TdmCocktailComponent[]) {
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

  onDragStart(component: TdmCocktailComponent) {
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

  onComponentClicked(component: TdmCocktailComponent) {
    this.onComponentSelected.emit(component)
  }

  updateSearchResult() {
    var visibles = this.availableComponents.filter(component => {
      var visible = component.name.toUpperCase().indexOf(this.queryString.toUpperCase()) != -1
      return visible
    });
    this.queryComponents = this.sortedComponents(visibles)
  }

}
