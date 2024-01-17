import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, skip, take, takeUntil } from 'rxjs';
import { FileExplorerService } from './file-explorer.service';
import { FilesystemObject } from './models/filesystem-object-view.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sorting } from './models/filesystem-object-input.interface';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss'],
})
export class FileExplorerComponent implements OnInit, OnDestroy {
  protected currentLocation = new BehaviorSubject<string>('');
  protected currentLocationData?: FilesystemObject[];
  protected isOnBasePath = true;

  protected filterForm?: FormGroup;

  private destroy$ = new Subject<void>();
  private basePath = '';

  private showHidden: boolean = false;
  private reverse: boolean = false;
  private sortBy: Sorting = Sorting.NAME;

  constructor(
    private fileExplorerService: FileExplorerService,
    private formBuilder: FormBuilder
  ) {}

  public get Sorting() {
    return Sorting;
  }

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      sortBy: [Sorting.NAME, [Validators.required]],
      showHidden: [false, [Validators.required]],
      reverse: [false, [Validators.required]],
    });

    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((form) => {
        this.showHidden = form.showHidden;
        this.reverse = form.reverse;
        this.sortBy = form.sortBy;

        this.fileExplorerService
          .getPathContent(
            this.currentLocation.value,
            this.showHidden,
            this.reverse,
            this.sortBy
          )
          .pipe(takeUntil(this.destroy$), take(1))
          .subscribe((data) => {
            this.currentLocationData = data.objects;
          });
      });

    this.fileExplorerService
      .getBasePath()
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe((basePath) => {
        this.basePath = basePath.basePath;
        this.currentLocation.next(basePath.basePath);
      });

    this.currentLocation
      .pipe(takeUntil(this.destroy$), skip(1))
      .subscribe((currentLocation) => {
        this.fileExplorerService
          .getPathContent(
            currentLocation,
            this.showHidden,
            this.reverse,
            this.sortBy
          )
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
    if (object.type === 1) {
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

    if (normalizedPath === normalizedBasePath) {
      return;
    }

    const lastPathElementIndex = normalizedPath.lastIndexOf('/');
    const parentPath = normalizedPath.substring(0, lastPathElementIndex);

    if (parentPath === normalizedBasePath) {
      this.isOnBasePath = true;
    }

    this.currentLocation.next(`${parentPath}`);
  }
}
