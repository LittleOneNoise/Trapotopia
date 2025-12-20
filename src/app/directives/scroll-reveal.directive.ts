import {Directive, ElementRef, inject, input, OnInit, PLATFORM_ID, Renderer2} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit {
  // Permet de choisir l'animation : fade-up, fade-left, etc.
  public appScrollReveal = input<'fade-up' | 'fade-left' | 'fade-right'>('fade-up');
  public delay = input<number>(0); // Optionnel : pour décaler l'animation

  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit() {
    // Sécurité pour SSR
    if (!isPlatformBrowser(this.platformId)) return;

    // 1. Appliquer les classes initiales
    this.renderer.addClass(this.el.nativeElement, 'reveal-init');
    this.renderer.addClass(this.el.nativeElement, this.appScrollReveal());

    if (this.delay()) {
      this.renderer.setStyle(this.el.nativeElement, 'transition-delay', `${this.delay()}ms`);
    }

    // 2. Observer l'élément
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // L'élément entre : on joue l'animation
          this.renderer.addClass(this.el.nativeElement, 'is-revealed');
        } else {
          // L'élément sort : on réinitialise pour le prochain passage
          this.renderer.removeClass(this.el.nativeElement, 'is-revealed');
        }
      });
    }, {
      threshold: 0.4, // Déclenche quand 40% est visible
    });
    observer.observe(this.el.nativeElement);
  }
}
