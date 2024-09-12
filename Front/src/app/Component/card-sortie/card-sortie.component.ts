import { Component, Input, OnInit } from '@angular/core';
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

export class CardSortieComponent implements OnInit {
  @Input() sortie: any;
  public userConnectName: string | undefined;
  public isOrganizer: boolean = false;
  public isParticipant: boolean = false;
  public errorMsg:any = "";
  public isVisible = false;
  public actualUser:any;

  // Liste des tableaux de participants
  participantsArray: any[] = [];

  constructor(private router: Router, private outlingService: OutlingService, private authService: AuthService) {}

  ngOnInit() {
    this.getCurrentUser();
    this.getAllParticipants();
  }

  // Récupérer l'utilisateur connecté et vérifier s'il est l'organisateur de la sortie
  getCurrentUser() {
    this.authService.getCurrentUser().subscribe(
      data => {
        console.log('Utilisateur connecté:', data);
        this.userConnectName = data.username;
        this.actualUser = data;

        // Vérification si l'utilisateur connecté est l'organisateur de la sortie
        if (this.userConnectName === this.sortie.organizer.name) {
          this.isOrganizer = true;
        }
      },
      error => {
        console.error('Erreur lors de la récupération de l\'utilisateur connecté', error);
      }
    );
  }

  // Récupérer tous les participants de la sortie
  getAllParticipants() {
    this.outlingService.getParticipantsByOutingId(this.sortie.id).subscribe({
      next: (data) => {
        console.log('Liste des participants:', data);
        this.participantsArray.push(data.body);
        this.checkIfUserIsParticipant();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des participants :', err);
      }
    });
  }

 // Vérifier si l'utilisateur connecté est un participant
  checkIfUserIsParticipant() {
    let allParticipants = [].concat(...this.participantsArray);
    // @ts-ignore
    this.isParticipant = allParticipants.some(participant => participant.name === this.userConnectName);
    console.log('Est-ce que l\'utilisateur est participant ?', this.isParticipant);
  }




  // Rejoindre la sortie
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
