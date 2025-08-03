import React, { useState, useEffect } from 'react';

const Countdown = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    const timerComponents = [];
    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval] && interval !== 'seconds' && timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0) {
            return;
        }
        timerComponents.push(
            <div key={interval} className="text-center">
                <div className="text-4xl md:text-6xl font-bold text-indigo-600 dark:text-indigo-400">{timeLeft[interval]}</div>
                <div className="text-sm uppercase text-gray-500 dark:text-gray-400">{interval}</div>
            </div>
        );
    });

    return (
        <div className="flex justify-center items-center gap-4 md:gap-8">
            {timerComponents.length ? timerComponents : <span>Contest is about to begin!</span>}
        </div>
    );
};

export default Countdown;