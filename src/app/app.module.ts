import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpBackend, HttpClient, HttpClientModule} from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {NotfoundComponent} from './modules/notfound/notfound.component';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {AuthService} from './core/service/auth.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastModule} from "primeng/toast";

/**
 * Блокирует бутстрап приложения, пока не загрузятся переводы
 * базового языка → убирает мигание ключей на старте.
 */
export function translateAppInitializer(translate: TranslateService): () => Promise<unknown> {
  return () => {
    // Ключ хранилища подставь тот, который реально используется у тебя для языка
    const lang = localStorage.getItem('language') || translate.getDefaultLang() || 'ru';
    translate.setDefaultLang(lang);
    return firstValueFrom(
      translate.use(lang).pipe(catchError(() => of(lang))) // при ошибке не роняем приложение
    );
  };
}

declare global {
  interface Window {
    callNCALayer: any;
    clearArrXML: any;
    addArrXML: any;
    getArrXML: any;
    getResXML: any;
    findPath: any;
  }
}

export function HttpLoaderFactory(handler: HttpBackend) {
  const httpClient = new HttpClient(handler);
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

function appInitializer(authService: AuthService) {
  return () =>
    new Promise((resolve) => {
      authService.loadProfile().subscribe(resolve);
    });
}

@NgModule({
  declarations: [AppComponent, NotfoundComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpBackend],
      },
    }),
    ToastModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: translateAppInitializer,
      deps: [TranslateService],
      multi: true
    },
    MessageService,
    AuthService,
    ConfirmationService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
