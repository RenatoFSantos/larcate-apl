import { Component, OnDestroy, OnInit } from '@angular/core';
import { calcDurationDays } from '../../../helper/utils';
import { AlertService } from '../../../services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyModel } from 'src/models/company.model';
import { CompanyService } from 'src/services/company.service';
import { environment } from 'src/environments/environment';
import { PromotionModel } from 'src/models/promotion.model';
import { PromotionService } from 'src/services/promotion.service';
import { CONSTANTS } from 'src/shared/constants';
import { UserModel } from 'src/models/user.model';
import { CashbackService } from 'src/services/cashback.service';
import { FidelityModel } from 'src/models/fidelity.model';
import { UserService } from 'src/services/user.service';
import * as dayjs from 'dayjs';
import * as isLeapYear from 'dayjs/plugin/isLeapYear';
import 'dayjs/locale/pt-BR';
import { of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VoucherModel } from 'src/models/voucher.model';
dayjs.extend(isLeapYear);
dayjs.locale('pt-BR');

@Component({
  selector: 'app-cashback-list',
  templateUrl: './cashback-list.component.html',
  styleUrls: ['./cashback-list.component.scss'],
})
export class CashbackListComponent implements OnInit, OnDestroy {
  private unsubscribeCompany = new Subject<void>();
  private unsubscribeUser = new Subject<void>();
  company: CompanyModel = new CompanyModel();
  voucher: VoucherModel;
  listCompanies: Array<CompanyModel> = new Array<CompanyModel>();
  listPromotions: Array<PromotionModel> = new Array<PromotionModel>();
  listFidelities: Array<FidelityModel> = new Array<FidelityModel>();
  selPromotion: PromotionModel = new PromotionModel();
  dateToday = dayjs(new Date()).format('DD/MM/YYYY');
  dtFinish = dayjs(new Date()).format('DD/MM/YYYY');
  title = '';
  isMyWallet = false;
  isDetail = false;
  isAdmin = false;
  checked: boolean = false;
  isActivePromotion = false;
  user: UserModel = new UserModel();
  cashback: FidelityModel;
  indexes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  count = 0;
  codeGenerated = '0';
  codeVoucher = '0';
  codeInterval: any;
  progress = 0;
  progressInterval: any;

  constructor(
    private active: ActivatedRoute,
    private companySrv: CompanyService,
    private userSrv: UserService,
    private promotionSrv: PromotionService,
    private cashbackSrv: CashbackService,
    private alertSrv: AlertService,
    private route: Router
  ) {}

  ngOnInit() {
    console.log('Entrei no Init do Cashback');
    this.loadingResource();
  }

  ionViewWillEnter() {
    console.log('Reativando intervalo');
    this.setIntrvlProgress();
  }

  ionViewWillLeave() {
    if (this.progressInterval) {
      console.log('Cancelando intervalo');
      // Retirei para testar a geração constante e ver se teria problemas de memória.
      clearInterval(this.progressInterval);
    }
  }

  async loadingResource() {
    this.active.params
      .pipe(takeUntil(this.unsubscribeCompany))
      .subscribe(async (p) => {
        if (p['id'] !== undefined) {
          this.title = 'Promoções';
          this.isMyWallet = false;
          this.setCompany(p['id']);
        } else {
          this.title = 'Minha Carteira';
          if (this.userSrv.userIsLogged()) {
            this.isMyWallet = true;
            this.checked = true;
            this.user = await this.getUser();
            console.log('Código do usuário=', this.user.uid);
            of(this.user.uid)
              .pipe(takeUntil(this.unsubscribeUser))
              .subscribe(async (id) => {
                console.log('valor do id antes do getFidelityByUser=', id);
                const result = await this.cashbackSrv.getFidelityByUser(id);
                if (result.success) {
                  this.listFidelities = result.data as Array<FidelityModel>;
                  // ORDER BY COMPANY NAME
                  this.listFidelities.sort((a, b) => {
                    if (
                      a.promotion.company.compNmTrademark >
                      b.promotion.company.compNmTrademark
                    ) {
                      return 1;
                    }
                    if (
                      a.promotion.company.compNmTrademark <
                      b.promotion.company.compNmTrademark
                    ) {
                      return -1;
                    }
                    return 0;
                  });
                } else {
                  this.alertSrv.alert(
                    'Promoções',
                    'Não existem promoções cadastradas para este usuário!'
                  );
                }
              });
          } else {
            this.alertSrv.alert(
              'Cadastro',
              'É necessário uma cadastro para acessar sua carteira de promoções! Cadastre-se agora!'
            );
            this.route.navigateByUrl('/tabs/tab-profile');
          }
        }
      });
  }

  async setCompany(uid: string): Promise<void> {
    this.company = new CompanyModel();
    const result = await this.companySrv.getById(uid);
    if (result.success) {
      this.company = result.data as CompanyModel;
      await this.loadingPromotions();
      this.checked = this.userSrv.userIsLogged();
    } else {
      this.alertSrv.alert(
        'Erro!!!',
        'Não consigo encontrar empresa. Verifique!'
      );
    }
  }

  async getUser(): Promise<UserModel> {
    this.user = new UserModel();
    if (await this.userSrv.userIsLogged()) {
      this.user = await JSON.parse(
        localStorage.getItem(CONSTANTS.keyStore.user)
      );
    }
    return this.user;
  }

  async loadingPromotions() {
    this.listPromotions = new Array<PromotionModel>();
    const result = await this.promotionSrv.getPromotionsByCompany(
      this.company.uid
    );
    if (result.success) {
      this.listPromotions = (await result.data
        .resourceList) as Array<PromotionModel>;
    }
  }

