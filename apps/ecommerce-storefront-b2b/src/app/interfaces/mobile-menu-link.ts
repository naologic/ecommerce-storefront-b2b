import { Link } from './link';

export interface MobileMenuLink extends Link {
    image?: string;
    submenu?: MobileMenuLink[];
}
