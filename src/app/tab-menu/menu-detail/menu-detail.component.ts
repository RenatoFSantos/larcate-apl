import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { from, Subject } from 'rxjs';
import { distinct, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CategoryModel } from 'src/models/category.model';
import { MenuModel } from 'src/models/menu.model';
import { MenuService } from 'src/services/menu.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-menu-detail',
  templateUrl: './menu-detail.component.html',
  styleUrls: ['./menu-detail.component.scss'],
})
export class MenuDetailComponent implements OnInit, OnDestroy {
  private unsubscribeUid = new Subject<void>();
  private unsubscribeCategory = new Subject<void>();
  listCategory: Array<CategoryModel> = new Array<CategoryModel>();
  listMenu: Array<MenuModel> = new Array<MenuModel>();
  itemDetail = false;
  title = '';
  selCategory = 'Selecione uma categoria';
  isBackButton = false;
  checked: boolean = false;

  constructor(
    private active: ActivatedRoute,
    private menuSrv: MenuService,
    private userSrv: UserService
  ) {}

  ngOnInit() {
    this.loadingResources();
  }

  async loadingResources() {
    console.log('Carregando categorias...');
    this.active.params
      .pipe(takeUntil(this.unsubscribeUid))
      .subscribe(async (p) => {
        this.listMenu = await this.menuSrv.getMenuByCompany(p['id']);
        if (this.listMenu.length > 0) {
          this.title = this.listMenu[0].company.compNmTrademark;
        } else {
          this.title = 'Cardápio';
        }
        this.itemDetail = false;
        this.checked = this.userSrv.userIsLogged();
        await this.groupCategory();
      });
  }

  async filterCategory(idCategory: string) {
    this.listMenu = this.listMenu.filter(
      (menu) => menu.product.category.uid === idCategory
    );
    this.itemDetail = true;
    this.selCategory =
      this.listMenu[0].product.category.cateNmCategory.toUpperCase();
  }

  async groupCategory() {
    this.listCategory = new Array<CategoryModel>();
    from(this.listMenu)
      .pipe(
        takeUntil(this.unsubscribeCategory),
        distinct((obj) => obj.product.category.cateNmCategory)
      )
      .subscribe((resp) => {
        this.listCategory.push(resp.product.category);
      });
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

  closeMenu() {
    this.itemDetail = false;
  }

  ngOnDestroy(): void {
    console.log('Entrei no onDestroy do MenuCategory!');
    this.unsubscribeUid.next();
    this.unsubscribeUid.complete();
    this.unsubscribeCategory.next();
    this.unsubscribeCategory.complete();
  }
}
