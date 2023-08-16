import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorMessageComponent } from './component/error-message/error-message.component';
import { FormDebugComponent } from './component/form-debug/form-debug.component';
import { InputFileComponent } from './component/input-file/input-file.component';
import { ToolbarComponent } from './component/toolbar/toolbar.component';
import { IonicModule } from '@ionic/angular';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { StarRatingComponent } from './component/star-rating/star-rating.component';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  declarations: [
    ErrorMessageComponent,
    FormDebugComponent,
    InputFileComponent,
    ToolbarComponent,
    StarRatingComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot({
      dropSpecialCharacters: false, // mantém o formato após sair do campo.
    }),
  ],
  exports: [
    ErrorMessageComponent,
    FormDebugComponent,
    InputFileComponent,
    ToolbarComponent,
    StarRatingComponent,
    NgxMaskModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
