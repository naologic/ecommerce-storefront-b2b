import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { LangChangeEvent, TranslatePipe, TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { isString } from 'lodash';
/*
 * Translate a lang but keep a backup
 * Usage:
 *   '$module.hotel.new.message' | flowTranslate:'crud.new.message'
 * Example:
 *   {{ '$module.hotel.new.message' | flowTranslate:'crud.new.message' }}
 *
 *   if '$module.hotel.new.message' exists
 *      "New hotel"
 *   else
 *      "New"
 *
*/
@Pipe({
  name: 'flowTranslate',
  pure: false
})
export class FlowTranslatePipe extends TranslatePipe implements OnDestroy, PipeTransform {
  public value;
  public lastValue;
  public lastLangPath;
  public lastBackupLangPath;
  private subs = { transChange: null, langChange: null };

  constructor(
    private readonly translateService: TranslateService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    super(translateService, changeDetectorRef);
  }

  public transform(
    langPath: string,
    backupLangPath?: string,
    data?: any
  ): string {
    if (!isString(langPath) || !langPath) {
      return '';
    }

    // -->Check: if I have the last value, no need for a new one
    if (this.lastLangPath && this.lastLangPath === langPath && this.lastValue !== langPath) {
      return this.lastValue;
    }
    // -->Check: if message exists
    const message = this.translateService.instant(langPath, data);

    if (message === langPath && isString(backupLangPath)) {
      this.value = super.transform(backupLangPath);
    } else {
      this.value = message; // super.transform(langPath);
    }

    // -->Listen: for change vents
    if (!this.subs.transChange) {
      this.subs.transChange = this.translateService.onTranslationChange
        .subscribe((event: TranslationChangeEvent) => {
          this.lastLangPath = null;
          this.lastBackupLangPath = null;
        });
    }
    if (!this.subs.langChange) {
      this.subs.langChange = this.translateService.onLangChange
        .subscribe((event: LangChangeEvent) => {
          this.lastLangPath = null;
          this.lastBackupLangPath = null;
        });
    }

    // -->Set: last values
    this.lastLangPath = langPath;
    this.lastBackupLangPath = backupLangPath || null;
    this.lastValue = this.value;

    return this.value;
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.subs.langChange) {
      this.subs.langChange.unsubscribe();
    }
    if (this.subs.transChange) {
      this.subs.transChange.unsubscribe();
    }
  }
}
