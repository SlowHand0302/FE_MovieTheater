import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/apiClient';
import { FOOD_AND_DRINK_ENDPOINT } from './constants';
import { ApiResponse } from '@/types/ApiResponse.type';
import { FoodAndDrinkResultData } from './DTOs/GetFoodAndDrink.dto';

interface FoodAndDrinkQueryStrings {
    Id?: string;
    Type?: string;
    Name?: string;
    Size?: string;
}
export const useFoodAndDrinkList = (filters: Partial<Record<keyof FoodAndDrinkQueryStrings, string>> = {}) => {
    const queryString = new URLSearchParams(filters).toString();

    return useQuery({
        queryKey: ['foods-and-drinks', queryString],
        queryFn: () =>
            apiClient.get<ApiResponse<FoodAndDrinkResultData[]>>(
                `${FOOD_AND_DRINK_ENDPOINT}s${queryString ? `?${queryString}` : ''}`,
            ),
        select: (res) => res.data,
    });
};
