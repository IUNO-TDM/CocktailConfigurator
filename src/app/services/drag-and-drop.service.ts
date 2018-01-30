import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { EventEmitter } from '@angular/core';

export class Draggable {
  object = null;
  origin = null;
}

@Injectable()
export class DragAndDropService {
  private draggable: Draggable;
  public dragStart: EventEmitter<Draggable> = new EventEmitter();
  public dragEnd: EventEmitter<Draggable> = new EventEmitter();
  public drop: EventEmitter<any> = new EventEmitter();

  constructor() { }

  onDragStart(draggable: Draggable) {
    this.draggable = draggable;
    this.dragStart.emit(this.draggable);
  }

  onDragEnd() {
    this.dragEnd.emit();
  }

  onDrop(target: any) {
    this.drop.emit({draggable: this.draggable, target: target});
  }
}
