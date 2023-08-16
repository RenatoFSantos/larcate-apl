import { AlertService } from '../../../services/alert.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CONSTANTS } from 'src/shared/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @Input('title') title: string = '';
  @Input('check-login') isLogged: boolean = false;
  @Input('back') isBack: boolean = false;
  @Output() selected = new EventEmitter();

  constructor(private alertSrv: AlertService, private router: Router) {}

  ngOnInit() {}

  goProfile() {
    this.router.navigateByUrl('/tabs/tab-profile');
  }

  async logout(): Promise<void> {
    const result = await this.alertSrv.confirm(
      'Sair do App',
      'Deseja sair do Lacarte?',
      this.desconecta.bind(this)
    );
    if (result.role === 'Ok') {
      this.isLogged = false;
    }
  }

  desconecta(res: any) {
    if (res) {
      localStorage.removeItem(CONSTANTS.keyStore.user);
      localStorage.removeItem(CONSTANTS.keyStore.profile);
      localStorage.removeItem(CONSTANTS.keyStore.token);
      this.selected.emit(true);
    }
  }
}
