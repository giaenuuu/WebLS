import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Observable } from 'rxjs';
import { FilesystemObjectInput, Sorting } from './models/filesystem-object-input.interface';

@Injectable({
  providedIn: 'root'
})
export class FileExplorerService {

  constructor(private apiService: ApiService) {

  }

  getBasePath(): Observable<any>{
    return this.apiService.get<any>('filesystem')
  }

  getPathContent(path: string): Observable<any> {
    return this.apiService.post<any, FilesystemObjectInput>('filesystem', {
      path: path,
      showHidden: false,
      reverse: false,
      sortBy: Sorting.NAME,
    })
  }

}
