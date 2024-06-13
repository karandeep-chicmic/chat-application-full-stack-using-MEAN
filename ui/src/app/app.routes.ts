import { Routes } from '@angular/router';
import { ROUTES_UI } from './constants';
import { HomeComponentComponent } from './Components/home/home-component/home-component.component';
import { LoginComponent } from './Components/userAuth/login/login.component';
import { canActivate, canActivateLogin } from './Services/auth.guard';
import { RegisterComponent } from './Components/userAuth/register/register.component';
import { PageNotFoundComponent } from './Components/home/page-not-found/page-not-found.component';
import { ChatHomeComponent } from './Components/chat-pages/chat-home/chat-home.component';

export const routes: Routes = [
  { path: ROUTES_UI.DEFAULT, redirectTo: ROUTES_UI.LOGIN, pathMatch: 'full' },
  { path: ROUTES_UI.HOME, component: HomeComponentComponent },
  {
    path: ROUTES_UI.LOGIN,
    component: LoginComponent,
    canActivate: [canActivateLogin],
  },
  {
    path: ROUTES_UI.REGISTER,
    component: RegisterComponent,
    canActivate: [canActivateLogin],
  },
  {
    path: ROUTES_UI.CHAT,
    component: ChatHomeComponent,
    canActivate: [canActivate],
  },

  { path: ROUTES_UI.WILDCARD_ROUTE, component: PageNotFoundComponent },
];
