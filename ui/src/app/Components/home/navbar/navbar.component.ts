import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SocketEventsService } from '../../../Services/socket-events.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  router: Router = inject(Router);
  sockets: SocketEventsService = inject(SocketEventsService);
  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    this.sockets.selectedUser.set('');
    this.router.navigate(['/login']);
  }
}
