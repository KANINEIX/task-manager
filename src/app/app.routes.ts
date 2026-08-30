import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';

export const routes: Routes = [
    {path: '', component: IndexComponent},
];