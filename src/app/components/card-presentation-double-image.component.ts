import {Component, input} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-card-presentation-double-image',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <div
      class="bg-[#232323] p-6 md:p-8 rounded-2xl border border-white/5 shadow-2xl
             flex flex-col md:flex-row items-center gap-6 md:gap-8 max-w-2xl w-full">

      <div class="relative flex items-center justify-center shrink-0">
        <div class="relative w-32 h-32 flex items-center justify-center">
          <img
            [ngSrc]="image1Url()"
            [alt]="image1Alt()"
            [width]="image1Width()"
            [height]="image1Height()"
            class="object-contain filter drop-shadow-[8px_10px_16px_rgba(0,0,0,0.8)]"/>
        </div>
      </div>

      <div class="w-24 h-px md:w-px md:h-32 bg-gray-600/40"></div>

      <div class="flex-1 flex items-center justify-center w-full">
        <div class="rounded-xl overflow-hidden shadow-[10px_12px_25px_rgba(0,0,0,0.7)] border border-white/5">
          <img
            [ngSrc]="image2Url()"
            [alt]="image2Alt()"
            [width]="image2Width()"
            [height]="image2Height()"
            class="rounded-xl object-cover w-full h-auto max-w-62.5"/>
        </div>
      </div>

    </div>
  `,
})
export class CardComponent {
  public image1Url = input.required<string>();
  public image2Url = input.required<string>();
  public image1Alt = input.required<string>();
  public image2Alt = input.required<string>();
  public image1Width = input.required<number>();
  public image1Height = input.required<number>();
  public image2Width = input.required<number>();
  public image2Height = input.required<number>();
}
