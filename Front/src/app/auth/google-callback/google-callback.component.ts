import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Service/Fonction-service/auth-service/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-google-callback',
  templateUrl: './google-callback.component.html',
  standalone: true,
  styleUrls: ['./google-callback.component.css']
})
export class GoogleCallbackComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {

    this.authService.submitGoogle().subscribe(
      data => {
        console.log('User info:', data);
        window.location.reload();
        this.router.navigate(["/"]);
      },
      error => {
        console.error('Error fetching user info:', error);
      }
    );
  }
}
