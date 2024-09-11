import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { OpenAgendaService } from "../../Service/Fonction-service/open-agenda-service/open-agenda.service";
import { DatePipe, NgClass, NgIf, CommonModule } from "@angular/common"; // Import CommonModule
import { MatDialog } from '@angular/material/dialog';
import { OrganizeOutingFormComponent } from "../../Component/organize-outing-form/organize-outing-form.component";
import { OutlingService } from "../../Service/Fonction-service/outling-service/outling.service";
import { CardSortieComponent } from "../../Component/card-sortie/card-sortie.component";
import {AuthService} from "../../Service/Fonction-service/auth-service/auth.service"; // Import CardSortieComponent

@Component({
  selector: 'app-detail-event',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    NgClass,
    CommonModule,
    CardSortieComponent
  ],
  templateUrl: './detail-event.component.html',
  styleUrl: './detail-event.component.css'
})
export class DetailEventComponent implements OnInit {

  public eventId: string | undefined;
  public result: any = {};
  public outings: any[] = [];
  public actualUser:any;
  public errorMsg:any = "";
  public isVisible = false;

  constructor(
    private route: ActivatedRoute,
    private openAgendaService: OpenAgendaService,
    private dialog: MatDialog,
    private outling: OutlingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.initUser()

    this.route.params.subscribe(params => {
      this.eventId = params['id'];
      if (this.eventId) {
        this.getEventWithUid();
        this.getEventFromEvent();
      }
    });
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

  getEventFromEvent() {
    this.outling.getOutlingById(this.eventId).subscribe(
      data => {
        this.outings = data.body || [];
        console.log(this.outings)
      },
      error => {
        console.error("Erreur lors de la récupération des sorties : ", error);
      }
    );
  }

  getEventWithUid() {
    this.openAgendaService.getComponentById(this.eventId).subscribe(
      data => {
        this.result = data.body.results[0] || {};
      }
    );
  }

  isDescriptionShort(description: string | null | undefined): boolean {
    return (description || '').length < 150;
  }

  openOrganizeOutingForm() {

    if(this.actualUser){
      this.errorMsg = "";
      const dialogRef = this.dialog.open(OrganizeOutingFormComponent, {
        width: '500px',
        data: { eventId: this.eventId, eventName: this.result?.slug },
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'submitted') {
          this.ngOnInit();

        }
      });
    }else {
      this.errorMsg = "Veuillez vous inscrire ou vous connecter pour créer une sortie"
      this.openPopup();
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
