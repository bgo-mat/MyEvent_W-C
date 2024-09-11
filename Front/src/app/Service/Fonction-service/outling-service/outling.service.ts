import { Injectable } from '@angular/core';
import { ApiService} from "../../API-service/API-backend-service/api-backend.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OutlingService {

  constructor(private apiService: ApiService) { }

  createOutling(data: any): Observable<any> {
    return this.apiService.post('outing/create', data);
  }

  getOutlingById(eventId: any): Observable<any> {
    return this.apiService.get(`outing/event/${eventId}`);
  }

  getParticipantsByOutingId(id: string | null): Observable<any> {
    return this.apiService.get(`outing/${id}/participants`);
  }
  joinOuting(id: string): Observable<any> {
    return this.apiService.post(`outing/${id}/join`, {});
  }
  getOutlingByUserId(): Observable<any> {
    return this.apiService.get(`outing/user-joined`);
  }
}
