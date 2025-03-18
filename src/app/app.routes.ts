import { RouterModule, Routes } from '@angular/router';
import { KezdolapComponent } from './kezdolap/kezdolap.component';
import { EredmenyComponent } from './eredmeny/eredmeny.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {'path': '', component: KezdolapComponent},
    {'path': 'eredmeny', component: EredmenyComponent},
    {'path': '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }