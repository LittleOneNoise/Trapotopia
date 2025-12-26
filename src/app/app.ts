import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer.component';
import { HeaderComponent } from './components/header.component';
import { GlobalLoaderComponent } from './components/global-loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent, GlobalLoaderComponent],
  template: `
    <!-- TODO: in fine il faudra utiliser ça pour les resolver et non la navigation car le cycle de vie est different -->
    <trapotopia-global-loader animationPath="/panda_loading.lottie" height="200px" width="200px" />

    <div class="min-h-screen bg-surface-800 selection:bg-og-pink selection:text-[oklch(0%_0_0)]">

      <trapotopia-header/>

      <main class="pt-20 grow flex flex-col text-center w-full">
        <router-outlet></router-outlet>
      </main>

      <trapotopia-footer/>

    </div>
  `
})
export class App {
}
