import { Injectable } from '@angular/core';
import { ApiOpenAgendaService } from "../../API-service/API-open-agenda-service/api-open-agenda.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OpenAgendaService {

  constructor(private openAgendaApiService: ApiOpenAgendaService) { }

  getApi(city?: string, title?: string, keywords?: any,  startDate?: string, endDate?: string, userPos?: any, offset?:any): Observable<any> {

    let queryParams: string[] = [];

    // Gestion de la recherche ville
    if (city) {
      let split = city.split(', ');
      split.forEach((item: string) => {
        if(item !==""){
          queryParams.push(`refine=location_city%3A%22${encodeURIComponent(item)}%22`);
        }
      })

      //GESTION DE LA RECHERCHE LOCALISATION PAR DÉFAUT
    }else if(userPos){
      const userLatitude = userPos.coords.latitude;
      const userLongitude = userPos.coords.longitude;

      const userLocationWKT = `POINT(${userLongitude} ${userLatitude})`;

      const distance = '20km'; //RAYON
      queryParams.push(`where=within_distance(location_coordinates%2C%20geom%27${encodeURIComponent(userLocationWKT)}%27%2C%20${distance})`);
    }

    // Gestion des recherches par nom
    if (title && title.length > 0) {
      queryParams.push(`where=startswith(title_fr,%27${encodeURIComponent(title)}%27)`);
    }

    // Gestion des recherches par mots clés
    if (keywords) {
      let split = keywords.split(', ');

      split.forEach((item: string) => {
        if(item !==""){
          queryParams.push(`refine=keywords_fr%3A%22${encodeURIComponent(item)}%22`);
        }
      })
    }

    // Gestion des dates
    if (startDate && endDate) {
      // Si les deux dates sont présentes, utilisez BETWEEN
      queryParams.push(`where=firstdate_begin%3E%3D%22${encodeURIComponent(startDate)}%22%20AND%20firstdate_begin%3C%3D%22${encodeURIComponent(endDate)}%22`);
    } else if (startDate && !endDate) {
      // Si seulement startDate est présente, récupérez les événements à partir de startDate
      queryParams.push(`where=firstdate_begin%3E%3D%22${encodeURIComponent(startDate)}%22`);
    }

    const queryUrl = `explore/v2.1/catalog/datasets/evenements-publics-openagenda/records?limit=30&offset=${offset}&${queryParams.join('&')}`;

    return this.openAgendaApiService.get(queryUrl);
  }


  getComponentById(id: string | null | undefined | number): Observable<any> {
    return this.openAgendaApiService.get(`explore/v2.1/catalog/datasets/evenements-publics-openagenda/records?where=uid%3D${id}&limit=20 `);
  }

  //POUR AFFICHER LA LISTE DES MOTS CLÉS
  getKeywordList(input:any){
    const inputSplit = input.split(',');
    const query = inputSplit[inputSplit.length-1].trim()
    return this.openAgendaApiService.get('explore/v2.1/catalog/datasets/evenements-publics-openagenda/records?where=startswith(keywords_fr,%27' + encodeURIComponent(query) + '%27)&select=keywords_fr&limit=60');
  }

  getCityList(input:any){
    const inputSplit = input.split(',');
    const query = inputSplit[inputSplit.length-1].trim()
    return this.openAgendaApiService.get('explore/v2.1/catalog/datasets/evenements-publics-openagenda/records?where=startswith(location_city,%27' + encodeURIComponent(query) + '%27)&select=location_city&limit=80');
  }


}
