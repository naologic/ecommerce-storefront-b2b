import {ChangeDetectorRef, Component, forwardRef, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {cloneDeep} from 'lodash';
import {Subscription} from "rxjs";
import {ProductOption, Variant} from '../../interfaces/product';

@Component({
  selector: 'app-product-variants',
  templateUrl: './product-variants.component.html',
  styleUrls: ['./product-variants.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProductVariantsComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ProductVariantsComponent),
      multi: true,
    },
  ],
})
export class ProductVariantsComponent implements OnChanges, ControlValueAccessor, Validator, OnDestroy {
  /**
   * This was made for a maximum 3 option rows
   */
  @Input() public variants: Variant[] = [];
  @Input() public options: ProductOption[] = [];

  private subs = new Subscription();
  private changeFn: (_: any) => void = () => {
  };
  private touchedFn: () => void = () => {
  };

  public form: FormGroup = this.fb.group({});
  public optionsMapped: ProductOption[] = [];

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
  ) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {

      // -->Iterate: over all variants and set the options in the right format
      this.variants = this.variants.map(variant => {
        return this.setOptionsMapped(variant);
      })

      // -->Get: first variant
      const firstVariant = this.variants[0];
      // -->Controls
      const controls: { [key: string]: [null | string, ValidatorFn[]] } = {
        variantId: [null, [Validators.required]]
      };

      // -->Clone: options
      this.optionsMapped = cloneDeep(this.options);
      // -->Init: first value
      const firstValue = {
        variantId: firstVariant.id
      }

      // -->Iterate: over options and set controls
      this.options.forEach((option, i) => {
        if (option && option.id) {
          controls[option.id] = [
            // -->Add: first variant as selected option if any, else just pick null
            firstVariant.optionsMapped[`optionId${i + 1}`] ? firstVariant.optionsMapped[`optionId${i + 1}`] : null,
            [Validators.required]
          ];
          firstValue[option.id] = firstVariant.optionsMapped[`optionId${i + 1}`]
        }
      });

      // -->Create: formGroup
      this.form = this.fb.group(controls);
      // -->Subscribe: on value changes
      this.subs.add(
        this.form.valueChanges.subscribe(value => {
          this.changeFn(value);
          this.touchedFn();
        })
      );

      // -->Remap: options
      this.remapOptionsOnVariantClick();

      setTimeout(() => {
        this.writeValue(firstValue);
        this.form.updateValueAndValidity();
      }, 0)
    }
  }


  /**
   * Set: optionsMapped inside the variant based on the options list
   */
  public setOptionsMapped(variant: Variant): Variant {
    // -->Init
    const optionsMapped = {}

    // -->Iterate: over options
    this.options.map((opt, i) => {
      // -->Set: all the options as optionId1, optionId2, optionId3
      optionsMapped[`optionId${i + 1}`] = this.getValueFromOptionsPath(variant.optionItemsPath, i);
    });

    // -->Set:
    variant.optionsMapped = optionsMapped;

    return variant;
  }

  /**
   * Split: value from an array of strings with dots as separation.
   * @Example:
   *   value: "bkrdte.xnsqrs"
   *   level: 1
   *   @return: xnsqrs
   */
  public getValueFromOptionsPath(value: string, level: number): string | null {
    const sp = value?.split('.') || [];
    return value?.split('.')[level] || null
  }


  /**
   * Remap: the options because one variant has changed
   */
  public remapOptionsOnVariantClick(): void {
    // -->Clone: options
    const options = cloneDeep(this.options);

    // -->Check: if first row of options exists
    if (options[0] && Array.isArray(options[0].values)) {
      // -->Set: second level of options
      options[0].values = options[0].values.filter(value => this.checkIfValueExists(0, value.id));
    }

    // -->Check: if second row of options exists
    if (options[1] && Array.isArray(options[1].values)) {
      // -->Set: second level of options
      options[1].values = options[1].values.filter(value => this.checkIfValueExists(1, value.id));
      // -->Check: if current variant is valid, if not set the first valid one with prev options
      if (!this.checkIfCurrentVariantIsValid(1)) {
        // -->Set: first valid variant possible
        this.setFirstValidVariant(1);
      }
    }

    // -->Check: if third row of options exists
    if (options[2] && Array.isArray(options[2].values)) {
      // -->Set: third level of options
      options[2].values = options[2].values.filter(value => this.checkIfValueExists(2, value.id));
      // -->Check: if current variant is valid, if not set the first valid one with prev options
      if (!this.checkIfCurrentVariantIsValid(2)) {
        // -->Set: first valid variant possible
        this.setFirstValidVariant(2);
      }
    }

    // -->Set: options
    this.optionsMapped = options;
    // -->Search: and update variantId
    this.setVariantId();
  }

  /**
   * Set: variant id for the current options
   */
  public setVariantId(): void {
    // -->Init
    let variantId: any = null;

    // -->Search: for variantId based on the number of options
    if (this.optionsMapped.length === 1) {
      variantId = this.variants.find(variant => variant?.optionsMapped?.optionId1 === this.form.get(this.optionsMapped[0]?.id).value)?.id;
    } else if (this.optionsMapped.length === 2) {
      variantId = this.variants.find(variant =>
        variant?.optionsMapped?.optionId1 === this.form.get(this.optionsMapped[0].id).value &&
        variant?.optionsMapped?.optionId2 === this.form.get(this.optionsMapped[1].id).value
      )?.id;
    } else if (this.optionsMapped.length === 3) {
      variantId = this.variants.find(variant =>
        variant?.optionsMapped?.optionId1 === this.form.get(this.optionsMapped[0].id).value &&
        variant?.optionsMapped?.optionId2 === this.form.get(this.optionsMapped[1].id).value &&
        variant?.optionsMapped?.optionId3 === this.form.get(this.optionsMapped[2].id).value
      )?.id;
    }

    // -->Set: variantId value
    this.form.get('variantId').setValue(variantId);
  }

  /**
   * Check: if a value from an option exists in the variants array
   */
  public checkIfValueExists(optionLevel: number, valueId: string): boolean {
    return this.variants.some(variant => {
      // -->Check: the option level
      if (optionLevel === 1) {
        return variant?.optionsMapped?.optionId2 === valueId &&
          variant?.optionsMapped?.optionId1 === this.form.get(this.optionsMapped[0]?.id)?.value

      } else if (optionLevel === 2) {
        return variant?.optionsMapped?.optionId3 === valueId &&
          variant?.optionsMapped?.optionId1 === this.form.get(this.optionsMapped[0]?.id)?.value &&
          variant?.optionsMapped?.optionId2 === this.form.get(this.optionsMapped[1]?.id)?.value

      } else {
        return variant?.optionsMapped?.optionId1 === valueId
      }
    });
  }

  /**
   * Check: if current formGroup is a valid variant
   */
  public checkIfCurrentVariantIsValid(optionLevel: number): boolean {
    return this.variants.some(variant => {
      // -->Check: the option level
      if (optionLevel === 1) {
        return variant?.optionsMapped?.optionId1 === this.form.get(this.optionsMapped[0]?.id).value &&
          variant?.optionsMapped?.optionId2 === this.form.get(this.optionsMapped[1]?.id)?.value

      } else if (optionLevel === 2) {
        return variant?.optionsMapped?.optionId1 === this.form.get(this.optionsMapped[0]?.id).value &&
          variant?.optionsMapped?.optionId2 === this.form.get(this.optionsMapped[1]?.id)?.value &&
          variant?.optionsMapped?.optionId3 === this.form.get(this.optionsMapped[2]?.id)?.value
      } else {
        return variant?.optionsMapped?.optionId1 === this.form.get(this.optionsMapped[0]?.id).value
      }
    });
  }

  /**
   * Set: first valid variant with the current options
   *     > we check everything until the level picked, and then pick a variant for the next level
   */
  public setFirstValidVariant(optionLevel: 1 | 2): void {
    // -->If: option level is one, get the optionId1 from formGroup and set optionId2
    if (optionLevel === 1) {
      const firstVariantFound = this.variants.find(variant => variant?.optionsMapped?.optionId1 === this.form.get(this.optionsMapped[0]?.id)?.value);
      // -->Set: variant
      if (this.optionsMapped[1]?.id) {
        this.form.get(this.optionsMapped[1]?.id)?.setValue(firstVariantFound?.optionsMapped?.optionId2);
      }
    }

    // -->If: option level is one, get the optionId1 and optionId2 from formGroup and set optionId3
    if (optionLevel === 2) {
      const firstVariantFound = this.variants.find(variant => {
        if (this.optionsMapped[0]?.id && this.optionsMapped[1]?.id) {
          return variant?.optionsMapped?.optionId1 === this.form.get(this.optionsMapped[0]?.id)?.value &&
            variant?.optionsMapped?.optionId2 === this.form.get(this.optionsMapped[1]?.id)?.value
        }
        return false;
      });

      // -->Set: variant
      if (this.optionsMapped[2]?.id) {
        this.form.get(this.optionsMapped[2]?.id)?.setValue(firstVariantFound?.optionsMapped?.optionId3);
      }
    }
  }

  /**
   * Register: callback function to handle value changes
   */
  public registerOnChange(fn: any): void {
    this.changeFn = fn;
  }

  /**
   * Register: callback function to handle control touch events
   */
  public registerOnTouched(fn: any): void {
    this.touchedFn = fn;
  }

  /**
   * Set: disabled state
   */
  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable({emitEvent: false});
    } else {
      this.form.enable({emitEvent: false});
    }
  }

  /**
   * Write: value
   */
  public writeValue(value: any): void {
    // -->Check: value type
    if (typeof value !== 'object') {
      value = {};
    }

    // -->Init: base value
    const baseValue: { [key: string]: null } = {};
    // -->Get: based value
    this.options.forEach(option => {
      if (option.id) {
        baseValue[option.id] = null
      }
    });

    // -->Check: value variant id
    if (!value.variantId) {
      value.variantId = null;
    }

    // -->Set: value
    this.form.setValue({...baseValue, ...value}, {emitEvent: false});
    // -->Trigger: detect changes
    this.cd.detectChanges();
  }

  /**
   * Validate: form
   */
  public validate(control: AbstractControl): ValidationErrors {
    return this.form.valid ? {} : {options: this.form.errors};
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
