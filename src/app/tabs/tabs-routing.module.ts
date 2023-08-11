import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab-menu',
        loadChildren: () =>
          import('../tab-menu/tab-menu.module').then((m) => m.TabMenuModule),
      },
      {
        path: 'tab-cashback',
        loadChildren: () =>
          import('../tab-cashback/tab-cashback.module').then(
            (m) => m.TabCashbackModule
          ),
      },
      {
        path: 'tab-profile',
        loadChildren: () =>
          import('../tab-profile/tab-profile.module').then(
            (m) => m.TabProfileModule
          ),
      },
      {
        path: '',
        redirectTo: '/tabs/tab-menu',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab-menu',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
