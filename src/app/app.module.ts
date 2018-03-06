import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DndModule } from 'ng2-dnd';

// angular material
import { MatButtonModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';

// custom imports
import { BeakerComponent } from './beaker/beaker.component';
import { DragAndDropService } from './services/drag-and-drop.service';
import { ComponentListComponent } from './component-list/component-list.component';
import { ComponentListDialogComponent } from './component-list-dialog/component-list-dialog.component';
import { IngredientsListingComponent } from './ingredients-listing/ingredients-listing.component';
import { TdmCommonModule } from 'tdm-common';

@NgModule({
  declarations: [
    AppComponent,
    BeakerComponent,
    ComponentListComponent,
    ComponentListDialogComponent,
    IngredientsListingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,    
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatListModule,
    MatInputModule,
    DndModule.forRoot(),
    TdmCommonModule.forRoot()
  ],
  providers: [
    DragAndDropService,
  ],
  entryComponents: [
    ComponentListDialogComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
