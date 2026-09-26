import React from 'react';
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudSnow,
  Snowflake,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  CloudHail,
} from 'lucide-react';

interface WeatherIconProps {
  code: number;
  isDay?: number;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  isDay = 1,
  className = 'w-6 h-6',
  size = 24,
}) => {
  switch (code) {
    case 0:
      return isDay ? (
        <Sun size={size} className={`text-amber-400 animate-spin-slow ${className}`} />
      ) : (
        <Moon size={size} className={`text-indigo-300 ${className}`} />
      );
    case 1:
      return isDay ? (
        <Sun size={size} className={`text-amber-400 ${className}`} />
      ) : (
        <Moon size={size} className={`text-indigo-300 ${className}`} />
      );
    case 2:
      return isDay ? (
        <CloudSun size={size} className={`text-amber-300 ${className}`} />
      ) : (
        <CloudMoon size={size} className={`text-indigo-300 ${className}`} />
      );
    case 3:
      return <Cloud size={size} className={`text-slate-400 ${className}`} />;
    case 45:
    case 48:
      return <CloudFog size={size} className={`text-slate-300 ${className}`} />;
    case 51:
    case 53:
    case 55:
      return <CloudDrizzle size={size} className={`text-sky-400 ${className}`} />;
    case 56:
    case 57:
    case 66:
    case 67:
      return <CloudHail size={size} className={`text-cyan-300 ${className}`} />;
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return <CloudRain size={size} className={`text-blue-400 ${className}`} />;
    case 71:
    case 73:
      return <CloudSnow size={size} className={`text-sky-200 ${className}`} />;
    case 75:
    case 77:
    case 85:
    case 86:
      return <Snowflake size={size} className={`text-cyan-100 animate-pulse ${className}`} />;
    case 95:
    case 96:
    case 99:
      return <CloudLightning size={size} className={`text-amber-400 ${className}`} />;
    default:
      return <Cloud size={size} className={`text-slate-400 ${className}`} />;
  }
};
