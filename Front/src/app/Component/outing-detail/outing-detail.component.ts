import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OutlingService } from '../../Service/Fonction-service/outling-service/outling.service';
import {NgForOf, NgIf} from '@angular/common';
import {OpenAgendaService} from "../../Service/Fonction-service/open-agenda-service/open-agenda.service";
import { GoogleMap, MapMarker } from '@angular/google-maps';

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

  outing: any;
  participants: any[] = [];
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 12;

  messages: any[] = [
    { user: 'Host', text: 'Bienvenue à la sortie !' },
    { user: 'Guest1', text: 'Merci de m\'avoir invité.' },
    { user: 'Guest2', text: 'Hâte de vous rencontrer.' }
  ];

  constructor(
    private route: ActivatedRoute,
    private outingService: OutlingService,
    private openAgendaService: OpenAgendaService,
  ) {}

  ngOnInit(): void {
    const outingId = this.route.snapshot.paramMap.get('id');
    const uid = this.route.snapshot.paramMap.get('uid');

    if (uid && outingId) {
      this.getOutingDetails(uid);
      this.getParticipants(outingId);

      this.outingService.getOutlingById(outingId).subscribe(
        data => {
          console.log(data)
        })
    } else {
      console.error('ID de la sortie non trouvé dans l’URL');
    }

    if (uid) {
      console.log('UID de l\'événement externe:', uid);
    } else {
      console.error('UID non trouvé dans l’URL');
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
        console.log('Participants:', data);
        this.participants = data.body;
      },
      error: err => {
        console.error('Erreur lors de la récupération des participants', err);
      }
    });
  }
}
