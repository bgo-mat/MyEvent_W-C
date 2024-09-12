// ws-chat.service.ts
import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WsChatService {
  private stompClient: Client;
  private topic: string = '';

  constructor() {
    this.stompClient = new Client({
      brokerURL: 'ws://http://51.75.162.147:4200:8080/ws',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.webSocketFactory = () => {
      return new SockJS('http://http://51.75.162.147:4200:8080/ws');
    };
  }

  // Connexion au serveur WebSocket
  connect(outingId: string, onMessageReceived: (message: Message) => void) {
    this.topic = `/topic/${outingId}`;

    this.stompClient.onConnect = () => {
      // S'abonner au topic de la sortie (outing)
      this.stompClient.subscribe(this.topic, onMessageReceived);
    };

    this.stompClient.activate();
  }

  // Envoi d'un message
  sendMessage(outingId: string, message: any) {
    this.stompClient.publish({
      destination: `/app/chat.sendMessage/${outingId}`, // Route côté serveur
      body: JSON.stringify(message)
    });
  }

  // Déconnexion
  disconnect() {
    if (this.stompClient.connected) {
      this.stompClient.deactivate();
    }
  }
}
