import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewComputersComponent } from './view-computers.component';

describe('ViewComputersComponent', () => {
  let component: ViewComputersComponent;
  let fixture: ComponentFixture<ViewComputersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewComputersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewComputersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
