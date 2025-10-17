'use client';
import { Card } from '@/components/ui/card';
// import { FaStar, FaRegHeart, FaHeart } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
    name: string;
    sellPrice: number;
    originalPrice: number;
    promotion: string;
    gift: string;
}

const FilmCard = ({ content, className }: { content: string; className?: string }) => {
    return (
        <Link href={'/#'} passHref>
            <Card className={`flex flex-col space-y-3 p-3 ${className}`}>
                <Image src="https://ui.shadcn.com/placeholder.svg" alt="film banner" width={198} height={297} />

                <div className="space-y-0.5">
                    <h1 className="font-semibold">Product Name</h1>
                    <h4 className="font-thin text-[14px]">
                        <span>Price Sell</span> <span>Original Price</span>
                    </h4>
                    <p className="text-[12px]">Promotion</p>
                </div>
                <div className="h-10 rounded-lg bg-slate-200 p-1 text-[10px]">
                    <p>Gift</p>
                </div>
            </Card>
        </Link>
    );
};

export default FilmCard;
