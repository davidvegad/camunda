import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // <-- AGREGA ESTO

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),          // <-- Y AGREGA ESTO
  ],
});
