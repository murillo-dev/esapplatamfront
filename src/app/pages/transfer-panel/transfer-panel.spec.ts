import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferPanel } from './transfer-panel';

describe('TransferPanel', () => {
  let component: TransferPanel;
  let fixture: ComponentFixture<TransferPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
