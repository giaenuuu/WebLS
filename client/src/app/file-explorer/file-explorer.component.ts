import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, take, takeUntil } from 'rxjs';
import { FileExplorerService } from './file-explorer.service';
import { FilesystemObject } from './models/filesystem-object-view.interface';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss'],
})
export class FileExplorerComponent implements OnInit, OnDestroy {
  protected currentLocation = new BehaviorSubject<string>('');
  protected currentLocationData?: FilesystemObject[];
  protected isOnBasePath = true;

  private destroy$ = new Subject<void>();
  private basePath = '';

  constructor(private fileExplorerService: FileExplorerService) {}

  ngOnInit(): void {
    this.fileExplorerService
      .getBasePath()
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe((basePath) => {
        this.basePath = basePath.basePath;
        this.currentLocation.next(basePath.basePath);
      });

    this.currentLocation
      .pipe(takeUntil(this.destroy$))
      .subscribe((currentLocation) => {
        this.fileExplorerService
          .getPathContent(currentLocation)
          .pipe(takeUntil(this.destroy$), take(1))
          .subscribe((data) => {
            this.currentLocationData = data.objects;
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  nagivateInto(object: FilesystemObject): void {
    if(object.type === 1){
      this.isOnBasePath = false;
      const currentPath = this.currentLocation.value;
      this.currentLocation.next(`${currentPath}/${object.name}`);
    }
  }

  navigateBack() {
    const currentPath = this.currentLocation.value;
    const normalizedPath = currentPath.endsWith('/')
      ? currentPath.slice(0, -1)
      : currentPath;

      const normalizedBasePath = this.basePath.endsWith('/')
      ? this.basePath.slice(0, -1)
      : this.basePath;


    if(normalizedPath === normalizedBasePath){
      return;
    }

    const lastPathElementIndex = normalizedPath.lastIndexOf('/');
    const parentPath = normalizedPath.substring(0, lastPathElementIndex);

    if(parentPath === normalizedBasePath){
      this.isOnBasePath = true;
    }

    this.currentLocation.next(`${parentPath}`);
  }
}
