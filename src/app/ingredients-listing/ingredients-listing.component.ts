import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Cocktail, CocktailLayer, TdmComponent } from '../model/cocktail';
import { ComponentService } from '../services/component.service';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ingredients-listing',
  templateUrl: './ingredients-listing.component.html',
  styleUrls: ['./ingredients-listing.component.css']
})
export class IngredientsListingComponent implements OnInit {
  @Input() cocktail: Cocktail;

  components: TdmComponent[] = [];
  ingredients = {};

  constructor(
    private componentService: ComponentService    
  ) { 
    console.log("---- Cocktail 2");
    console.log(this.cocktail);
    componentService.getComponents().subscribe(components => {
      this.components = components;
      console.log("---- Cocktail 3");
      console.log(this.cocktail);
        this.updateIngredients();
    });
  }

  getComponentIds() {
    var keys = Object.keys(this.ingredients);
    return keys;
  }

  private updateIngredients() {
    if (this.cocktail) {
      this.ingredients = this.cocktail.getIngredients();
    }
    // var ingredients = [];
    // if (this.cocktail) {
    //   // total fragments
    //   var total = 0;
    //   this.cocktail.layers.forEach(layer => {
    //     total += layer.components.length;
    //   })
      
    //   this.components.forEach(component => {
    //     var 
    //   });
    // }
  }

  ngOnInit() {
    console.log("---- Cocktail");
    console.log(this.cocktail);
    this.updateIngredients();
  }

  ngDoCheck() {
    console.log("Check!");
  }

}
