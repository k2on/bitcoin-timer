"use client"

import { useState, useEffect } from 'react';

export default function Home() {
  const [hourlyRate, setHourlyRate] = useState<string>('');
  const [timer, setTimer] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [btcAmount, setBtcAmount] = useState<number>(0);

  // Function to toggle the timer on and off
  const toggleTimer = (): void => {
    setIsActive(!isActive);
  };

  // Effect hook to handle the timer functionality
  useEffect(() => {
    let interval: any;

    if (isActive) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, timer]);

  // Function to fetch the current USD to BTC conversion rate and calculate the BTC amount
  const fetchBtcRateAndCalculate = async (): Promise<void> => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
      const data = await response.json();
      const usdToBtcRate: number = 1 / data.bitcoin.usd;
      const earnedUsd: number = (timer / 3600) * parseFloat(hourlyRate);
      setBtcAmount(earnedUsd * usdToBtcRate);
    } catch (error) {
      console.error("Error fetching BTC rate:", error);
      setBtcAmount(0);
    }
  };

  // Effect hook to calculate the BTC amount whenever the timer stops
  useEffect(() => {
    if (!isActive && timer > 0) {
      fetchBtcRateAndCalculate();
    }
  }, [isActive, timer]);

  return (
    <div>
      <form>
        <label htmlFor="hourlyRate">Hourly Rate in USD:</label>
        <input
          id="hourlyRate"
          type="number"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
        />
      </form>
      <div>
        Timer: {Math.floor(timer / 3600)}h {Math.floor((timer % 3600) / 60)}m {timer % 60}s
        <button onClick={toggleTimer}>{isActive ? 'Stop' : 'Start'}</button>
      </div>
      {btcAmount > 0 && (
        <div>
          Earned BTC: {btcAmount.toFixed(8)} BTC
        </div>
      )}
    </div>
  );
};


