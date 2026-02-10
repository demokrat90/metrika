'use client';

import { useState, useEffect } from 'react';
import PhoneInputWithCountry from 'react-phone-number-input';
import { validatePhoneNumberLength, type CountryCode } from 'libphonenumber-js';
import 'react-phone-number-input/style.css';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function PhoneInput({ value, onChange, placeholder }: PhoneInputProps) {
  const [country, setCountry] = useState<CountryCode>('AE');
  const MAX_E164_DIGITS = 15;

  // Auto-detect country on mount
  useEffect(() => {
    const detectCountry = async () => {
      try {
        // Using free IP geolocation API
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.country_code) {
          setCountry(data.country_code as CountryCode);
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
        country={country}
        onCountryChange={(nextCountry) => {
          setCountry(nextCountry || 'AE');
        }}
        value={value}
        onChange={(newValue) => {
          const nextValue = newValue || '';

          if (nextValue && country) {
            const lengthValidation = validatePhoneNumberLength(nextValue, country);
            if (lengthValidation === 'TOO_LONG') {
              return;
            }
          }

          const digits = nextValue.replace(/\D/g, '');
          if (digits.length > MAX_E164_DIGITS) {
            return;
          }
          onChange(nextValue);
        }}
        placeholder={placeholder}
        className="phone-input-field"
      />
    </div>
  );
}
