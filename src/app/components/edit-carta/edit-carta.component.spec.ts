import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCartaComponent } from './edit-carta.component';

describe('EditCartaComponent', () => {
  let component: EditCartaComponent;
  let fixture: ComponentFixture<EditCartaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCartaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCartaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
