import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OutlingService } from '../../Service/Fonction-service/outling-service/outling.service';
import { AuthService } from '../../Service/Fonction-service/auth-service/auth.service';
import { NgClass } from '@angular/common';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';


@Component({
  selector: 'app-card-sortie',
  templateUrl: './card-sortie.component.html',
  styleUrl: './card-sortie.component.css',
  imports: [NgClass],
  standalone: true
})
export class CardSortieComponent implements OnInit {
  @Input() sortie: any;
  public userConnectName: string | undefined;
  public isOrganizer: boolean = false;
  public isParticipant: boolean = false;
  public errorMsg: any = '';
  public isVisible = false;
  public actualUser: any;
  public participantsArray: any[] = [];
  public stompClient: any;
  public messageContent: string = '';

  constructor(private router: Router, private outlingService: OutlingService, private authService: AuthService) {}

  ngOnInit() {
    this.getCurrentUser();
    this.getAllParticipants();
  }

  getCurrentUser() {
    this.authService.getCurrentUser().subscribe(
      data => {
        this.userConnectName = data.username;
        this.actualUser = data;
        if (this.userConnectName === this.sortie.organizer.name) {
          this.isOrganizer = true;
        }
      },
      error => {
        console.error('Erreur lors de la récupération de l\'utilisateur connecté', error);
      }
    );
  }

  getAllParticipants() {
    this.outlingService.getParticipantsByOutingId(this.sortie.id).subscribe({
      next: (data) => {
        this.participantsArray.push(data.body);
        this.checkIfUserIsParticipant();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des participants :', err);
      }
    });
  }

  checkIfUserIsParticipant() {
    let allParticipants = [].concat(...this.participantsArray);
    // @ts-ignore
    this.isParticipant = allParticipants.some(participant => participant.name === this.userConnectName);
  }

  connectToSocket(outingId: string): void {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, (frame: any) => {
      this.stompClient.subscribe(`/topic/${outingId}`, (message: any) => {
        this.onMessageReceived(JSON.parse(message.body));
      });

      this.stompClient.send(`/app/chat.addUser/${outingId}`, {}, JSON.stringify({
        sender: this.userConnectName,
        type: 'JOIN'
      }));
    });
  }

  onMessageReceived(message: any) {
    console.log('Message reçu : ', message);
  }

  sendMessageToChannel(outingId: string, content: string) {
    const message = {
      content: content,
      sender: this.userConnectName,
      outingId: outingId
    };
    this.stompClient.send(`/app/chat.sendMessage/${outingId}`, {}, JSON.stringify(message));
  }

  goToOutingDetail(outingId: string) {
    if (!this.actualUser) {
      this.errorMsg = "Veuillez vous inscrire ou vous connecter pour rejoindre une sortie";
      this.openPopup();
    } else {
      this.outlingService.joinOuting(outingId).subscribe({
        next: (response) => {
          this.connectToSocket(outingId);
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

  redirectLog() {
    this.router.navigate(['/login']);
  }
}
