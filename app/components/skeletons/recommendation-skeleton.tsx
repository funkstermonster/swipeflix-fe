"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation if using App Router
import { Skeleton } from '@nextui-org/skeleton';
import { Card } from '@nextui-org/card';
import { facts } from '@/app/utils/facts'; // Adjust path as necessary

export default function LoadingPage() {
  const [fact, setFact] = useState<string>('');
  const router = useRouter();

  const getRandomFact = () => facts[Math.floor(Math.random() * facts.length)];

  useEffect(() => {
    setFact(getRandomFact());

    // Simulate a network request delay
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate delay
      router.push('/recommendation'); // Redirect to recommendations page
    };

    fetchData();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-5 text-center">
      <h1 className="text-2xl font-bold mb-4">We are preparing your recommended movies...</h1>
      <p className="mb-2">In the meantime, here's a random fact:</p>
      <div className="mb-4 text-lg">{fact}</div>

      {/* Container for the skeleton cards */}
      <div className="flex flex-wrap justify-center gap-4 w-full max-w-screen-lg">
        {/* First four cards */}
        {[1, 2, 3, 4].map((_, index) => (
          <Card key={index} className="w-60 h-80">
            <div className="p-4 flex flex-col space-y-4">
              <Skeleton className="h-48 w-full" /> {/* Placeholder for image */}
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-3/4" /> {/* Placeholder for title */}
                <Skeleton className="h-4 w-1/2" /> {/* Placeholder for description */}
              </div>
            </div>
          </Card>
        ))}
        {/* Fifth card */}
        <div className="w-full flex justify-center mt-4">
          <Card className="w-60 h-80">
            <div className="p-4 flex flex-col space-y-4">
              <Skeleton className="h-48 w-full" /> {/* Placeholder for image */}
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-3/4" /> {/* Placeholder for title */}
                <Skeleton className="h-4 w-1/2" /> {/* Placeholder for description */}
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <img src="/gif/loading-cat.gif" alt="Loading..." className="mt-4" />
    </div>
  );
}