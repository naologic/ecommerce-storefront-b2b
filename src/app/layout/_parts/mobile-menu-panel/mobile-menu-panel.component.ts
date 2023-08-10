import { Component, Input, TemplateRef } from "@angular/core";
import { LayoutMobileMenuService } from "../../layout-mobile-menu.service";
import { MyListsService } from "../../../services/my-lists.service";
import { appInfo$ } from "../../../../app.static";
import { Subscription } from "rxjs";
import { NaoUserAccessService } from "../../../nao-user-access";

@Component({
  selector: "app-mobile-menu-panel",
  templateUrl: "./mobile-menu-panel.component.html",
  styleUrls: ["./mobile-menu-panel.component.scss"],
})
export class MobileMenuPanelComponent {
  @Input() public level = 0;
  @Input() public label = "";
  @Input() public content: TemplateRef<any> | null = null;
  public infoSupport: any = {}
  public userData: any;
  public companyLogo: string;

  private subs = new Subscription();


  constructor(
    public menu: LayoutMobileMenuService,
    public myLists: MyListsService,
    private naoUsersService: NaoUserAccessService
  ) {
  }


  public ngOnInit(): void {
    this.subs.add(
      appInfo$.subscribe(value => {
        // -->Set: info
        this.infoSupport = {
          supportPhoneNumber: value?.shopInfo?.companyInformation?.data?.phoneNumber || '',
          supportEmailAddress: value?.shopInfo?.companyInformation?.data?.supportEmail || '',
          location: value?.shopInfo?.companyInformation?.data?.location || '',
          workingHours: value?.shopInfo?.companyInformation?.data?.workingHours || '',
          contactUs: value?.shopInfo?.navigationAndFooter?.data?.footerContactUs || '',
          ourGuarantee: value?.shopInfo?.navigationAndFooter?.data?.footerOurGuarantee || '',
        }

        // -->Set: companyLogo
        this.companyLogo = value?.shopInfo?.storefrontDisplay?.data?.companyLogo;
      })
    )

    // -->Subscribe: to userData
    this.subs.add(
      this.naoUsersService.userData.subscribe((userData) => {
        // -->Set: user data
        if (userData) {
          this.userData = userData;
        }
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
