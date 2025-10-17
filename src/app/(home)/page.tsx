'use client';

import FeaturedSection from './components/FeaturedSection';
import { Header } from './components/Header';
import HeroBanner from './components/HeroBanner';

export default function Home() {
    return (
        <>
            <Header></Header>
            <main className="my-3 mx-5 max-w-[1850px] 2xl:mx-auto">
                <HeroBanner />
                {Array.from({ length: 2 }).map((_, index) => {
                    return <FeaturedSection key={index} />;
                })}
            </main>
        </>
    );
}
