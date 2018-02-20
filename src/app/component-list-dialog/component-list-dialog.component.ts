import { Component, OnInit, Inject } from '@angular/core';
import { ComponentService } from '../services/component.service';
import { CocktailComponent } from '../model/cocktail';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-component-list-dialog',
  templateUrl: './component-list-dialog.component.html',
  styleUrls: ['./component-list-dialog.component.css']
})
export class ComponentListDialogComponent implements OnInit {
  components: CocktailComponent[] = [];

  constructor(
    private componentService: ComponentService,
    public dialogRef: MatDialogRef<ComponentListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {
    componentService.components.subscribe(components => {
      this.components = components;
    });
  }

  ngOnInit() {
  }

  onComponentSelected(component: CocktailComponent) {
    this.dialogRef.close(component);
  }

  onCancel() {
    this.dialogRef.close('Cancel');
  }

}
