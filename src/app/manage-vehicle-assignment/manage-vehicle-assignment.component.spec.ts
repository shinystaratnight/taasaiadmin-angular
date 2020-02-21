import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVehicleAssignmentComponent } from './manage-vehicle-assignment.component';

describe('ManageVehicleAssignmentComponent', () => {
  let component: ManageVehicleAssignmentComponent;
  let fixture: ComponentFixture<ManageVehicleAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageVehicleAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageVehicleAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
