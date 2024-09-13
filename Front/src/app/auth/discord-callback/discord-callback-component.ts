import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Service/Fonction-service/auth-service/auth.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-discord-callback',
  templateUrl: './discord-callback-component.html',
  standalone: true,
  styleUrls: ['./discord-callback-component.css']
})
export class DiscordCallbackComponent implements OnInit {

  constructor(private authService: AuthService,  private router: Router) {}

  ngOnInit() {
    this.authService.submitDiscord().subscribe(
      data => {
        this.router.navigate(["/"]);
      },
      error => {
        console.error('Error fetching Discord user info:', error);
      }
    );
  }
}
