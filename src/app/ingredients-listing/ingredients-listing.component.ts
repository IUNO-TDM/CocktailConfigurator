import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Cocktail, CocktailComponent, ComponentService } from 'tdm-common';

@Component({
  selector: 'cocktail-ingredients-listing',
  templateUrl: './ingredients-listing.component.html',
  styleUrls: ['./ingredients-listing.component.css']
})
export class IngredientsListingComponent implements OnInit {
  @Input() cocktail: Cocktail

  components: CocktailComponent[] = []
  ingredients = {}
  ingredientIds: String[] = []

  constructor(
    private componentService: ComponentService
  ) {
    componentService.components.subscribe(components => {
      this.components = components;
      this.updateIngredients();
    });
  }

  // getComponentIds() {
  //   var keys = Object.keys(this.ingredients);
  //   return keys;
  // }

  getComponent(componentId): CocktailComponent {
    var component: CocktailComponent = null
    this.components.forEach(c => {
      if (c.id == componentId) {
        component = c
      }
    });
    return component
  }

  getComponentName(componentId) {
    var componentName = "unknown";
    this.components.forEach(component => {
      if (component.id == componentId) {
        componentName = component.name;
      }
    });
    return componentName;
  }

  getComponentAmount(componentId) {
    var totalAmount = this.cocktail.amount;
    var totalFragments = this.cocktail.getFragmentsCount();
    var fragments = this.ingredients[componentId];
    var amount = totalAmount * fragments / totalFragments;
    return amount;
  }

  private updateIngredients() {
    if (this.cocktail) {
      this.ingredients = this.cocktail.getIngredients()
      var ingredientIds = Object.keys(this.ingredients);
      let sorted = ingredientIds.sort((i1, i2) => {
        var compareValue = 0
        if (this.getComponentAmount(i1) > this.getComponentAmount(i2)) {
          compareValue = -1
        } else if (this.getComponentAmount(i1) < this.getComponentAmount(i2)) {
          compareValue = 1
        } else if (this.getComponentName(i1) > this.getComponentName(i2)) {
          compareValue = 1
        } else if (this.getComponentName(i1) < this.getComponentName(i2)) {
          compareValue = -1
        }          
        return compareValue
      });
      this.ingredientIds = sorted;
    }
  }

  ngOnInit() {
    this.updateIngredients();
  }

  ngDoCheck() { //TODO: think about a better solution (service, emitter, behavioursubject, ...)
    this.updateIngredients();
  }

}
