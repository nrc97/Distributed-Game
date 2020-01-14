import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestComponent } from './test/test.component';
import { CanvasComponent } from './canvas/canvas.component';

const routes: Routes = [
  {path: 'test', component: TestComponent},
  {path: '', component: CanvasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
