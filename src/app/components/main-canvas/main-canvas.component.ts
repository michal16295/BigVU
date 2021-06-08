import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { ImageModel } from 'src/app/models/Image';
import { LoadService } from 'src/app/services/load.service';
import { debounceTime } from 'rxjs/operators';

const DEFAULT_COLOR = "white";
const COLORS = ["white", "blue", "red", "green", "orange", "gold", "yellow"];

@Component({
  selector: 'app-main-canvas',
  templateUrl: './main-canvas.component.html',
  styleUrls: ['./main-canvas.component.scss']
})
export class MainCanvasComponent implements OnInit, OnDestroy {
  @ViewChild("inputText", { static: true }) inputText: ElementRef;

  private _subscriptions: Array<Subscription> = [];
  get colors(): Array<string> {
    return COLORS
  }

  color: string;
  images: Observable<Array<ImageModel>>;
  selectedImage: string;
  textValue = "";
  text = "";
  bonus = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadService: LoadService
  ) { }

  ngOnInit(): void {
    this.images = this.loadService.loadImages();
    this._subscriptions.push(fromEvent(this.inputText.nativeElement, "keyup")
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.text = this.textValue;
      }));
    this._subscriptions.push(
      this.activatedRoute.params.subscribe(param => {
        this.color = this.colors.find(c => c === (param.color || DEFAULT_COLOR)) || DEFAULT_COLOR;
      })
    )
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(s => s.unsubscribe());
  }
}


