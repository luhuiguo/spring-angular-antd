import { Injectable, Inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { zhCN, enUS, NzLocaleService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '../settings/settings.service';


@Injectable()
export class I18NService {

  private _default = 'zh-CN';

  private _langs = [
      { code: 'en', text: 'English' },
      { code: 'zh-CN', text: '中文' }
  ];

  constructor(
      settings: SettingsService,
      private nzLocalService: NzLocaleService,
      private translateService: TranslateService,
      private injector: Injector
  ) {
      this._default = settings.layout.lang || translateService.getBrowserLang();
      const lans = this._langs.map(item => item.code);
      if (!lans.includes(this._default)) {
          this._default = lans[0];
      }
      translateService.addLangs(lans);
  }

  use(lang: string = null, firstLoad = true): Observable<any> {
      lang = lang || this.translateService.getDefaultLang();
      this.nzLocalService.setLocale(lang === 'en' ? enUS : zhCN);
      // need reload router because of ng-zorro-antd local system
      if (!firstLoad) this.injector.get(Router).navigate([ '/' ]);
      return this.translateService.use(lang);
  }
  /** 获取语言列表 */
  getLangs() {
      return this._langs;
  }
  /** 翻译 */
  translate(key: string) {
      return this.translateService.instant(key);
  }
  /** 默认语言 */
  get defaultLang() {
      return this._default;
  }
  /** 当前语言 */
  get currentLang() {
      return this.translateService.currentLang || this.translateService.getDefaultLang() || this._default;
  }
}

