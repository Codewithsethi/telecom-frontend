import { Routes } from '@angular/router';
import { Recharge } from './recharge/recharge';

export const routes: Routes = [
    { path: '', redirectTo: 'recharge', pathMatch: 'full' },
    { path: 'recharge', component: Recharge }
];