  loadingPhoto(imgPhoto: any): any {
    let imgResult = 'product_default.jpg';
    if (imgPhoto) {
      imgResult = `${environment.apiPath}/storage/${imgPhoto}`;
    } else {
      imgResult = `${environment.apiPath}/storage/${imgResult}`;
    }
    return imgResult;
  }

  validPromotion(dt: any): number {
    const today = dayjs();
    const diffDate = calcDurationDays(dt, today.toDate());
    return diffDate;
  }

  async detailPromotion(promotion: PromotionModel) {
    if (this.validPromotion(promotion.promDtFinish) > 0) {
      this.isActivePromotion = true;
    } else {
      this.isActivePromotion = false;
    }
    this.cashback = new FidelityModel();
    if (this.user.uid === undefined || this.user.uid === null) {
      if (localStorage.getItem(CONSTANTS.keyStore.user) !== null) {
        this.user = await this.getUser();
      } else {
        this.alertSrv.alert(
          'Cashback',
          'Para usar esta funcionalidade é necessário um cadastro. Faça seu cadastro no opção Perfil!'
        );
        this.route.navigateByUrl('/tabs/tab-profile');
      }
    }
    await Object.assign(this.company, promotion.company);

    if (this.company?.uid === undefined || this.company?.uid === null) {
      await this.setCompany(promotion.company.uid);
    }
    // GET FIDELITY BY USER AND PROMOTION
    const result = await this.cashbackSrv.getFidelityByUserPromotion(
      this.user.uid,
      promotion.uid
    );
    if (result.success) {
      this.cashback = result.data as FidelityModel;
      if (this.cashback && this.cashback.fideQnVoucher != null) {
        this.count = this.cashback.fideQnVoucher;
      } else {
        // CREATE NEW CASHBACK
        this.cashback = new FidelityModel();
        this.cashback.fideInValidate = true;
        this.cashback.promotion = promotion;
        this.cashback.user = this.user;
        this.count = 0;
      }
    }
    this.isDetail = true;
    // VALIDATING USER BY COMPANY RESPONSIBLE
    if (this.user.uid === this.company.user.uid) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.selPromotion = promotion;
  }

  backList() {
    this.isDetail = false;
  }

  rescueConfirm(rescue: any) {
    this.alertSrv
      .confirm(
        'Promotion',
        'Deseja resgatar esta promoção?',
        this.rescuePromotion
      )
      .then(async (resp) => {
        if (resp.role === 'Ok') {
          const confirm = await this.getVoucher(0);
          if (confirm) {
            this.cashback.fideQnVoucher = 0;
            try {
              const result = await this.cashbackSrv.save(this.cashback);
              if (result.success) {
                this.alertSrv.toast('Voucher resgatado!', 'top');
                this.backList();
              }
            } catch (error) {
              this.alertSrv.alert(
                'Erro!',
                'Não consigo gravar registro. Verifique!'
              );
            }
          }
        }
      });
  }

  async rescuePromotion(res: any) {
    if (res) {
      console.log('Entrei no rescuePromotion');
    }
  }

  async getVoucher(ind: number): Promise<boolean> {
    if (this.isActivePromotion) {
      if (this.codeGenerated === '0') {
        await this.voucherGenerator();
      }
      this.codeVoucher = await this.voucherAuthorization();
      if (this.codeGenerated.trim() === this.codeVoucher.trim()) {
        if (ind > 0) {
          this.count = this.count + 1;
          this.cashback.fideQnVoucher = this.count;
          this.saveVoucher(this.cashback);
        }
        return true;
      } else {
        this.alertSrv.alert('Erro!!!', 'Código digitado inválido!');
        return false;
      }
    } else {
      this.alertSrv.alert('Aviso', 'Promoção encerrada!');
      return false;
    }
  }

  async voucherAuthorization(): Promise<any> {
    let result = '0';
    await this.alertSrv.codeAuthorization().then((resp) => {
      if (resp.role === 'Ok') {
        result = resp.data.values[0];
      }
    });
    return result;
  }

  async voucherGenerator(): Promise<any> {
    this.codeGenerated = '';
    this.voucher = new VoucherModel();
    const result = await this.cashbackSrv.generateVoucher(this.voucher);
    if (result.success) {
      this.voucher = result.data as VoucherModel;
      this.codeGenerated = this.voucher.voucCdCode;
    } else {
      this.alertSrv.alert(
        'Erro!',
        'Não consigo gerar código do voucher. Verifique!'
      );
    }
  }

  async saveVoucher(model: FidelityModel) {
    try {
      this.cashbackSrv.save(model);
    } catch (error) {
      this.alertSrv.alert('Erro!', 'Não consigo salvar os dados. Verifique!');
    }
  }

  setIntrvlProgress() {
    console.log('Entrei no intervalo');
    this.progress = 1;
    this.progressInterval = setInterval(() => {
      this.progress += 0.01;
      if (this.progress > 1) {
        console.log('Setando intervalo', this.progress);
        setTimeout(() => {
          this.progress = 0;
          this.voucherGenerator();
        }, 150);
      }
    }, 300);
  }

  ngOnDestroy(): void {
    console.log('Entrei no onDestroy');
    clearInterval(this.progressInterval);
    this.unsubscribeCompany.next();
    this.unsubscribeCompany.complete();
    this.unsubscribeUser.next();
    this.unsubscribeUser.complete();
  }
}
