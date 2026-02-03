'use client';

import { useState, useEffect } from 'react';
import PhoneInputWithCountry from 'react-phone-number-input';
import type { CountryCode } from 'libphonenumber-js';
import 'react-phone-number-input/style.css';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function PhoneInput({ value, onChange, placeholder }: PhoneInputProps) {
  const [defaultCountry, setDefaultCountry] = useState<CountryCode>('AE');

  // Auto-detect country on mount
  useEffect(() => {
    const detectCountry = async () => {
      try {
        // Using free IP geolocation API
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.country_code) {
          setDefaultCountry(data.country_code as CountryCode);
        }
      } catch (error) {
        // Default to UAE if detection fails
        console.log('Country detection failed, using default');
      }
    };
    detectCountry();
  }, []);

  return (
    <div className="phone-input-wrapper">
      <PhoneInputWithCountry
        international
        countryCallingCodeEditable={false}
        defaultCountry={defaultCountry}
        value={value}
        onChange={(newValue) => onChange(newValue || '')}
        placeholder={placeholder}
        className="phone-input-field"
      />
    </div>
  );
}
