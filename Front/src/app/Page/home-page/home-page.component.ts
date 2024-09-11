import { Component, OnInit } from '@angular/core';
import { CardEventComponent } from "../../Component/card-event/card-event.component";
import { FilterMenuComponent } from "../../Component/filter-menu/filter-menu.component";
import { OpenAgendaService } from "../../Service/Fonction-service/open-agenda-service/open-agenda.service";
import {AuthService} from "../../Service/Fonction-service/auth-service/auth.service";
import {UserDataService} from "../../Service/Data-service/user-data.service";
import {CardEventSkeletonComponent} from "../../Component/Skeleton/card-event-skeleton/card-event-skeleton.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CardEventComponent,
    FilterMenuComponent,
    CardEventSkeletonComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  public results: any[] = [];
  public keywordArray:any;
  public cityArray:any;
  public errorMsg:any;
  public showError = false;
  private userLocation: any;
  public offset: number = 0;
  public loading = true;
  public skeletonIterations : any = Array(20);

  constructor(private openAgendaService: OpenAgendaService, private authService: AuthService, private dataService : UserDataService ) {}

  ngOnInit() {
    // Charger les événements par défaut

    this.getCurrentLocation();
  }

  // Méthode pour récupérer les événements
  getEvent(location?: string, title?: string, startDate?: string, endDate?: string, keywords?: any) {
    this.loading = true;
    console.log("toto")
    this.results = [];
    this.openAgendaService.getApi(location, title, keywords, startDate, endDate, this.userLocation, this.offset).subscribe(
      data => {
        this.loading = false;
        if(data.body.results.length<1){
          this.errorMsg = "Aucun événement en lien avec votre recherche."
          this.showError = true;
          setTimeout(() => this.showError = false, 200);
        }else{
          this.errorMsg ="";
          this.showError = false;
          this.results = data.body.results;
        }
        console.log(this.results)
      }
    );
  }

  //KEYWORD REQUEST + FILTRE SUR KEYWORD POUR RÉCUPÉRER SELON L'INPUT ET SANS DOUBLONS
  searchByKeyword(event: { keyword: string }) {

    const inputSplit = event.keyword.split(',');
    const query = inputSplit[inputSplit.length-1].trim()

    this.openAgendaService.getKeywordList(event.keyword).subscribe(
      data => {
        console.log(data)
        const keyword = query.toLowerCase();
        const filteredKeywords = new Set();

        // Parcourir les résultats pour filtrer les mots-clés qui commencent par l'entrée utilisateur
        data.body.results.forEach((record: { keywords_fr: any[]; }) => {
          if (record.keywords_fr) {
            record.keywords_fr.forEach(kw => {
              // Filtrer les mots-clés qui commencent par l'entrée utilisateur
              if (kw.toLowerCase().startsWith(keyword)) {
                filteredKeywords.add(kw);
              }
            });
          }
        });


       this.keywordArray = Array.from(filteredKeywords);
      },
      error => {
        console.log(error);
      }
    );
  }

  //CITY REQUEST + FILTRE SUR CITY POUR RÉCUPÉRER SELON L'INPUT ET SANS DOUBLONS
  searchByCity(event: { location: string }) {

    const inputSplit = event.location.split(',');
    const query = inputSplit[inputSplit.length - 1].trim();

    this.openAgendaService.getCityList(event.location).subscribe(
      data => {

        const location = query.toLowerCase();
        const filteredLocation = new Set<string>();

        data.body.results.forEach((record: { location_city: string }) => {
          if (record.location_city && record.location_city.toLowerCase().startsWith(location)) {
            filteredLocation.add(record.location_city);
          }
        });

        this.cityArray = Array.from(filteredLocation);
      },
      error => {
        console.log(error);
      }
    );
  }



  // Gestion du changement de filtre
  onFilterChange(event: { location: string, title: string, startDate: string, endDate: string, keyword: string }) {
    console.log("Received location:", event.location);
    console.log("Received category:", event.title);
    console.log("Received start date:", event.startDate);
    console.log("Received end date:", event.endDate);

    // Appeler getEvent avec les catégories et les dates
    this.getEvent(event.location, event.title, event.startDate, event.endDate, event.keyword);
  }


  //GESTION DE LA LOCALISATION ACTUELLE
  getCurrentLocation() {
    this.dataService.getUserLocation()
      .then(position => {
        this.userLocation = position;
        this.getEvent();
      })
      .catch(error => {
        console.error(error.message);
        if(error.message === "User denied Geolocation" || error.message === "User denied geolocation prompt"){
          this.userLocation = null;
          this.getEvent();
        }
      });
  }


  //GESTION PAGINATION
  nextPage() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.offset += 30;
    this.getEvent();
  }

  previousPage() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (this.offset > 0) {
      this.offset -= 30;
    }
    this.getEvent();
  }

}
