import {Component, OnInit, Input} from '@angular/core';
import {OpenAgendaService} from "../../Service/Fonction-service/open-agenda-service/open-agenda.service";
import {NgForOf, NgIf} from "@angular/common";
import {MatChip, MatChipRow} from "@angular/material/chips";
import {Router} from "@angular/router";

@Component({
  selector: 'app-card-event',
  standalone: true,
  imports: [
    NgForOf,
    MatChip,
    MatChipRow,
    NgIf
  ],
  templateUrl: './card-event.component.html',
  styleUrl: './card-event.component.css'
})
export class CardEventComponent{
  constructor(private openAgendaService: OpenAgendaService, private router: Router) {}

  @Input() result: any;

  redirectEventDetail(id: string) {
    this.router.navigate([`/event-detail`, id]);
  }
}
