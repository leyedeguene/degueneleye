import React, { useState, useCallback, useMemo } from 'react';
import { FEED_ITEMS } from '../constants';
import FeedItemCard from './FeedItemCard';

const ChevronLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

const ChevronRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);


const CommunityFeed: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const itemPairs = useMemo(() => {
        const pairs = [];
        for (let i = 0; i < FEED_ITEMS.length; i += 2) {
            pairs.push(FEED_ITEMS.slice(i, i + 2));
        }
        return pairs;
    }, []);

    const goToPrevious = useCallback(() => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? itemPairs.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, itemPairs.length]);

    const goToNext = useCallback(() => {
        const isLastSlide = currentIndex === itemPairs.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, itemPairs.length]);
    
    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    return (
        <section className="py-12 md:py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold">L'actualité de la communauté</h2>
                    <p className="mt-2 text-lg text-gray-600">
                        Découvrez les derniers signalements et les campagnes à venir.
                    </p>
                </div>
                <div className="mt-10 max-w-5xl mx-auto relative group">
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform ease-in-out duration-500"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {itemPairs.map((pair, index) => (
                                <div key={index} className="flex-shrink-0 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {pair.map(item => (
                                        <FeedItemCard key={item.id} item={item} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <button 
                        onClick={goToPrevious} 
                        className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-12 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        aria-label="Previous slide"
                    >
                        <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
                    </button>
                    <button 
                        onClick={goToNext} 
                        className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-12 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        aria-label="Next slide"
                    >
                        <ChevronRightIcon className="h-6 w-6 text-gray-700" />
                    </button>

                    {/* Pagination Dots */}
                    <div className="flex justify-center space-x-2 mt-6">
                        {itemPairs.map((_, slideIndex) => (
                            <button
                                key={slideIndex}
                                onClick={() => goToSlide(slideIndex)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                    currentIndex === slideIndex ? 'bg-green-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                                aria-label={`Go to slide ${slideIndex + 1}`}
                                aria-current={currentIndex === slideIndex}
                            ></button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CommunityFeed;