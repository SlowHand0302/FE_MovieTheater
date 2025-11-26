'use client';

import * as React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface PaymentMethod {
    id: string;
    label: string;
    description: string;
    icon?: React.ReactNode;
    promo?: string;
}

const paymentMethods: PaymentMethod[] = [
    //   {
    //     id: 'onepay',
    //     label: 'OnePay',
    //     description: 'OnePay - Visa, Master, JCB... / ATM / QR Ngân hàng / Apple Pay',
    //     promo: undefined,
    //   },
    //   {
    //     id: 'shopeepay',
    //     label: 'Ví ShopeePay',
    //     description: 'Ví ShopeePay - Giảm đến 20% tối đa 50K',
    //     promo: undefined,
    //   },
    {
        id: 'momo',
        label: 'Ví Điện Tử MoMo',
        description: 'Ví Điện Tử MoMo',
        promo: undefined,
    },
    {
        id: 'vnpay',
        label: 'VNPAY',
        description: '',
        promo: undefined,
    },
    {
        id: 'stripe',
        label: 'Stripe',
        description: '',
        promo: undefined,
    },
    //   {
    //     id: 'fundiin',
    //     label: 'Trả sau Fundiin',
    //     description: 'Trả sau Fundiin',
    //     promo: undefined,
    //   },
];

interface PaymentMethodTabProps {
    value: string;
    onValueChange: (value: string) => void;
}

export default function PaymentMethodTab({ value, onValueChange }: PaymentMethodTabProps) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">Phương thức thanh toán</h2>

            <RadioGroup value={value} onValueChange={onValueChange}>
                <div className="space-y-4">
                    {paymentMethods.map((method) => (
                        <Label
                            key={method.id}
                            htmlFor={method.id}
                            className="flex items-center gap-4 cursor-pointer rounded-lg border p-4 hover:bg-accent/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                        >
                            <RadioGroupItem value={method.id} id={method.id} className="mt-1" disabled />

                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                    {/* Placeholder for logo - replace with real <img> or SVG */}
                                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                        {method.id === 'shopeepay' && (
                                            <span className="text-orange-600 font-bold text-lg">S</span>
                                        )}
                                        {method.id === 'momo' && (
                                            <span className="text-pink-600 font-bold text-xl">mo</span>
                                        )}
                                        {method.id === 'vnpay' && (
                                            <span className="text-blue-600 font-bold text-xs">VNPAY</span>
                                        )}
                                        {method.id === 'fundiin' && (
                                            <span className="text-green-600 text-xs font-bold">Fundiin</span>
                                        )}
                                        {method.id === 'stripe' && (
                                            <span className="text-blue-700 font-bold text-xs">Stripe</span>
                                        )}
                                        {method.id === 'onepay' && (
                                            <div className="w-10 h-10 bg-gray-800 rounded-full" />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-semibold text-foreground">{method.label}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
                                        {method.promo && (
                                            <p className="text-sm font-bold text-green-600 mt-2">{method.promo}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Label>
                    ))}
                </div>
            </RadioGroup>

            {/* Footer Note */}
            {/* <Card className="bg-amber-50 border-amber-200">
        <div className="flex gap-3 p-4 text-sm text-amber-800">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            <span className="text-red-600">(*)</span> Bằng việc click/chạm vào{' '}
            <span className="font-bold">THANH TOÁN</span> bên phải, bạn đã xác nhận hiểu rõ các{' '}
            <span className="underline">Quy Định Giao Dịch Trực Tuyến</span> của Galaxy Cinema.
          </p>
        </div>
      </Card> */}
        </div>
    );
}
