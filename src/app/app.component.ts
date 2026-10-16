import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  catchError,
  filter,
  of,
  Subject,
  takeUntil
} from 'rxjs';
import { PrimeNGConfig } from 'primeng/api';

import { ApiService } from './core/api.service';
import { AuthService } from './core/service/auth.service';
import { TranslationService } from './core/service/translation.service';
import { DictinoryValue } from './dto/dictinory-value';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  readonly title = 'cbdi-ui';

  private readonly destroy$ = new Subject<void>();
  private dictionariesLoaded = false;

  constructor(
    private readonly api: ApiService,
    private readonly primengConfig: PrimeNGConfig,
    private readonly translationService: TranslationService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.setPrimeNGTranslations();

    this.translationService.langChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.setPrimeNGTranslations());

    /*
     * Сначала проверяем текущую сессию. Подписку на profile$
     * создаём после проверки, чтобы не использовать устаревший профиль
     * из localStorage.
     */
    this.authService.loadProfile()
      .pipe(
        catchError((error) => {
          console.error('Не удалось загрузить профиль', error);
          document.getElementById('splash')?.remove();
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.watchAuthenticatedProfile();
      });

    document.getElementById('splash')?.remove();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private watchAuthenticatedProfile(): void {
    this.authService.profile$
      .pipe(
        filter((profile) => Boolean(profile)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.loadDictionaries());
  }

  private loadDictionaries(): void {
    if (this.dictionariesLoaded) {
      return;
    }

    this.dictionariesLoaded = true;

    const dictionaries: Array<[number, string]> = [
      [3, 'sex'],
      [44, 'd_family_status'],
      [69, 'd_socialeconomicstatus'],
      [48, 'd_housingtype'],
      [113, 'd_harmful_factors'],
      [107, 'd_district_bi']
    ];

    dictionaries.forEach(([id, code]) => {
      this.loadDictionary(id, code);
    });
  }

  private loadDictionary(id: number, code: string): void {
    this.api
      .get<DictinoryValue>(`/dictionary/value/all/${id}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (dictionary) => {
          localStorage.setItem(
            code,
            JSON.stringify(dictionary)
          );
        },
        error: (error) => {
          console.error(
            `Не удалось загрузить справочник ${code}`,
            error
          );
        }
      });
  }

  private setPrimeNGTranslations(): void {
    this.translationService
      .getTranslation('primeng')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (translations) => {
          this.primengConfig.setTranslation(translations);
        },
        error: (error) => {
          console.error(
            'Не удалось загрузить перевод PrimeNG',
            error
          );
        }
      });
  }
}
