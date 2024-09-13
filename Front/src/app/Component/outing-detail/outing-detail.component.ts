import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OutlingService } from '../../Service/Fonction-service/outling-service/outling.service';
import {NgForOf, NgIf, SlicePipe} from '@angular/common';
import { OpenAgendaService } from "../../Service/Fonction-service/open-agenda-service/open-agenda.service";
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { AuthService } from "../../Service/Fonction-service/auth-service/auth.service";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { FormsModule } from "@angular/forms";
import {WeatherService} from "../../Service/Fonction-service/weather-api/weather.service";

@Component({
  selector: 'app-outing-detail',
  templateUrl: './outing-detail.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    GoogleMap,
    MapMarker,
    FormsModule,
    SlicePipe
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

  messages: any[] = [];
  messageContent: string = '';
  stompClient: Client | null = null;  // Changer le type de stompClient pour correspondre à la classe Client
  public outingId: any;
  public uid: any;
  public userName: string = '';
  currentTemperature: any;
  currentTime: string | undefined;
  weatherIcon: string | undefined;
  showFullDescription: boolean = false;
  maxLength: number = 200;

  constructor(
    private route: ActivatedRoute,
    private outingService: OutlingService,
    private openAgendaService: OpenAgendaService,
    private authService: AuthService,
    private router: Router,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    this.outingId = this.route.snapshot.paramMap.get('id');
    this.uid = this.route.snapshot.paramMap.get('uid');

    if (this.uid && this.outingId) {
      this.getOutingDetails(this.uid);
      this.getParticipants(this.outingId);
      this.getMessages(this.outingId);  // Nouvelle méthode pour charger les messages
      this.getCurrentUserAndConnectToSocket(this.outingId);
    } else {
      console.error('ID de la sortie non trouvé dans l’URL');
    }
  }

  getCurrentUserAndConnectToSocket(outingId: string): void {
    this.authService.getCurrentUser().subscribe({
      next: (data) => {
        this.userName = data.username;
        this.connectToSocket(outingId);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l\'utilisateur connecté :', err);
      }
    });
  }

  connectToSocket(outingId: string): void {
    const socket = new SockJS('https://api.myeventwac.fr/ws');
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),  // Pour déboguer les connexions
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = (frame) => {
      this.stompClient?.subscribe(`/topic/${outingId}`, (message) => {
        this.onMessageReceived(JSON.parse(message.body));
      });

      this.stompClient?.publish({
        destination: `/app/chat.addUser/${outingId}`,
        body: JSON.stringify({
          sender: this.userName,
          type: 'JOIN'
        }),
      });
    };

    this.stompClient.activate();
  }

  onMessageReceived(message: any): void {
    this.messages.push(message);
  }

  sendMessage(): void {
    if (this.messageContent && this.stompClient) {
      const message = {
        content: this.messageContent,
        sender: this.userName,
        outingId: this.outingId,
        type: 'CHAT'
      };
      this.stompClient.publish({
        destination: `/app/chat.sendMessage/${this.outingId}`,
        body: JSON.stringify(message),
      });
      this.messageContent = '';
    }
  }

  getMessages(outingId: string): void {
    this.outingService.getMessagesForOuting(this.outingId).subscribe({
      next: (data) => {
        console.log('Données reçues:', data);
        const messages = Array.isArray(data.body) ? data.body : [];
        this.messages = messages.filter((message: any) => message.type === 'CHAT');
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des messages :', err);
      }
    });
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
          this.getWeather(this.outing.location_coordinates.lat, this.outing.location_coordinates.lon);
        }
      },
      error: err => {
        console.error('Erreur lors de la récupération des détails de la sortie', err);
      }
    });
  }

  getWeather(latitude: number, longitude: number) {
    this.weatherService.getWeatherData(latitude, longitude).subscribe(
      data => {
        this.extractCurrentTemperature(data);
      }
    );
  }

  extractCurrentTemperature(weatherData: any): void {
    const temperatures = weatherData.hourly.temperature_2m;
    const times = weatherData.hourly.time;

    const now = new Date();
    let closestTimeIndex = 0;
    let smallestDifference = Infinity;

    for (let i = 0; i < times.length; i++) {
      const forecastTime = new Date(times[i]);
      const timeDifference = Math.abs(now.getTime() - forecastTime.getTime());

      if (timeDifference < smallestDifference) {
        smallestDifference = timeDifference;
        closestTimeIndex = i;
      }
    }

    this.currentTemperature = temperatures[closestTimeIndex];
    this.currentTime = times[closestTimeIndex];
    this.setWeatherIcon(this.currentTemperature);
  }

  setWeatherIcon(temperature: number): void {
    if (temperature >= 30) {
      this.weatherIcon = 'sun';
    } else if (temperature >= 20 && temperature < 30) {
      this.weatherIcon = 'cloud-sun';
    } else if (temperature >= 10 && temperature < 20) {
      this.weatherIcon = 'cloud';
    } else if (temperature < 10) {
      this.weatherIcon = 'cloud-rain';
    } else {
      this.weatherIcon = 'default';
    }
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

  generateInviteLink(): void {
    this.outingService.generateInviteLink(this.outingId).subscribe({
      next: (data) => {
        this.inviteLink = data.body.inviteLink;
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

  redirectBack() {
    this.router.navigate(['/event-detail', this.uid]);
  }

  toggleDescription(): void {
    this.showFullDescription = !this.showFullDescription;
  }
}
