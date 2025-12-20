import {Component, input} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'trapotopia-card-presentation-double-image',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <!--    classic-->
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

      <div
        class="w-24 h-px md:w-px md:h-32 bg-linear-to-r md:bg-linear-to-b from-transparent via-white/20 to-transparent shrink-0"></div>

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

    <div class="my-10"></div>

    <!--3d-->
    <div
      class="
    relative
    bg-[#232323]
    p-6 md:p-8
    rounded-2xl
    border border-white/5
    max-w-2xl w-full

    shadow-[0_28px_75px_-30px_rgba(0,0,0,0.95)]
  "
    >

      <!-- Lumière directionnelle (haut-gauche) -->
      <div
        class="
      pointer-events-none absolute inset-0 rounded-2xl
      bg-[radial-gradient(75%_60%_at_18%_12%,rgba(255,255,255,0.12),transparent_60%)]
      opacity-80
    "
      ></div>

      <!-- Relief interne -->
      <div
        class="
      pointer-events-none absolute inset-0 rounded-2xl
      shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-22px_45px_rgba(0,0,0,0.7)]
    "
      ></div>

      <!-- Contour subtil -->
      <div
        class="
      pointer-events-none absolute -inset-px rounded-2xl
      bg-[linear-gradient(135deg,rgba(255,255,255,0.14),transparent_40%,rgba(255,255,255,0.08))]
      opacity-70
    "
      ></div>

      <!-- Contenu -->
      <div
        class="
      relative z-10
      flex flex-col md:flex-row
      items-center gap-6 md:gap-8
      [transform:translateZ(24px)]
    "
      >

        <!-- Image 1 -->
        <div class="relative flex items-center justify-center shrink-0">
          <div class="relative w-32 h-32 flex items-center justify-center">
            <img
              [ngSrc]="image1Url()"
              [alt]="image1Alt()"
              [width]="image1Width()"
              [height]="image1Height()"
              class="
            object-contain
            drop-shadow-[10px_14px_20px_rgba(0,0,0,0.85)]
          "
            />
          </div>
        </div>

        <!-- Séparateur -->
        <div
          class="
        w-24 h-px md:w-px md:h-32
        bg-linear-to-r md:bg-linear-to-b
        from-transparent via-white/25 to-transparent
        shrink-0
      "
        ></div>

        <!-- Image 2 -->
        <div class="flex-1 flex items-center justify-center w-full">
          <div
            class="
          rounded-xl overflow-hidden
          border border-white/5
          shadow-[14px_18px_35px_rgba(0,0,0,0.85)]
          [transform:translateZ(16px)]
        "
          >
            <img
              [ngSrc]="image2Url()"
              [alt]="image2Alt()"
              [width]="image2Width()"
              [height]="image2Height()"
              class="rounded-xl object-cover w-full h-auto max-w-62.5"
            />
          </div>
        </div>

      </div>

      <!-- Ombre portée fixe (flottement) -->
      <div
        class="
      pointer-events-none absolute left-10 right-10 -bottom-6 h-12
      rounded-full blur-2xl
      bg-black/75
      opacity-45
    "
      ></div>

    </div>

    <div class="my-10"></div>

    <!--    TEST-->
    <div
      class="relative overflow-hidden bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl
         flex flex-col md:flex-row items-center gap-6 md:gap-8 max-w-2xl w-full">

      <div class="absolute inset-0 z-0 pointer-events-none">
        <div class="absolute -top-10 -left-10 w-40 h-40 bg-purple-600/40 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-10 -right-10 w-44 h-44 bg-blue-500/30 rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      <div class="relative z-10 flex items-center justify-center shrink-0">
        <div class="relative w-32 h-32 flex items-center justify-center">
          <img
            [ngSrc]="image1Url()"
            [alt]="image1Alt()"
            [width]="image1Width()"
            [height]="image1Height()"
            class="object-contain filter drop-shadow-[8px_10px_16px_rgba(0,0,0,0.8)]"/>
        </div>
      </div>

      <div
        class="relative z-10 w-24 h-px md:w-px md:h-32 bg-linear-to-r md:bg-linear-to-b from-transparent via-white/20 to-transparent shrink-0">
      </div>

      <div class="relative z-10 flex-1 flex items-center justify-center w-full">
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
  public readonly image1Url = input.required<string>();
  public readonly image2Url = input.required<string>();
  public readonly image1Alt = input.required<string>();
  public readonly image2Alt = input.required<string>();
  public readonly image1Width = input.required<number>();
  public readonly image1Height = input.required<number>();
  public readonly image2Width = input.required<number>();
  public readonly image2Height = input.required<number>();
}
