import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabProfileRoutingModule } from './tab-profile-routing.module';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [ProfileFormComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TabProfileRoutingModule,
    PipesModule,
  ],
})
export class TabProfileModule {}
