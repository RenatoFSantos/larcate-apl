import { NgModule } from '@angular/core';
import { TruncatePipe } from './truncate/truncate.pipe';
import { FormControlPipe } from './form-control/form-control.pipe';

@NgModule({
  declarations: [TruncatePipe, FormControlPipe],
  imports: [],
  exports: [TruncatePipe, FormControlPipe],
})
export class PipesModule {}
