import { Component, OnDestroy, OnInit } from "@angular/core";
import { AppService } from "../../app.service";
import { Subscription } from "rxjs";
import { NaoUserAccessService, NaoUsersInterface } from "../../nao-user-access";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ECommerceService } from "../../e-commerce.service";

@Component({
  selector: "app-page-contact-us",
  templateUrl: "./page-contact-us.component.html",
})
export class PageContactUsComponent implements OnInit, OnDestroy {
  /**
   * View state
   */
  public viewState: "form" | "success" = "form";
  /**
   * Status
   */
  public isSendingInProgress = false;
  /**
   * Error message
   */
  public errorMessage: string | null = null;
  /**
   * List: of contact types
   */
  public contactTypes = [
    {
      name: "I’m a customer",
      value: "customer",
    },
    {
      name: "I’m a partner",
      value: "partner",
    },
    {
      name: "I’m a manufacturer",
      value: "manufacturer",
    },
    {
      name: "Other",
      value: "other",
    },
  ];
  /**
   * Form group
   */
  public formGroup!: FormGroup;
  /**
   * subscriptions
   */
  private subs = new Subscription();
  private refreshSubs!: Subscription;

  constructor(
    public appService: AppService,
    private readonly naoUsersService: NaoUserAccessService,
    public eCommerceService: ECommerceService,
  ) {
    this.setForm();
  }

  public ngOnInit(): void {
    // -->Subscribe: to userData
    this.subs.add(
      this.naoUsersService.userData.subscribe(userData => {
        // -->Set: form
        this.setForm(userData);
      }),
    );
  }


  /**
   * Set: form
   */
  private setForm(userData?: NaoUsersInterface.UserData): void {
    // -->Create: full name
    const fullName = userData?.firstName && userData?.lastName ? `${userData.firstName} ${userData.lastName}` : null;

    // -->Set: formGroup
    this.formGroup = new FormGroup({
      fullName: new FormControl(fullName, { validators: [Validators.required] }),
      email: new FormControl(userData?.email || null, { validators: [Validators.required, Validators.email] }),
      message: new FormControl(null, { validators: [Validators.required] }),
      companyName: new FormControl(null),
      orderNumber: new FormControl(null),
      contactType: new FormControl("customer", { validators: [Validators.required] }),
    });
  }

  /**
   * Send contact message
   */
  public sendContactMessage(): void {
    // -->Mark: all controls
    this.formGroup.markAllAsTouched();
    this.errorMessage = null;

    // -->Check: register action state and form
    if (this.isSendingInProgress || this.formGroup.invalid) {
      return;
    }

    // -->Get: data
    const data = this.formGroup.getRawValue();
    // -->Start: loading
    this.isSendingInProgress = true;

    // -->Create: new user
    this.refreshSubs = this.eCommerceService.registerContactMessage(data).subscribe(
      (ok) => {
        // -->Done: loading
        this.isSendingInProgress = false;
        this.viewState = "success";
      },
      (err) => {
        // -->Set: error message
        this.errorMessage = "Oops, seems there was an issue submitting your message. Please try again in a few minutes while we work to resolve the issue.";
        // -->Done: loading
        this.isSendingInProgress = false;
        // -->Mark: as pristine
        this.formGroup.markAsPristine();
      },
    );
  }


  public ngOnDestroy(): void {
    this.subs.unsubscribe();
    if (this.refreshSubs) {
      this.refreshSubs.unsubscribe();
    }
  }
}
