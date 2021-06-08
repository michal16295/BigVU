import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageModel } from '../models/Image';


@Injectable({
  providedIn: 'root'
})
export class LoadService {

  constructor(private http: HttpClient) { }

  loadImages(): Observable<Array<ImageModel>> {
    return this.http.get<Array<ImageModel>>("./assets/presenters.json")
    //return this.http.get<Array<ImageModel>>("https://bigvu-interviews-assets.s3.amazonaws.com/presenters.json")
  }
}
