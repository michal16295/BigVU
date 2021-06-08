import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-canvas-view',
  templateUrl: './canvas-view.component.html',
  styleUrls: ['./canvas-view.component.scss']
})
export class CanvasViewComponent implements OnInit {
  @ViewChild("canvas", { static: false }) canvas: ElementRef;

  width = 640;
  height = 360;
  fontSize = 30;
  fontName = "Inter"
  textSeparator = " ";

  loading = false;
  error = false;
  borderWidth = 10;

  get x0(): number { return this.borderWidth; }
  get x1(): number { return this.width - this.borderWidth * 2; }
  get y0(): number { return this.borderWidth; }
  get y1(): number { return this.height - this.borderWidth * 2; }

  private image = new Image();

  ngOnInit(): void {
    this.image = new Image();
    this.image.onload = () => {
      this.loading = false;
      this.error = false;
      this.draw();
    }
    this.image.onerror = () => {
      this.loading = false;
      this.error = true;
      console.log("Failed to load image");
    }
  }

  @Input() set bonus(value: boolean) {
    this._bonus = value;
    this.draw();
  }

  private _bonus = false;

  @Input() set selectedImage(value: string) {
    if ((value || "") === "") {
      this._selectedImage = "";
      this.loading = false;
      return;
    }
    this.loading = true;
    this.image.src = value;
  }

  get selectedImage(): string {
    return this._selectedImage;
  }

  private _selectedImage: string;

  @Input() set text(value: string) {
    this._text = (value || "").trim();
    this.draw();
  }

  private _text = "";

  @Input() set background(value: string) {
    this._background = value;
    this.draw();
  }

  get background(): string {
    return this._background;
  }

  private _background = "";

  private get isCanvasLoaded(): boolean {
    return this.canvas && this.canvas.nativeElement
  }

  private draw(): void {
    if (!this.isCanvasLoaded) return;
    this.clear();
    this.drawImage();
    this.drawText();
  }

  private get context(): any {
    return this.canvas.nativeElement.getContext('2d');
  }

  private drawImage(): void {
    if (this.error) return;
    this.context.drawImage(this.image, this._bonus ? -this.width / 3 : this.x0, this.y0, this.x1, this.y1);
  }

  private drawLines(lines: Array<string>, x: number): void {
    let y = (this.fontSize - (lines.length * this.fontSize - this.height)) / 2;
    lines.forEach((line) => {
      this.context.fillText(line, x, y);
      y += this.fontSize;
    });
  }

  private wrapText(x: number, y: number, maxWidth: number) {
    const words = (this._text || "").split(this.textSeparator);
    let line = "";
    const lines = [];
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + this.textSeparator;
      const metrics = this.context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + this.textSeparator;
        y += this.fontSize;
      }
      else {
        line = testLine;
      }
    }
    lines.push(line);
    this.drawLines(lines, x);
  }

  private drawText(): void {
    this.context.font = `${this.fontSize}px ${this.fontName}`;
    this.context.textAlign = "center";
    if (this._bonus) {
      this.context.fillStyle = "black";
      this.wrapText(this.width - this.width / 3 + (this.width / 3) / 2, this.height / 2, this.width / 3);
      this.context.fillStyle = this.background;
      this.context.fillRect(0, 0, this.borderWidth, this.height);
      return;
    }
    this.context.fillStyle = "white";
    this.context.fillText(this._text, this.width / 2 + 1, this.height / 2 + 1);
    this.context.fillStyle = "black";
    this.context.fillText(this._text, this.width / 2, this.height / 2);
  }

  private clear(): void {
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.rect(0, 0, this.width, this.height);
    this.context.fillStyle = this.background;
    this.context.fill();
  }
}
