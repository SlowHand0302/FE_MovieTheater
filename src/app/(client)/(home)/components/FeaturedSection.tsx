import React from 'react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { StarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const FeaturedSection = () => {
    return (
        <section className="my-5">
            <header className="mb-2 flex justify-between items-center">
                <h1 className="font-bold text-[20px]">SECTION TITLE</h1>
                <div className="space-x-2 md:overflow-x-auto overflow-x-scroll hideScrollbar">
                    <Button variant={'outline'}>See More</Button>
                </div>
            </header>
            <Carousel
                opts={{
                    align: 'start',
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-2 lg:-ml-4">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <CarouselItem
                            key={index}
                            className="basis-1/2 grow pl-3 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-1/7"
                        >
                            <Link href={'/film/slug'} passHref>
                                <Card className="max-w-[253px] pt-0 relative">
                                    <CardHeader className="px-0 gap-0">
                                        <Image
                                            src="https://ui.shadcn.com/placeholder.svg"
                                            alt="Banner"
                                            className="aspect-video h-70 rounded-t-xl object-cover"
                                            height={280}
                                            width={253}
                                        />
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <CardTitle className="text-lg line-clamp-2">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, placeat
                                            quaerat! Obcaecati qui, aperiam incidunt quam voluptatum non sint odit totam
                                            autem, quibusdam quaerat quos voluptas accusantium molestias quasi amet!
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                            <Badge variant="outline">{new Date().toLocaleDateString('vi-VN')}</Badge>
                                            <Badge variant="outline">1h25m</Badge>
                                        </CardDescription>
                                        <CardDescription className="line-clamp-3">
                                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Assumenda, dolores
                                            ipsam. Consectetur quod et eos commodi earum dolor rerum iure aliquam
                                            consequatur, necessitatibus quis sequi! Nulla excepturi architecto ex
                                            culpa.{' '}
                                        </CardDescription>
                                    </CardContent>
                                    <div className="bg-primary/10 inline-flex gap-2 items-center absolute top-2 right-2 rounded-xl p-2">
                                        <StarIcon
                                            className={cn(
                                                'size-4 fill-amber-500 stroke-amber-500 dark:fill-amber-400 dark:stroke-amber-400',
                                            )}
                                        />
                                        <span className="font-bold text-sm">9.0</span>
                                    </div>
                                    <Badge variant="default" className="font-bold absolute top-2 left-2">
                                        T16
                                    </Badge>
                                </Card>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
            </Carousel>
        </section>
    );
};

export default FeaturedSection;
