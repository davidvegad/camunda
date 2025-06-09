import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesoInicio } from './proceso-inicio';

describe('ProcesoInicio', () => {
  let component: ProcesoInicio;
  let fixture: ComponentFixture<ProcesoInicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcesoInicio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcesoInicio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
