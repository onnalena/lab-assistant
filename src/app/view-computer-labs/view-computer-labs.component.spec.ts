import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewComputerLabsComponent } from './view-computer-labs.component';

describe('ViewComputerLabsComponent', () => {
  let component: ViewComputerLabsComponent;
  let fixture: ComponentFixture<ViewComputerLabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewComputerLabsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewComputerLabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
