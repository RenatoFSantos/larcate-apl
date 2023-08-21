import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashbackListComponent } from './cashback-list/cashback-list.component';

const routes: Routes = [
  { path: '', component: CashbackListComponent },
  { path: ':id', component: CashbackListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabCashbackRoutingModule {}
