import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CovidService {

  private link ="https://covid19-brazil-api.now.sh/api/report/v1";

  constructor(
    public http:HttpClient
  ){    
  }

  public getCorona(){
    return this.http.get(this.link);
  }
}

