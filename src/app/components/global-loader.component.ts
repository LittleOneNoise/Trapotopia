import {Component, effect, ElementRef, inject, input, OnDestroy, signal, viewChild} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

// Import du moteur officiel DotLottie
import {DotLottie} from '@lottiefiles/dotlottie-web';

@Component({
  selector: 'trapotopia-global-loader',
  standalone: true,
  template: `
    <div
      class="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm dark:bg-zinc-950/90 gap-4 ease-in-out"
      [class.opacity-0]="!isLoading()"
      [class.pointer-events-none]="!isLoading()"
      [class.transition-opacity]="!isLoading()"
      [class.duration-500]="!isLoading()"
    >

      <canvas
        #canvasRef
        class="animate-float"
        [style.width]="width()"
        [style.height]="height()">
      </canvas>

      <p class="text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse -mt-10">
        Chargement de la page...
      </p>

    </div>
  `
})
export class GlobalLoaderComponent implements OnDestroy {
  public readonly animationPath = input.required<string>();
  public readonly width = input.required<string>();
  public readonly height = input.required<string>();
  public canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvasRef');
  public isLoading = signal(true); // true au démarrage pour le SSR/Initial load
  private router = inject(Router);
  // Instance du player DotLottie
  private dotLottie: DotLottie | null = null;
  // Variables pour la logique anti-flickering
  private loadingStartTime = 0;
  private readonly MIN_DISPLAY_TIME = 100;

  constructor() {
    effect(() => {
      const shouldBeLoading = this.isLoading();
      const canvasEl = this.canvasRef()?.nativeElement;

      if (shouldBeLoading && canvasEl && !this.dotLottie) {
        // Si on doit charger, que le canvas est prêt et que le player n'existe pas -> INIT
        this.initPlayer(canvasEl);
      } else if (!shouldBeLoading && this.dotLottie) {
        // Si on NE doit PLUS charger, et que le player existe encore -> DESTROY
        this.destroyPlayer();
      }
    });

    this.router.events
      .pipe(takeUntilDestroyed())
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.loadingStartTime = Date.now();
          this.isLoading.set(true);
        }

        if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          const duration = Date.now() - this.loadingStartTime;
          const delay = Math.max(0, this.MIN_DISPLAY_TIME - duration);

          if (delay > 0) {
            setTimeout(() => this.isLoading.set(false), delay);
          } else {
            this.isLoading.set(false);
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroyPlayer();
  }

  private initPlayer(canvas: HTMLCanvasElement) {
    this.dotLottie = new DotLottie({
      canvas: canvas,
      src: this.animationPath(),
      loop: true,
      autoplay: true,
      backgroundColor: 'transparent',
      speed: 4
    });
  }

  private destroyPlayer() {
    if (this.dotLottie) {
      this.dotLottie.destroy();
      this.dotLottie = null;
    }
  }
}
