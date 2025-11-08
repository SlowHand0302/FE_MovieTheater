import { Icon } from '@tabler/icons-react';
import { LucideIcon } from 'lucide-react';

export interface NavItem {
    name: string;
    url: string;
    icon?: Icon | LucideIcon;
    children?: NavItem[];
}
