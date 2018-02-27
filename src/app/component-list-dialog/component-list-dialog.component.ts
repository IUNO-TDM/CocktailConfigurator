import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CocktailComponent, ComponentService } from 'tdm-common';

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
