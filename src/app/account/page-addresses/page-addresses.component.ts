import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {ToastrService} from "ngx-toastr";
import {Subject, Subscription} from 'rxjs';
import {NaoUserAccessData, NaoUserAccessService, NaoUsersInterface} from "../../nao-user-access";
import {UrlService} from '../../services/url.service';
import {AccountProfileService} from "../account-profile.service";
import {accountData$} from "../../../app.static";
import {AppService} from "../../app.service";

@Component({
  selector: 'app-page-addresses',
  templateUrl: './page-addresses.component.html',
  styleUrls: ['./page-addresses.component.scss'],
})
export class PageAddressesComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public addresses: NaoUsersInterface.Address[] = [];
  public removeInProgress: string[] = [];
  public subs = new Subscription();


  constructor(
    private readonly appService: AppService,
    private readonly naoUsersService: NaoUserAccessService,
    public readonly url: UrlService,
    private readonly toastr: ToastrService,
    private readonly translate: TranslateService,
    private readonly userProfileService: AccountProfileService,
  ) {
  }


  public ngOnInit(): void {
    // -->Set: addresses
    this.addresses = accountData$.getValue()?.addresses || [];
    // -->Subscribe: to account data
    this.subs.add(
      accountData$.subscribe((accountData) => {
        // -->Set: account information
        this.addresses = Array.isArray(accountData?.addresses) ? accountData.addresses : [];
      }),
    )
  }


  /**
   * Remove: address from user profile
   */
  public remove(address: NaoUsersInterface.Address): void {
    // -->Check: address
    if (!address || this.removeInProgress.indexOf(address.id) !== -1 || !address.id) {
      return;
    }

    // -->Start: progress
    this.removeInProgress.push(address.id);

    // -->Set: data
    const data = {
      addresses: this.addresses.filter(item => item.id !== address.id)
    }

    // -->Update
    this.userProfileService.updateAccountData("addresses", {
      data,
      docId: NaoUserAccessData.userId.getValue()
    }).subscribe(
      (res) => {
        if (res && res.ok) {
          // -->Refresh: account data information
          this.appService.getAccountDataInformation().then(res => {
            // -->Done: loading
            const index = this.removeInProgress.indexOf(address.id);
            // -->Filter: addresses
            this.addresses = this.addresses.filter((item) => item.id !== address.id);

            if (index !== -1) {
              this.removeInProgress.splice(index, 1);
            }
            // -->Show: toaster
            this.toastr.success(this.translate.instant("TOASTER_ADDRESS_DELETED"));
          }).catch(err => {
            // -->Show: toaster
            this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
          })
        } else {
          // -->Show: toaster
          this.toastr.error(this.translate.instant("ERROR_API_REQUEST"));
        }
      },
      (error) => {
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
