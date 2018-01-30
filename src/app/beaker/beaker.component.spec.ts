import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeakerComponent } from './beaker.component';

describe('BeakerComponent', () => {
  let component: BeakerComponent;
  let fixture: ComponentFixture<BeakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
