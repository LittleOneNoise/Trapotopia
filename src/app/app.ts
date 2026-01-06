import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/layout/footer.component';
import { HeaderComponent } from './components/layout/header.component';
// import {GlobalLoaderComponent} from "./components/loader/global-loader.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  template: `
    <!-- TODO: in fine il faudra utiliser ça pour les resolver et non la navigation car le cycle de vie est different -->
<!--    <trapotopia-global-loader animationPath="/panda_loading.lottie" height="200px" width="200px" />-->

    <div class="bg-surface-800 selection:bg-og-pink selection:text-[oklch(0%_0_0)]">

      <trapotopia-header/>

      <main class="min-h-screen pt-20 flex flex-col text-center w-full">
        <router-outlet></router-outlet>
      </main>

      <trapotopia-footer/>

    </div>
  `
})
export class App {
}
