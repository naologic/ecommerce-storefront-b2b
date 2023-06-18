import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {ToastrService} from "ngx-toastr";
import {Subject, Subscription} from "rxjs";
import {generateRandomString} from "../../nao-utils";
import {NaoUserAccessData, NaoUserAccessService, NaoUsersInterface} from "../../nao-user-access";
import {ActiveCountryList} from "../../app.locale";
import {AccountProfileService} from "../account-profile.service";
import {accountData$} from "../../../app.static";
import {AppService} from "../../app.service";

@Component({
  selector: "app-page-edit-address",
  templateUrl: "./page-edit-address.component.html",
  styleUrls: ["./page-edit-address.component.scss"],
})
export class PageEditAddressComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  private subs = new Subscription();

  public addressId: string | null = null;
  public saveInProgress = false;
  public firstOrDefaultAddress: boolean = false;
  public addresses: NaoUsersInterface.Address[] = [];
  // -->Set: countries
  public countries = ActiveCountryList;
  public formGroup: FormGroup = new FormGroup({
    city: new FormControl("", {validators: [Validators.required]}),
    country: new FormControl("USA", {validators: [Validators.required]}),
    id: new FormControl(generateRandomString(12)),
    line1: new FormControl("", {validators: [Validators.required]}),
    line2: new FormControl(""),
    state: new FormControl("", {validators: [Validators.required]}),
    type: new FormControl("shipping", {validators: [Validators.required]}),
    zip: new FormControl(null, {validators: [Validators.required]}),
  });

  constructor(private appService: AppService, private router: Router, private route: ActivatedRoute, private naoUsersService: NaoUserAccessService, private toastr: ToastrService, private translate: TranslateService, private userProfileService: AccountProfileService) {
  }

  public ngOnInit(): void {
    // -->Set: addresses
    this.addresses = accountData$.getValue()?.addresses || [];

    // -->Subscribe: on route change
    this.subs.add(
      this.route.params.subscribe((params) => {
        // -->Set: address id
        this.addressId = params['id'];
        // -->Search: for address
        const address = this.addresses.find((item) => item.id === this.addressId);
        if (address) {
          // -->Update: form group
          this.formGroup.setValue({
            id: address.id,
            country: address.country,
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            state: address.state,
            type: address.type,
            zip: address.zip,
          });
        }
      }),
    );
  }

  /**
   * Save: address to user profile
   */
  public save(): void {
    this.formGroup.markAllAsTouched();

    // -->Check: save action state and form
    if (this.saveInProgress || this.formGroup.invalid) {
      return;
    }

    // -->Start: loading
    this.saveInProgress = true;
    // -->Get: address
    const address = this.formGroup.getRawValue();

    // -->Check: if it's edit or create
    if (this.addressId) {
      // -->Find: index
      const index = this.addresses.findIndex((item) => item.id === this.addressId);
      if (index > -1) {
        // -->Update: address
        this.addresses[index] = address;
      }
    } else {
      // -->Insert: new address
      this.addresses.unshift(address);
    }


    // -->Update
    this.userProfileService
      .updateAccountData("addresses", {
        data: {
          addresses: this.addresses
        },
        docId: NaoUserAccessData.userId.getValue(),
      })
      .subscribe(
        (res) => {
          if (res && res.ok) {
            // -->Refresh: account data information
            this.appService.getAccountDataInformation().then(res => {
              // -->Done: loading
              this.saveInProgress = false;
              // -->Redirect:
              this.router.navigateByUrl('/account/addresses').then((res => {
                // -->Show: toaster
                this.toastr.success(this.translate.instant(this.addressId ? 'TOASTER_ADDRESS_UPDATED' : 'TOASTER_ADDRESS_CREATED'));
              }));
            }).catch(err => {
              // -->Done: loading
              this.saveInProgress = false;
              // -->Show: toaster
              this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
            })

          } else {
            // -->Done: loading
            this.saveInProgress = false;
            // -->Show: toaster
            this.toastr.error(this.translate.instant("ERROR_API_REQUEST"));
          }
        },
        (error) => {
          // -->Done: loading
          this.saveInProgress = false;
          // -->Show: toaster
          this.toastr.error(this.translate.instant("ERROR_API_REQUEST"));
        },
      );
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
