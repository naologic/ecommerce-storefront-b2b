import {
    ChangeDetectorRef,
    Component,
    forwardRef,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges
} from '@angular/core';
import { AbstractControl,
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
import { range, cloneDeep } from 'lodash';
import { Subscription } from "rxjs";
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
    private changeFn: (_: any) => void = () => {};
    private touchedFn: () => void = () => {};

    public form: FormGroup = this.fb.group({});
    public optionsMapped: ProductOption[] = [];

    constructor(
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
    ) { }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.options) {
            // -->Get: first variant
            const firstVariant = this.variants[0];
            console.error("this.variants >>", this.variants)
            console.error("firstVariant >>", firstVariant)
            // -->Controls
            const controls: {[key: string]: [null, ValidatorFn[]]} = {
                variantId: [null, [Validators.required]]
            };

            // -->Clone: options
            this.optionsMapped = cloneDeep(this.options);
            // -->Init: first value
            const firstValue = {
                variantId: firstVariant.id
            }

            console.log("this.options >>>", this.options)
            // -->Iterate: over options and set controls
            this.options.forEach((option, i) => {
                controls[option.id] = [
                    // -->Add: first variant as selected option if any, else just pick null
                    firstVariant[`optionId${i + 1}`] ? firstVariant[`optionId${i + 1}`] : null,
                    [Validators.required]
                ];
                firstValue[option.id] = firstVariant[`optionId${i + 1}`]
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

            console.warn("this.form >>>", this.form)

            setTimeout(() => {
                this.writeValue(firstValue);
                this.form.updateValueAndValidity();
            }, 0)
        }
    }

    /**
     * Remap: the options because one variant has changed
     */
    public remapOptionsOnVariantClick(): void {
        console.warn("remapOptionsOnVariantClick >>>>>>>")
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

        // todo:
        // todo:
        // todo:
        // todo:

        // -->Create: options path based on level
        let optionPath = '';
        const optionLevel = this.optionsMapped.length;

        // -->Iterate: over all options mapped base don level and create the options path similar to the one in variants
        range(optionLevel + 1).map((level: number, index: number) => {
            optionPath += this.form.get(this.optionsMapped[level]?.id).value + (index === optionLevel ? '.' : '');
        })

        // -->Init
        let variantId = this.variants.find(variant => variant.optionsPath === optionPath);


        console.error("setVariantId >>>", { optionLevel,
            optionPath,
            variantId})

        // -->Set: variantId value
        this.form.get('variantId').setValue(variantId);
    }

    /**
     * Check: if a value from an option exists in the variants array
     */
    public checkIfValueExists(optionLevel: number, valueId: string): boolean {

        // -->Create: options path based on level
        let optionPath = '';
        // -->Iterate: over all options mapped base don level and create the options path similar to the one in variants
        range(optionLevel + 1).map((level: number, index: number) => {
            optionPath += this.form.get(this.optionsMapped[level]?.id).value + (index === optionLevel ? '.' : '');
        })

        if (optionPath) {
            optionPath += `.${valueId}`
        } else {
            optionPath = valueId;
        }

        console.error("optionPath to test>>>", optionPath)
        return this.variants.some((variant) => variant.optionsPath?.startsWith(optionPath));
        // todo:
        // todo:
        // todo:
        // todo:
        // return this.variants.some(variant => {
        //     // -->Check: the option level
        //     if (optionLevel === 1) {
        //         return variant?.optionId2 === valueId &&
        //             variant?.optionId1 === this.form.get(this.optionsMapped[0]?.id)?.value
        //
        //     } else if (optionLevel === 2) {
        //         return variant?.optionId3 === valueId &&
        //             variant?.optionId1 === this.form.get(this.optionsMapped[0]?.id)?.value &&
        //             variant?.optionId2 === this.form.get(this.optionsMapped[1]?.id)?.value
        //
        //     } else {
        //         return variant?.optionId1 === valueId
        //     }
        // });
    }

    /**
     * Check: if current formGroup is a valid variant
     */
    public checkIfCurrentVariantIsValid(optionLevel: number): boolean {
        // -->Create: options path based on level
        let optionPath = '';
        // -->Iterate: over all options mapped base don level and create the options path similar to the one in variants
        range(optionLevel + 1).map((level: number, index: number) => {
            optionPath += this.form.get(this.optionsMapped[level]?.id).value + (index === optionLevel ? '.' : '');
        })

        console.error("optionPath to test>>>", optionPath)
        return this.variants.some((variant) => variant.optionsPath?.startsWith(optionPath));

        // return this.variants.some(variant => {
            // // -->Check: the option level
            // if (optionLevel === 1) {
            //     return variant?.optionId1 === this.form.get(this.optionsMapped[0]?.id).value &&
            //            variant?.optionId2 === this.form.get(this.optionsMapped[1]?.id)?.value
            //
            // } else if (optionLevel === 2) {
            //     return variant?.optionId1 === this.form.get(this.optionsMapped[0]?.id).value &&
            //            variant?.optionId2 === this.form.get(this.optionsMapped[1]?.id)?.value &&
            //            variant?.optionId3 === this.form.get(this.optionsMapped[2]?.id)?.value
            // } else {
            //     return variant?.optionId1 === this.form.get(this.optionsMapped[0]?.id).value
            // }
        // });
    }

    /**
     * Set: first valid variant with the current options
     *     > we check everything until the level picked, and then pick a variant for the next level
     */
    public setFirstValidVariant(optionLevel: 1 | 2): void {
        // // -->If: option level is one, get the optionId1 from formGroup and set optionId2
        // if (optionLevel === 1) {
        //     const firstVariantFound = this.variants.find(variant => variant?.optionId1 === this.form.get(this.optionsMapped[0]?.id)?.value);
        //     // -->Set: variant
        //     this.form.get(this.optionsMapped[1]?.id)?.setValue(firstVariantFound?.optionId2);
        // }
        //
        // // -->If: option level is one, get the optionId1 and optionId2 from formGroup and set optionId3
        // if (optionLevel === 2) {
        //     const firstVariantFound = this.variants.find(variant => {
        //         return variant?.optionId1 === this.form.get(this.optionsMapped[0]?.id)?.value &&
        //             variant?.optionId2 === this.form.get(this.optionsMapped[1]?.id)?.value
        //     });
        //
        //     // -->Set: variant
        //     this.form.get(this.optionsMapped[2]?.id)?.setValue(firstVariantFound?.optionId3);
        // }
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
            this.form.disable({ emitEvent: false });
        } else {
            this.form.enable({ emitEvent: false });
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
        const baseValue: {[key: string]: null} = {};
        // -->Get: based value
        this.options.forEach(option => baseValue[option.id] = null);

        // -->Check: value variant id
        if (!value.variantId) {
            value.variantId = null;
        }

        // -->Set: value
        this.form.setValue({ ...baseValue, ...value }, { emitEvent: false });
        // -->Trigger: detect changes
        this.cd.detectChanges();
    }

    /**
     * Validate: form
     */
    public validate(control: AbstractControl): ValidationErrors {
        return this.form.valid ? {} : { options: this.form.errors };
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
