import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasComponent } from './canvas.component';
import { AppModule } from '../app.module';
import { MatSnackBarModule, MatChipsModule, MatIconModule, MatButtonModule, MatCardModule } from '@angular/material';

describe('CanvasComponent', () => {
  let component: CanvasComponent;
  let fixture: ComponentFixture<CanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasComponent ],
      imports: [ MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatChipsModule,
        MatSnackBarModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
