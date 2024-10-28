import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // Redireciona para a página de login
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'product-creation',
    loadChildren: () =>
      import('./product-creation/product-creation.module').then(
        (m) => m.ProductCreationPageModule
      ),
  },
  {
    path: 'perfil',
    loadChildren: () =>
      import('./perfil/perfil.module').then((m) => m.PerfilPageModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'editar-perfil/:email',
    loadChildren: () =>
      import('./editar-perfil/editar-perfil.module').then(
        (m) => m.EditarPerfilPageModule
      ),
  },
  {
    path: 'employee-accounts',
    loadChildren: () =>
      import('./employee-accounts/employee-accounts.module').then(
        (m) => m.EmployeeAccountsPageModule
      ),
  },
  {
    path: 'cadastro',
    loadChildren: () =>
      import('./cadastro/cadastro.module').then((m) => m.CadastroPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
