import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabCashbackRoutingModule } from './tab-cashback-routing.module';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/shared/shared.module';
import { CashbackListComponent } from './cashback-list/cashback-list.component';

@NgModule({
  declarations: [CashbackListComponent],
  imports: [CommonModule, IonicModule, SharedModule, TabCashbackRoutingModule],
})
export class TabCashbackModule {}
