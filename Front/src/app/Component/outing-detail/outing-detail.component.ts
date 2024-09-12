import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { OutlingService } from '../../Service/Fonction-service/outling-service/outling.service';
import { NgForOf, NgIf } from '@angular/common';
import { OpenAgendaService } from "../../Service/Fonction-service/open-agenda-service/open-agenda.service";
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { AuthService } from "../../Service/Fonction-service/auth-service/auth.service";
import {data} from "autoprefixer";

@Component({
  selector: 'app-outing-detail',
  templateUrl: './outing-detail.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    GoogleMap,
    MapMarker
  ],
  styleUrls: ['./outing-detail.component.css']
})
export class OutingDetailComponent implements OnInit {
  outing: any = null;
  participants: any[] = [];
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 12;
  public isOrganizer: boolean = false;
  public inviteLink: string | null = null;
  public copyMessage: string | null = null;
  public visibiliti: string | null = null;
  public outingId: any;
  public uid:any;

  messages: any[] = [
    { user: 'Host', text: 'Bienvenue à la sortie !' },
    { user: 'Guest1', text: 'Merci de m\'avoir invité.' },
    { user: 'Guest2', text: 'Hâte de vous rencontrer.' }
  ];

  constructor(
    private route: ActivatedRoute,
    private outingService: OutlingService,
    private openAgendaService: OpenAgendaService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.outingId = this.route.snapshot.paramMap.get('id');
    this.uid = this.route.snapshot.paramMap.get('uid');

    if (this.uid && this.outingId) {
      this.getOutingDetails(this.uid);
      this.getParticipants(this.outingId);
      this.outingService.getOutlingById(this.uid).subscribe(
        data => {
          for(let i = 0; i < data.body.length; i++){
            if(data.body[i].id == this.outingId){
              this.visibiliti = data.body[i].visibility;
              break;
            }
          }
        })
    } else {
      console.error('ID de la sortie non trouvé dans l’URL');
    }
  }


  // Vérifier si l'utilisateur connecté est le premier participant
  checkIfOrganizer(): void {
    if (this.participants.length > 0) {
      this.authService.getCurrentUser().subscribe({
        next: (data) => {
          if (data.username === this.participants[0].name) {
            this.isOrganizer = true;
          }
        },
        error: (err) => {
          console.error('Erreur lors de la récupération de l\'utilisateur connecté :', err);
        }
      });
    }
  }

  getOutingDetails(outingId: string) {
    this.openAgendaService.getComponentById(outingId).subscribe({
      next: data => {

        this.outing = data.body.results[0];

        if (this.outing && this.outing.location_coordinates) {
          this.center = {
            lat: this.outing.location_coordinates.lat,
            lng: this.outing.location_coordinates.lon
          };
        }
      },
      error: err => {
        console.error('Erreur lors de la récupération des détails de la sortie', err);
      }
    });

  }

  getParticipants(outingId: string) {
    this.outingService.getParticipantsByOutingId(outingId).subscribe({
      next: data => {
        this.participants = data.body;
        this.checkIfOrganizer();
      },
      error: err => {
        console.error('Erreur lors de la récupération des participants', err);
      }
    });
  }

  // Générer un lien d'invitation
  generateInviteLink(): void {
    const outingId = this.route.snapshot.paramMap.get('id');
    this.outingService.generateInviteLink(outingId).subscribe({
      next: (data) => {
        this.inviteLink = data.body.inviteLink;
        console.log('Lien d\'invitation généré:', this.inviteLink);
      },
      error: (err) => {
        console.error('Erreur lors de la génération du lien d\'invitation:', err);
      }
    });
  }

  copyToClipboard(link: string): void {
    navigator.clipboard.writeText(link).then(() => {
      this.copyMessage = 'Lien copié dans le presse-papiers !';
    }).catch(err => {
      console.error('Échec de la copie du lien :', err);
    });
  }

  redirectBack(){
    this.router.navigate(['/event-detail', this.uid])
  }
}
