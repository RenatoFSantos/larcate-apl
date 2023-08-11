import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MenuListComponent } from './menu-list/menu-list.component';
import { MenuDetailComponent } from './menu-detail/menu-detail.component';

const routes: Routes = [
  { path: '', component: MenuListComponent },
  { path: 'company/:id', component: MenuDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabMenuRoutingModule {}
