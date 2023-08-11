import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { TabMenuRoutingModule } from './tab-menu-routing.module';
import { MenuListComponent } from './menu-list/menu-list.component';
import { SharedModule } from 'src/shared/shared.module';

@NgModule({
  declarations: [MenuListComponent],
  imports: [IonicModule, CommonModule, TabMenuRoutingModule, SharedModule],
})
export class TabMenuModule {}
