import { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

export default function HeroBanner() {
    const [carouselAPI, setCarouselAPI] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const carouselPlugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
    useEffect(() => {
        if (!carouselAPI) {
            return;
        }
        setCurrent(carouselAPI.selectedScrollSnap());
        carouselAPI.on('select', () => {
            setCurrent(carouselAPI.selectedScrollSnap());
        });
    }, [carouselAPI]);

    return (
        <section className="flex items-center justify-center flex-col relative">
            <Carousel
                className="w-full"
                setApi={setCarouselAPI}
                opts={{ align: 'center', loop: true }}
                plugins={[carouselPlugin.current]}
            >
                <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={index}>
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex h-[376px] items-center justify-center p-6">
                                        <span className="text-4xl font-semibold">{index + 1}</span>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 translate-x-1/2" />
                <CarouselNext className="right-0 -translate-x-1/2" />
            </Carousel>
            <div className="rounded-xl absolute bottom-0 bg-slate-500 flex gap-2 p-1 -translate-y-1/2">
                {Array.from({ length: 5 }).map((item, index) => {
                    return (
                        <div
                            key={index}
                            className={`p-1 rounded-full bg-white transition-all ease-linear duration-100 ${
                                current === index ? 'w-4' : 'w-0'
                            }`}
                        ></div>
                    );
                })}
            </div>
        </section>
    );
}
