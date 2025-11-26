'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Minus, Popcorn } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFoodAndDrinkList } from '@/features/food-drink/queries';
import { FoodAndDrinkResultData } from '@/features/food-drink/DTOs/GetFoodAndDrink.dto';

export interface SelectedFoodDrink extends FoodAndDrinkResultData {
    quantity: number;
}

interface FoodDrinkSelectProps {
    selectedValues: SelectedFoodDrink[];
    onSelectionChange: (selected: SelectedFoodDrink[]) => void;
}

export default function FoodDrinkSelector({ onSelectionChange, selectedValues }: FoodDrinkSelectProps) {
    const { data = [], isLoading, isError } = useFoodAndDrinkList();
    const foodAndDrinks = data as FoodAndDrinkResultData[];

    const handleQuantityChange = (item: FoodAndDrinkResultData, newQty: number) => {
        if (newQty < 0) return;

        let updated: SelectedFoodDrink[];

        if (newQty === 0) {
            // Remove item if quantity becomes 0
            updated = selectedValues.filter((i) => i.id !== item.id);
        } else {
            // Update or add item
            const existing = selectedValues.find((i) => i.id === item.id);
            if (existing) {
                updated = selectedValues.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i));
            } else {
                updated = [...selectedValues, { ...item, quantity: newQty }];
            }
        }

        onSelectionChange(updated);
    };

    if (foodAndDrinks.length === 0)
        return <div className="py-8 text-center">No Food and Drink available for this date.</div>;
    if (isLoading) return <div className="py-8 text-center">Loading Foods and Drinks...</div>;
    if (isError) return <div className="py-8 text-center text-destructive">Loading Foods and Drinks Error</div>;

    return (
        <div className="space-y-3">
            {foodAndDrinks.map((combo) => {
                const selectedItem = selectedValues.find((i) => i.id === combo.id);
                const qty = selectedItem?.quantity ?? 0;

                return (
                    <Card
                        key={combo.id}
                        className="flex flex-row items-start gap-4 p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-center w-24 h-24rounded-lg bg-muted">
                            <Popcorn className="w-20 h-20" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-3">
                            <div>
                                <h3 className="font-semibold text-foreground">{combo.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {combo.type} - {combo.size}
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-primary">
                                    {combo.price.toLocaleString('vi-VN')} ₫
                                </span>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-9 w-9"
                                        onClick={() => handleQuantityChange(combo, qty - 1)}
                                        disabled={qty === 0}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>

                                    <Input
                                        type="text"
                                        value={qty}
                                        onChange={(e) => {
                                            const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                                            if (!isNaN(val)) handleQuantityChange(combo, val);
                                        }}
                                        className="w-16 text-center h-9"
                                    />

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-9 w-9"
                                        onClick={() => handleQuantityChange(combo, qty + 1)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
