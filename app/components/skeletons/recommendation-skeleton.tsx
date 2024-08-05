"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { Skeleton } from '@nextui-org/skeleton';
import { Card } from '@nextui-org/card';
import { facts } from '@/app/utils/facts';

export default function LoadingPage() {
  const [fact, setFact] = useState<string>('');
  const router = useRouter();

  const getRandomFact = () => facts[Math.floor(Math.random() * facts.length)];

  useEffect(() => {
    setFact(getRandomFact());


    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 3000)); 
      router.push('/recommendation'); 
    };

    fetchData();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center p-5 text-center">
      <h1 className="text-2xl font-bold mb-4">We are preparing your recommended movies...</h1>
      <p className="mb-2">In the meantime, here's a random fact:</p>
      <div className="mb-4 text-lg">{fact}</div> 
      <div className="flex flex-wrap justify-center gap-4 w-full max-w-screen-lg">
        {[1, 2, 3, 4].map((_, index) => (
          <Card key={index} className="w-60 h-80">
            <div className="p-4 flex flex-col space-y-4">
              <Skeleton className="h-48 w-full" /> 
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-3/4" /> 
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </Card>
        ))}

        <div className="w-full flex justify-center mt-4">
          <Card className="w-60 h-80">
            <div className="p-4 flex flex-col space-y-4">
              <Skeleton className="h-48 w-full" /> 
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </Card>
        </div>
      </div>
      <img src="/gif/loading-cat.gif" alt="Loading..." />
    </div>
  );
}
