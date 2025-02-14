import { Routes } from '@angular/router';
import { KezdolapComponent } from './kezdolap/kezdolap.component';
import { EredmenyComponent } from './eredmeny/eredmeny.component';

export const routes: Routes = [
    {'path': '', component: KezdolapComponent},
    {'path': 'eredmeny', component: EredmenyComponent},
    {'path': '**', redirectTo: '', pathMatch: 'full'}
];
