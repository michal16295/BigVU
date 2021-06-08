import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainCanvasComponent } from './components/main-canvas/main-canvas.component';


const routes: Routes = [
  { path: ':color', component: MainCanvasComponent },
  {
    path: '',
    redirectTo: '/white',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
