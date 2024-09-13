import {Component, AfterViewInit, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {Router} from '@angular/router';
import {OpenAgendaService} from "../../Service/Fonction-service/open-agenda-service/open-agenda.service";
import {data} from "autoprefixer";
import {AuthService} from "../../Service/Fonction-service/auth-service/auth.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements AfterViewInit , OnInit{

  public results: any[] = [];
  public userInfo: any[]= [];
  public username:any;
  constructor( private router: Router, private authService: AuthService) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initializeMobileMenu();


    this.authService.getCurrentUser().subscribe(
      data => {
        this.userInfo = data;
        this.username = data.username;
      },
      error => {
        console.error("Erreur lors de la récupération de l'utilisateur", error);
      }
    );
  }


  logout() {
    this.authService.logout().subscribe(
      response => {

        this.results = response;
        this.username = '';
        this.router.navigate(['/']);
      },
      error => {
        console.error('Erreur lors de la déconnexion', error);
      }
    );
  }


  redirectForm(){
    if(this.username){
      this.router.navigate([`/profil`]);
    }else{
      this.router.navigate([`/login`]);
    }
  }
  redirectAccueil(){
    this.router.navigate([`/`]);
  }

  initializeMobileMenu() {
    const btn = document.querySelector("button.mobile-menu-button");
    const menu = document.querySelector("#mobile-menu");

    if (btn && menu) {
      btn.addEventListener("click", () => {
        if (menu.classList.contains("max-h-0")) {
          menu.classList.remove("max-h-0");
          menu.classList.add("max-h-96");
        } else {
          menu.classList.remove("max-h-96");
          menu.classList.add("max-h-0");
        }
      });
    }
  }
}
