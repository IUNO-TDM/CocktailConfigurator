import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DndModule } from 'ng2-dnd';

// angular material
import { MatButtonModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';


// custom imports
import { BeakerComponent } from './beaker/beaker.component';
import { DragAndDropService } from './services/drag-and-drop.service';
import { ComponentListComponent } from './component-list/component-list.component';
import { ComponentService } from './services/component.service';
import { ComponentListDialogComponent } from './component-list-dialog/component-list-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    BeakerComponent,
    ComponentListComponent,
    ComponentListDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,    
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    DndModule.forRoot(),
  ],
  providers: [
    DragAndDropService,
    ComponentService,
  ],
  entryComponents: [
    ComponentListDialogComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
