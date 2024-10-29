import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {
  boardSize: number = 10;
  mineCount: number = 10;

  loadBoard$: BehaviorSubject<any> = new BehaviorSubject(true);
}
