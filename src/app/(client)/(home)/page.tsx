'use client';

import FeaturedSection from './components/FeaturedSection';
import HeroBanner from './components/HeroBanner';

export default function Home() {
    return (
        <>
            <HeroBanner />
            {Array.from({ length: 2 }).map((_, index) => {
                return <FeaturedSection key={index} />;
            })}
        </>
    );
}
