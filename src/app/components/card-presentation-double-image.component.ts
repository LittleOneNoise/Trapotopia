import { Component, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'trapotopia-card-presentation-double-image',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <div
      class="relative bg-surface-700 p-6 md:p-8 rounded-lg border border-border-surface-700 max-w-2xl w-full shadow-[0_28px_75px_-30px_rgba(0,0,0,0.95)]">

      <!-- Contenu -->
      <div class="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 transform-[translateZ(24px)]">

        <!-- Image 1 -->
        <div class="relative flex items-center justify-center shrink-0">
          <div class="relative w-32 h-32 flex items-center justify-center">
            <img
              [ngSrc]="image1Url()"
              [alt]="image1Alt()"
              [width]="image1Width()"
              [height]="image1Height()"
              class="object-contain drop-shadow-[10px_14px_20px_rgba(0,0,0,0.85)] opacity-90"/>
          </div>
        </div>

        <!-- Séparateur -->
        <div
          class="w-24 h-px md:w-px md:h-32 bg-linear-to-r md:bg-linear-to-b from-transparent via-white/25 to-transparent shrink-0"></div>

        <!-- Image 2 -->
        <div class="flex-1 flex items-center justify-center w-full">
          <div
            class="rounded-xl overflow-hidden border border-white/5 shadow-[14px_18px_35px_rgba(0,0,0,0.85)] transform-[translateZ(16px)]">
            <img
              [ngSrc]="image2Url()"
              [alt]="image2Alt()"
              [width]="image2Width()"
              [height]="image2Height()"
              class="rounded-xl object-cover w-full h-auto max-w-62.5 opacity-90"
            />
          </div>
        </div>

      </div>

      <!-- Ombre portée fixe (flottement) -->
      <div
        class="pointer-events-none absolute left-10 right-10 -bottom-6 h-12 rounded-full blur-2xl bg-black/75 opacity-45"></div>

    </div>
  `,
})
export class CardComponent {
  public readonly image1Url = input.required<string>();
  public readonly image2Url = input.required<string>();
  public readonly image1Alt = input.required<string>();
  public readonly image2Alt = input.required<string>();
  public readonly image1Width = input.required<number>();
  public readonly image1Height = input.required<number>();
  public readonly image2Width = input.required<number>();
  public readonly image2Height = input.required<number>();
}
