import { ChangeDetectorRef, OnDestroy, Pipe } from '@angular/core';
import { LangChangeEvent, TranslatePipe, TranslateService, TranslationChangeEvent} from '@ngx-translate/core';
import { isPlainObject, mapValues } from 'lodash';
/*
 * Translate a lang but keep a backup
 * Usage:
 *   {{ formGroup.get('data.first_name').errors | formTranslateErrors }}
 * Variables:
 *    formErrors = { "required": true }
 *
*/
@Pipe({
  name: 'formTranslateErrors',
  pure: false // if true, the pipe doesn't update when we change language, but on next request
})
export class FormTranslateErrorsPipe extends TranslatePipe implements OnDestroy {
  public rootLangPath = 'form.validators';
  public lastLangPaths: { [index: string]: {instant: string, err: any} } = {};

  public value;
  private subs = {
    transChange: null, langChange: null
  };

  constructor(
    private readonly translateService: TranslateService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    super(translateService, changeDetectorRef);
  }

  transform(
    formErrors,
    langPrefix?: string, // prefix path the
  ): string {
    if (!isPlainObject(formErrors)) {
      return '';
    }

    // -->Get: keys
    const keys = Object.keys(formErrors);
    if (keys.length === 0) {
      return '';
    }

    // -->Set: empty errors
    const errs = {};

    // -->Loop: form errors
    mapValues(formErrors, (err, errIndex) => {
      // -->Get: path
      const lpath = langPrefix ? `${langPrefix}.${errIndex}` : `${this.rootLangPath}.${errIndex}`;
      // -->Check: the cache for this error
      if (!this.lastLangPaths[lpath] || (this.lastLangPaths[lpath] && this.lastLangPaths[lpath].err !== err)) {
        // -->Set: in cache
        this.lastLangPaths[lpath] = {
          instant: this.translateService.instant(lpath, err || null),
          err
        };
      }

      // -->Set: errors
      errs[errIndex] = this.lastLangPaths[lpath].instant;
    });

    // -->Set: value as object with errors
    this.value = errs;

    // -->Listen: for change vents
    if (!this.subs.transChange) {
      this.subs.transChange = this.translateService.onTranslationChange
        .subscribe((event: TranslationChangeEvent) => {
          this.lastLangPaths = {};
        });
    }
    if (!this.subs.langChange) {
      this.subs.langChange = this.translateService.onLangChange
        .subscribe((event: LangChangeEvent) => {
          this.lastLangPaths = {};
        });
    }

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
    this.lastLangPaths = null;
  }
}
