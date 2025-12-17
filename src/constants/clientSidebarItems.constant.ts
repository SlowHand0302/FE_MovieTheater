import { NavItem } from '@/types/NavItem.type';

export const sidebarItems: NavItem[] = [
    {
        name: 'Danh sách phim',
        url: '#',
        children: [
            {
                name: 'Phim đang chiếu',
                url: '/movie?status=showing',
            },
            {
                name: 'Phim sắp chiếu',
                url: '/movie?status=coming_soon',
            },
        ],
    },
    {
        name: 'Sự kiện và tin tức',
        url: '#',
    },
    {
        name: 'Danh sách rạp',
        url: '/cinema',
    },
];
