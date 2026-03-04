import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllReservasComponent } from './all-reservas.component';

describe('AllReservasComponent', () => {
  let component: AllReservasComponent;
  let fixture: ComponentFixture<AllReservasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllReservasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllReservasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
