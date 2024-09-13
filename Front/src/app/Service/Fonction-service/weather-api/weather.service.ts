import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { Observable } from 'rxjs'; // Import Observable

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private apiUrl = 'https://api.open-meteo.com/v1/forecast?';

  constructor(private http: HttpClient) { } // Inject HttpClient

  getWeatherData(latitude: number, longitude: number): Observable<any> {
    const params = `latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`;
    const url = `${this.apiUrl}${params}`;
    return this.http.get(url);
  }
}
