import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'employee-accounts',
    loadChildren: () =>
      import('../employee-accounts/employee-accounts.module').then(
        (m) => m.EmployeeAccountsPageModule
      ),
  },
  {
    path: 'perfil',
    loadChildren: () =>
      import('../perfil/perfil.module').then((m) => m.PerfilPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
