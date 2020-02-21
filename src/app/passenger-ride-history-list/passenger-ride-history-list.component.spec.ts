import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerRideHistoryListComponent } from './passenger-ride-history-list.component';

describe('PassengerRideHistoryListComponent', () => {
  let component: PassengerRideHistoryListComponent;
  let fixture: ComponentFixture<PassengerRideHistoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassengerRideHistoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerRideHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
