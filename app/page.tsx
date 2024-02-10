"use client"

import { useState, useEffect } from 'react';

const Home: React.FC = () => {
  const [hourlyRate, setHourlyRate] = useState<string>('');
  const [timer, setTimer] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [btcAmount, setBtcAmount] = useState<number>(0);
  const [usdToBtcRate, setUsdToBtcRate] = useState<number>(0);

  // Function to toggle the timer on and off
  const toggleTimer = (): void => {
    setIsActive(!isActive);
  };

  // Effect hook to handle the timer functionality and update every 100 ms
  useEffect(() => {
    let interval: any;

    if (isActive) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 0.1); // Increment by 0.1 every 100 ms
        const earnedUsd: number = (timer / 3600) * parseFloat(hourlyRate);
        setBtcAmount(earnedUsd * usdToBtcRate);
      }, 100);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, timer, hourlyRate, usdToBtcRate]);

  // Effect hook to fetch the current USD to BTC conversion rate when the app loads or hourly rate changes
  useEffect(() => {
    const fetchBtcRate = async (): Promise<void> => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        setUsdToBtcRate(1 / data.bitcoin.usd);
      } catch (error) {
        console.error("Error fetching BTC rate:", error);
      }
    };

    fetchBtcRate();
  }, [hourlyRate]);

  return (
    <div className='h-screen flex justify-center items-center flex-col gap-y-4'>
        <div>
            <h1 className='text-6xl font-mono text-gray-200 w-[400px]'><span className='text-orange-500'>₿</span>{btcAmount.toFixed(8)}</h1>
        </div>
        <div className='text-center flex flex-col items-center gap-y-2'>
        <div className='text-xl text-gray-400'>
        
          <form className='flex gap-x-2'>
            <label htmlFor="hourlyRate">Hourly $</label>
            <input
                placeholder='00'
              className='bg-transparent border rounded-xl w-16 text-center'
              id="hourlyRate"
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
          </form>
        </div>
      <div className='text-xl text-gray-400'>
        Timer: {Math.floor(timer / 3600)}h {Math.floor((timer % 3600) / 60)}m {Math.floor(timer % 60)}s
      </div>
      <div>
        <button className='text-4xl' onClick={toggleTimer}>{isActive ? '🛑' : '⛏️'}</button>
      </div>
      </div>
    </div>
  );
};

export default Home;

