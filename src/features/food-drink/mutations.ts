import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/lib/apiClient';
import { FOOD_AND_DRINK_ENDPOINT } from './constants';
import { ApiResponse } from '@/types/ApiResponse.type';
import { FoodAndDrinkResultData } from './DTOs/GetFoodAndDrink.dto';

// Mutation for creating food and drink
export const useCreateFoodDrink = () => {
    return useMutation({
        mutationFn: async (data: FormData) => {
            return await apiClient.postWithFile<ApiResponse<FoodAndDrinkResultData>>(FOOD_AND_DRINK_ENDPOINT, data);
        },
    });
};

// Mutation for updating food and drink
export const useUpdateFoodDrink = () => {
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
            return await apiClient.putWithFile<ApiResponse<FoodAndDrinkResultData>>(
                `${FOOD_AND_DRINK_ENDPOINT}/${id}`,
                data,
            );
        },
    });
};

// Mutation for deleting food and drink
export const useDeleteFoodDrink = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            return await apiClient.delete<ApiResponse<null>>(`${FOOD_AND_DRINK_ENDPOINT}/${id}`);
        },
    });
};
