import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DndModule } from 'ng2-dnd';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http'; // still needed @see https://github.com/angular/angular/issues/19788

// angular material
import { MatButtonModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';

// custom imports
import { BeakerComponent } from './beaker/beaker.component';
import { ComponentListComponent } from './component-list/component-list.component';
import { ComponentListDialogComponent } from './component-list-dialog/component-list-dialog.component';
import { IngredientsListingComponent } from './ingredients-listing/ingredients-listing.component';
import { TdmCommonModule } from 'tdm-common'

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,    
    MatDialogModule,
    MatButtonModule,
    TdmCommonModule,
    MatListModule,
    MatInputModule,
    DndModule.forRoot(),
    HttpClientModule,
  ],
  declarations: [
    BeakerComponent,
    ComponentListComponent,
    ComponentListDialogComponent,
    IngredientsListingComponent
  ],
  exports: [
    BeakerComponent,
    ComponentListComponent,
    ComponentListDialogComponent,
    IngredientsListingComponent,
  ],
  providers: [
  ],
  entryComponents: [
    ComponentListDialogComponent,
  ]
})
export class CocktailConfiguratorModule { }
