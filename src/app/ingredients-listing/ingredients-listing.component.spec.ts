import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsListingComponent } from './ingredients-listing.component';

describe('IngredientsListingComponent', () => {
  let component: IngredientsListingComponent;
  let fixture: ComponentFixture<IngredientsListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientsListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
