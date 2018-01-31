import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DndModule } from 'ng2-dnd';

// custom imports
import { BeakerComponent } from './beaker/beaker.component';
import { DragAndDropService } from './services/drag-and-drop.service';
import { ComponentListComponent } from './component-list/component-list.component';
import { ComponentService } from './services/component.service';

@NgModule({
  declarations: [
    AppComponent,
    BeakerComponent,
    ComponentListComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    FormsModule,
    DndModule.forRoot(),
  ],
  providers: [
    DragAndDropService,
    ComponentService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
