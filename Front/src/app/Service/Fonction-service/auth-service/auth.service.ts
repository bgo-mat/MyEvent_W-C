import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ApiService} from "../../API-service/API-backend-service/api-backend.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private apiService : ApiService) {}

  submitGoogle(): Observable<any> {
    return this.apiService.post('auth/userinfo');
  }

  submitDiscord(): Observable<any> {
    return this.http.post('http://localhost:8080/auth/discord', {}, { withCredentials: true });
  }

  getCurrentUser(): Observable<any> {
    return this.http.get('http://localhost:8080/auth/current-user', { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.get('http://localhost:8080/auth/logout', { withCredentials: true });
  }
  updateBio(data: any): Observable<any> {
    return this.apiService.put('auth/update-bio', data);
  }

  uploadAvatarBase64(base64Image: string): Observable<any> {
    return this.apiService.post('auth/upload-avatar', { avatar: base64Image });
  }


}
