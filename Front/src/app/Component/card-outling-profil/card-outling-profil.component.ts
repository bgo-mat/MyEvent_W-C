import {Component, Input, OnInit} from '@angular/core';
import {OutlingService} from "../../Service/Fonction-service/outling-service/outling.service";
import {OpenAgendaService} from "../../Service/Fonction-service/open-agenda-service/open-agenda.service";
import {data} from "autoprefixer";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {DatePipe} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-card-outling-profil',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './card-outling-profil.component.html',
  styleUrl: './card-outling-profil.component.css'
})
export class CardOutlingProfilComponent implements OnInit{

  constructor(private openAgendaService: OpenAgendaService, private router: Router) {
  }

  @Input() outlingInfo: any;
  public eventImage:any;

  ngOnInit(): void {
    this.initOutling();
  }

  initOutling(){

    this.openAgendaService.getComponentById(this.outlingInfo.eventExternalId).subscribe(
      data=>{
        this.eventImage = data.body.results[0].image;
      },
      error=>{
        console.log(error)
      }
    )
  }

  redirectOutling(){
    this.router.navigate([`/outing`, this.outlingInfo.id , this.outlingInfo.eventExternalId]);
  }
}
