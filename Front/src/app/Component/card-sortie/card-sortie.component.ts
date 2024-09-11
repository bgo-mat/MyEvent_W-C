import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {OutlingService} from "../../Service/Fonction-service/outling-service/outling.service";
import {AuthService} from "../../Service/Fonction-service/auth-service/auth.service";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-card-sortie',
  templateUrl: './card-sortie.component.html',
  styleUrl: './card-sortie.component.css',
  imports: [
    NgClass
  ],
  standalone: true
})
export class CardSortieComponent implements OnInit{

  @Input() sortie: any;
  public errorMsg:any = "";
  public isVisible = false;
  public actualUser:any;
  constructor(
    private router: Router,
    private outlingService: OutlingService,
    private authService: AuthService,
    ) {}

  ngOnInit() {

    this.initUser();
  }

  initUser(){
    this.authService.getCurrentUser().subscribe(
      data=>{
        this.actualUser = data;
      },
      error=>{
        console.log(error)
      }
    )
  }

  goToOutingDetail(outingId: string) {

    if(!this.actualUser){

      this.errorMsg = "Veuillez vous inscrire ou vous connecter pour rejoindre une sortie"
      this.openPopup();
    }else {

      this.outlingService.joinOuting(outingId).subscribe({
        next: (response) => {
          alert('Vous avez rejoint la sortie avec succès !');
          this.router.navigate([`/outing`, outingId, this.sortie.eventExternalId]);
        },
        error: (err) => {
          console.error('Erreur lors de la tentative de rejoindre la sortie :', err);
          this.router.navigate([`/outing`, outingId, this.sortie.eventExternalId]);
        }
      });

    }

  }

  openPopup() {
    this.isVisible = true;
  }

  closePopup() {
    this.isVisible = false;
  }

  redirectLog(){
    this.router.navigate(['/login'])
  }
}
