'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';

import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';

export function EventSection() {
    const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

    return (
        <section className="w-full my-5">
            <header className="mb-0 flex justify-between items-center">
                <h1 className="font-bold text-4xl">Events</h1>
                <div className="space-x-2 md:overflow-x-auto overflow-x-scroll hideScrollbar">
                    <Button variant={'outline'}>See More</Button>
                </div>
            </header>
            <Carousel
                plugins={[plugin.current]}
                className="w-full py-4"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={index} className="basis-1/2 md:basis-1/4">
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <span className="text-4xl font-semibold">{index + 1}</span>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="translate-x-10" />
                <CarouselNext className="-translate-x-10" />
            </Carousel>
        </section>
    );
}
