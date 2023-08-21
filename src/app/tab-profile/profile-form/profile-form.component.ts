import { CameraService } from './../../../services/camera.service';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Event, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { calcDurationDays } from 'src/helper/utils';
import { UserModel } from 'src/models/user.model';
import { AlertService } from 'src/services/alert.service';
import { UserService } from 'src/services/user.service';
import { CONSTANTS } from 'src/shared/constants';
import { FileManager } from 'src/shared/component/input-file/input-file.component';
import * as dayjs from 'dayjs';
import 'dayjs/locale/pt-BR';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  @ViewChild('appInput') appInput: ElementRef;
  toggle = document.querySelector('#themeToggle');

  loginResource: UserModel = new UserModel();
  userResource: UserModel = new UserModel();
  inRegister = false;
  formResource: FormGroup;
  avatar = 'photo_default.jpg';
  birthDate = dayjs(new Date()).format('YYYY-MM-DDT09:00:00.000Z');
  birthDateTime = dayjs(new Date()).format('DD/MM/YYYY');
  showPicker = false;
  checked: boolean = false;
  hasAccount: boolean = false;

  constructor(
    public fb: FormBuilder,
    private userSrv: UserService,
    private alertSrv: AlertService,
    private router: Router,
    private cameraSrv: CameraService,
    private active: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('Entrei no ngOnInit');
    this.checkLogin();
    this.loadingTypeForm();
  }

  ionViewDidEnter() {
    this.inRegister = this.userSrv.userIsLogged();
    console.log(localStorage.getItem(CONSTANTS.keyStore.user));
    console.log('Entrei no ionViewDidEnter =>', this.inRegister);
    this.loadingTypeForm();
  }

  async loadingTypeForm() {
    console.log('Carregando formulário');
    if (!this.isLogged()) {
      this.checked = false;
      if (this.inRegister) {
        console.log('Não Registrado');
        await this.loadingFormRegister();
      } else {
        console.log('Não Logado');
        await this.loadingFormLogin();
      }
    } else {
      console.log('Logado');
      this.loginResource = await JSON.parse(
        localStorage.getItem(CONSTANTS.keyStore.user)
      );
      await this.loadingFormResource();
      await this.loadingUser();
    }
    console.log('Formulário carregado');
  }

  checkLogin() {
    this.active.params
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(async (params) => {
        this.checked =
          (await localStorage.getItem(CONSTANTS.keyStore.user)) !== null;
        this.inRegister = false;
      });
  }

  loadingFormLogin() {
    this.loginResource = new UserModel();
    this.formResource = this.fb.group({
      userDsEmail: ['', [Validators.required, Validators.email]],
      userCdPassword: ['', [Validators.required]],
    });
  }

  loadingFormRegister() {
    this.userResource = new UserModel();
    this.formResource = this.fb.group({
      userNmName: ['', [Validators.required]],
      userDsEmail: ['', [Validators.required, Validators.email]],
      userCdPassword: ['', [Validators.required]],
      userCdConfirmPassword: ['', null],
      userTxAvatar: ['photo_default.jpg', null],
    });
  }

  loadingFormResource() {
    this.userResource = new UserModel();
    this.formResource = this.fb.group(
      {
        userNmName: ['', [Validators.required]],
        userNmLastname: ['', null],
        userDtBirthdate: ['', null],
        userDsEmail: ['', [Validators.required, Validators.email]],
        userCdPassword: ['', [Validators.required]],
        userCdConfirmPassword: ['', null],
        userCdType: ['', null],
        userTxAvatar: ['photo_default.jpg', null],
      },
      {
        validators: [
          this.confirmPassword('userCdPassword', 'userCdConfirmPassword'),
          this.validationBirthDate('userDtBirthdate'),
        ],
      }
    );
  }

  cancelFormRegister() {
    this.inRegister = false;
    this.loadingTypeForm();
  }

  async loadingUser(): Promise<void> {
    try {
      if (this.loginResource.uid) {
        Object.assign(this.userResource, this.loginResource);
      } else {
        const result = await this.userSrv.getById(this.loginResource.uid);
        console.log('Carregando usuário', this.loginResource.uid);
        if (result.success) {
          this.userResource = result.data as UserModel;
          this.inRegister = true;
        }
      }
      await this.formResource.patchValue(this.userResource);
      await this.loadingPhoto();
      if (this.userResource.userDtBirthdate) {
        this.birthDate = this.userResource.userDtBirthdate.toString();
        this.birthDateTime = dayjs(
          this.userResource.userDtBirthdate.toString()
        ).format('DD/MM/YYYY');
        this.formResource.get('userDtBirthdate').setValue(this.birthDate);
      }
    } catch (error) {
      this.alertSrv.toast(
        'ERRO! Não consigo acessar usuário. Verifique!',
        'top'
      );
    }
  }

  private confirmPassword(
    controlName: string,
    matchingControlName: string
  ): ValidationErrors | null {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (matchingControl.value !== control.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  private validationBirthDate(controlName: string): ValidationErrors | null {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      if (control.errors && !control.errors['birthDate']) {
        return;
      }

      if (calcDurationDays(new Date(), new Date(control.value)) > 0) {
        control.setErrors(null);
      } else {
        control.setErrors({ birthDate: true });
      }
    };
  }

  isLogged(): boolean {
    return this.userSrv.userIsLogged();
  }

  async submitForm() {
    if (this.inRegister) {
      // --- EDIT PROFILE
      if (this.formResource.valid) {
        if (this.isLogged()) {
          this.userResource.userNmName =
            this.formResource.get('userNmName').value;
          this.userResource.userNmLastname =
            this.formResource.get('userNmLastname').value;
          if (this.formResource.get('userDtBirthdate')) {
            const dateBirthdate = dayjs(
              this.formResource.get('userDtBirthdate').value
            ).format('YYYY-MM-DDT09:00:00.000Z');
            this.userResource.userDtBirthdate = new Date(dateBirthdate);
          }
          this.userResource.userDsEmail =
            this.formResource.get('userDsEmail').value;
          this.userResource.userCdPassword =
            this.formResource.get('userCdPassword').value;
          // SAVING FORM
          await this.savingForm();
        } else if (!this.isLogged()) {
          // --- INSERT PROFILE
          try {
            const result = await this.userSrv.validEmail(
              this.formResource.get('userDsEmail').value
            );
            if (result.success && result.data) {
              this.alertSrv.alert('Email', 'Email já existente. Tente outro!');
            } else {
              this.userResource.userNmName =
                this.formResource.get('userNmName').value;
              this.userResource.userSgUser = 'XXX';
              this.userResource.userDsEmail =
                this.formResource.get('userDsEmail').value;
              this.userResource.userCdPassword =
                this.formResource.get('userCdPassword').value;
              this.userResource.userTxAvatar =
                this.formResource.get('userTxAvatar').value;
              // SAVING FORM
              await this.savingForm();
            }
          } catch (error) {
            this.alertSrv.alert(
              'Erro',
              'Não consigo validar email. Verifique!'
            );
          }
        }
        this.loadingTypeForm();
      } else {
        this.alertSrv.alert(
          'ERRO',
          'Verifique se todos os campos estão preenchidos!'
        );
      }
    } else {
      // --- LOGIN USER
      if (this.formResource.valid) {
        this.loginResource.userDsEmail =
          this.formResource.get('userDsEmail').value;
        this.loginResource.userCdPassword =
          this.formResource.get('userCdPassword').value;
        try {
          const { success, data } = await this.userSrv.login(
            this.loginResource
          );
          if (success) {
            this.userSrv.saveDataLoginInfo(data);
            this.inRegister = false;
            this.checked = true;
            // --- LOADING USER PROFILE
            // await this.loadingUser();
          } else {
            this.alertSrv.alert(
              'ERRO',
              'Usuário/senha inválidos. Tente novamente!'
            );
          }
          this.router.navigateByUrl('/tabs/tab-profile');
        } catch (error) {
          this.alertSrv.alert(
            'ERRO',
            'Não consigo localizar usuário. Verifique!'
          );
        }
        this.loadingTypeForm();
      } else {
        this.alertSrv.alert('ERRO', 'Preencha todo formulário!');
      }
    }
  }

  async savingForm(): Promise<void> {
    // --- SAVING FORM
    try {
      await this.userSrv.save(this.userResource);
      this.alertSrv.toast('Usuário salvo com sucesso!', 'top');
      if (!this.isLogged()) {
        this.inRegister = false;
      } else {
        // Update users data form
        console.log(
          'Carregando os valores salvos no formulário= ',
          this.userResource
        );
        delete this.userResource.userCdPassword;
        await this.userSrv.updateUserSession(this.userResource);
      }
      this.router.navigateByUrl('/tabs/tab-profile');
    } catch (error) {
      this.alertSrv.alert('ERRO', 'Erro na gravação. Verifique!');
    }
  }

  insertUser() {
    if (!this.isLogged()) {
      this.inRegister = true;
      this.loadingFormRegister();
    } else {
      this.alertSrv.toast('Usuário já está logado. Verifique!', 'top');
    }
  }

  // --- RESCUE PASSWORD

  async forgetPassword() {
    const email = this.formResource.get('userDsEmail').value;
    const emailValid = this.formResource.get('userDsEmail').valid;
    if (!email || !emailValid) {
      this.alertSrv.alert(
        'Email',
        'Para recuperar a senha, digite um email válido cadastrado! Enviaremos uma mensagem para este email!'
      );
    } else {
      const resultUser = await this.userSrv.validEmail(email);
      if (resultUser.success) {
        const user = resultUser.data as UserModel;
        const resultEmail = await this.userSrv.sendEmail(user);
        if (resultEmail.success) {
          this.alertSrv.alert('Parabéns!', 'Email enviado com sucesso!!!');
        } else {
          this.alertSrv.alert('Erro!', 'Não consigo enviar email! Verifique!');
        }
      } else {
        this.alertSrv.alert(
          'Erro!',
          'Email não cadastrado em nossa base. Por favor, verifique!'
        );
      }
    }
  }

  // --- *******************

  loadingPhoto() {
    this.avatar = `${environment.apiPath}/storage/photo_default.jpg`;
    if (!this.isLogged()) {
      if (this.loginResource.userTxAvatar) {
        this.avatar = `${environment.apiPath}/storage/${this.loginResource.userTxAvatar}`;
      }
    } else {
      if (this.userResource.userTxAvatar) {
        this.avatar = `${environment.apiPath}/storage/${this.userResource.userTxAvatar}`;
        const result = this.avatar.split('/').lastIndexOf('');
        if (result !== 1) {
          this.formResource.get('userTxAvatar').setValue(result);
        }
      } else {
        this.formResource.get('userTxAvatar').setValue('photo_default.jpg');
      }
    }
  }

  async logout(): Promise<void> {
    const result = await this.alertSrv.confirm(
      'Sair do App',
      'Deseja sair do Lacarte?',
      this.desconecta
    );
    console.log('Valor do result no logout=', result);
    if (result.data) {
      this.inRegister = false;
      this.birthDate = '';
      this.birthDateTime = '';
      await this.loadingTypeForm();
      // await this.checkLogin();
      // this.loadingFormLogin();
    }
  }

  desconecta(res: any) {
    if (res) {
      localStorage.clear();
    }
  }

  dateChanged(value: any) {
    const dateValue = dayjs(value).format('DD/MM/YYYY');
    this.formResource.get('userDtBirthdate').setValue(value);
    this.userResource.userDtBirthdate = value;
    this.birthDate = value.toString();
    this.birthDateTime = dateValue;
    this.showPicker = !this.showPicker;
  }

  // --- Take a picture with the Capacitor (Current)

  addPhotoToGallery() {
    this.cameraSrv.addNewToGallery().then((photo) => {
      this.userResource.userTxAvatar =
        'data:image/jpg;base64,' + photo.base64String;
      this.avatar = 'data:image/jpg;base64,' + photo.base64String;
    });
  }

  // --- Take a picture with the Input File (Deprecated)

  selectedFile(file: FileManager): void {
    if (file.base64Data) {
      this.userResource.userTxAvatar = file.base64Data;
      this.avatar = file.base64Data;
    }
  }

  selected_toolbar(ev: boolean): void {
    if (ev) {
      this.inRegister = false;
      this.birthDate = '';
      this.birthDateTime = '';
      this.loadingFormLogin();
    }
  }

  changeTheme(ev: any) {
    if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      document.body.classList.toggle('dark', ev.detail.checked);
      prefersDark.addEventListener('ionChange', (evt) => {
        document.body.classList.toggle('dark', ev.detail.checked);
      });
    } else {
      this.alertSrv.alert('Dark Mode', 'Dark mode não suportado!');
    }
  }

  toggleDarkTheme(shouldAdd: any) {
    document.body.classList.toggle('dark', shouldAdd);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
