import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Cocktail, CocktailLayer, CocktailComponent } from '../model/cocktail';
import { ComponentService } from '../services/component.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'ingredients-listing',
  templateUrl: './ingredients-listing.component.html',
  styleUrls: ['./ingredients-listing.component.css']
})
export class IngredientsListingComponent implements OnInit {
  @Input() cocktail: Cocktail;

  components: CocktailComponent[] = [];
  ingredients = {};

  constructor(
    private componentService: ComponentService
  ) {
    componentService.components.subscribe(components => {
      this.components = components;
      this.updateIngredients();
    });
  }

  getComponentIds() {
    var keys = Object.keys(this.ingredients);
    return keys;
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
      this.ingredients = this.cocktail.getIngredients();
    }
  }

  ngOnInit() {
    this.updateIngredients();
  }

  ngDoCheck() { //TODO: think about a better solution (service, emitter, behavioursubject, ...)
    this.updateIngredients();
  }

}
