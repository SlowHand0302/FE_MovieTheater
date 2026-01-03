import { NavItem } from '@/types/NavItem.type';
import {
    IconDashboard,
    IconChartBar,
    IconReport,
    IconCategory,
    IconMapPinCog,
    IconUserCog,
    IconHelp,
    IconSettings,
    IconMovie,
} from '@tabler/icons-react';
import { Hamburger } from 'lucide-react';

export const navMain: NavItem[] = [
    {
        name: 'Dashboard',
        url: '/admin/dashboard',
        icon: IconDashboard,
    },
    {
        name: 'Analytics',
        url: '#',
        icon: IconChartBar,
    },
    {
        name: 'Reports',
        url: '#',
        icon: IconReport,
    },
];

export const navSecondary: NavItem[] = [
    {
        name: 'Settings',
        url: '#',
        icon: IconSettings,
    },
    {
        name: 'Get Help',
        url: '#',
        icon: IconHelp,
    },
];

export const navManagement: NavItem[] = [
    {
        name: 'Cinema',
        url: '/admin/cinema',
        icon: IconMapPinCog,
    },
    {
        name: 'Movie',
        url: '/admin/movie',
        icon: IconMovie,
    },
    {
        name: 'Food&Drink',
        url: '/admin/food-drinks',
        icon: Hamburger,
    },
    {
        name: 'Categories',
        url: '#',
        icon: IconCategory,
        children: [
            {
                name: 'Seat Type',
                url: '/admin/seat-type',
            },
            {
                name: 'Room Type',
                url: '/admin/room-type',
            },
            {
                name: 'Movie Genre',
                url: '/admin/movie-genre',
            },
        ],
    },
    {
        name: 'Accounts',
        url: '#',
        icon: IconUserCog,
    },
];
