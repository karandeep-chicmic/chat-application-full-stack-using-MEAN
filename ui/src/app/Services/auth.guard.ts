import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const canActivate = () => {
  const router: Router = inject(Router);
  if (localStorage.getItem('token')) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const canActivateLogin = () => {
  const router: Router = inject(Router);
  if (!localStorage.getItem('token')) {
    return true;
  } else {
    router.navigate(['/chat']);
    return false;
  }
};
