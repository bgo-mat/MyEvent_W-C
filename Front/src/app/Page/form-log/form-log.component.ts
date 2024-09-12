import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../Service/Fonction-service/auth-service/auth.service";
import {data} from "autoprefixer";
import {Router} from "@angular/router";

@Component({
  selector: 'app-form-log',
  standalone: true,
  imports: [],
  templateUrl: './form-log.component.html',
  styleUrl: './form-log.component.css'
})
export class FormLogComponent implements OnInit{

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.checkConnectedUser();
  }

  checkConnectedUser(){
    this.authService.getCurrentUser().subscribe(
      data => {
        if(data){
          this.router.navigate(['/profil']);
        }
      },
      error => {
        console.error("Erreur lors de la récupération de l'utilisateur", error);
      }
    );
  }

  connexionGoogle(){
    window.location.href = 'http://51.75.162.147:8080/oauth2/authorization/google';
  }
  connexionDiscord() {
    window.location.href = 'http://51.75.162.147:8080/oauth2/authorization/discord';
  }

}
