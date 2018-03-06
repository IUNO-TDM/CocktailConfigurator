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
import { DragAndDropService } from './services/drag-and-drop.service';
import { TdmCommonModule } from 'tdm-common';
import { CocktailConfiguratorModule } from './cocktail-configurator.module';

@NgModule({
  declarations: [
    AppComponent,
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
    TdmCommonModule.forRoot(),
    CocktailConfiguratorModule
  ],
  providers: [
    DragAndDropService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
