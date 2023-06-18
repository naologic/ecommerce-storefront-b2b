import { Component, Input, OnInit } from "@angular/core";

export interface StatusInterface {
    text: string;
    colorClass: string;
}

export const statusesDefault: { [index: string]: StatusInterface } = {
    unpaid: {
        text: "Unpaid",
        colorClass: "badge-danger",
    },
    paid: {
        text: "paid",
        colorClass: "badge-success",
    },
    empty: {
        text: "empty",
        colorClass: "badge-grey",
    },
    'awaiting-fulfillment': {
        text: "Awaiting Fulfillment",
        colorClass: "badge-secondary-500",
    },
    'awaiting-shipment': {
        text: "Awaiting Shipment",
        colorClass: "badge-secondary-200",
    },
    'awaiting-pickup': {
        text: "Awaiting Pickup",
        colorClass: "badge-secondary-300",
    },
    'partially-shipped': {
        text: "Partially Shipped",
        colorClass: "badge-purple",
    },
    'shipped': {
        text: "Shipped",
        colorClass: "badge-secondary-500",
    },
    'completed': {
        text: "Completed",
        colorClass: "badge-success",
    },
    'pending-approval': {
        text: "Pending Approval",
        colorClass: "badge-warning",
    },
    'approved': {
        text: "Approved",
        colorClass: "badge-success",
    },
    'processing': {
        text: "Processing",
        colorClass: "badge-purple",
    },
    'complete': {
        text: "Complete",
        colorClass: "badge-success",
    },
    'canceled': {
        text: "Canceled",
        colorClass: "badge-magenta",
    },
    'backordered': {
        text: "Backordered",
        colorClass: "badge-magenta",
    },
};

@Component({
    selector: "nao-status-pill",
    templateUrl: "./nao-status-pill.component.html",
})
export class NaoStatusPillComponent implements OnInit {
    /**
     * Example of usage with text
     * <nao-status-pill text="paid"></nao-status-pill>
     */
    @Input() public text!: string;
    /**
     * We can either display the values as pills or as a text joined by a `,`
     */
    @Input() public displayAs: "pill" | "text" = "pill";
    /**
     * Local vars
     */
    public status$!: StatusInterface;
    public statusesDefault: { [index: string]: StatusInterface } = statusesDefault;

    public ngOnInit(): void {
        // -->Refresh
        this.refreshStatus();
    }

    /**
     * Re-set status
     */
    public refreshStatus(): void {
        if (!this.statusesDefault[this.text]) {
            // -->Set: value
            this.status$ = { text: this.text, colorClass: "badge-grey" };
        } else {
            this.status$ = this.statusesDefault[this.text] || this.statusesDefault['empty'];
        }
    }
}
