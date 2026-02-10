'use client';

import { useEffect, useRef, useState } from 'react';
import PhoneInputWithCountry from 'react-phone-number-input';
import { isSupportedCountry, validatePhoneNumberLength, type CountryCode } from 'libphonenumber-js';
import 'react-phone-number-input/style.css';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function PhoneInput({ value, onChange, placeholder }: PhoneInputProps) {
  const [country, setCountry] = useState<CountryCode>('FI');
  const manualCountryChangeRef = useRef(false);

  useEffect(() => {
    const trySetCountry = (rawCountry: unknown) => {
      const candidate = typeof rawCountry === 'string' ? rawCountry.toUpperCase() : '';
      if (candidate && isSupportedCountry(candidate) && !manualCountryChangeRef.current) {
        setCountry(candidate);
        return true;
      }
      return false;
    };

    const localeCountry = navigator.language.split('-')[1];
    trySetCountry(localeCountry);

    const detectCountry = async () => {
      const endpoints = [
        'https://ipapi.co/json/',
        'https://ipwho.is/',
        'https://ipinfo.io/json',
      ];

      try {
        for (const endpoint of endpoints) {
          const response = await fetch(endpoint);
          if (!response.ok) {
            continue;
          }

          const data = await response.json();
          if (
            trySetCountry(data?.country_code) ||
            trySetCountry(data?.country) ||
            trySetCountry(data?.countryCode)
          ) {
            break;
          }
        }
      } catch {
        // Keep fallback country when detection is unavailable.
      }
    };
    detectCountry();
  }, []);

  return (
    <div className="phone-input-wrapper">
      <PhoneInputWithCountry
        key={country}
        international
        limitMaxLength
        countryCallingCodeEditable={false}
        defaultCountry={country}
        onCountryChange={(nextCountry) => {
          manualCountryChangeRef.current = true;
          if (nextCountry) {
            setCountry(nextCountry);
          }
        }}
        value={value}
        onChange={(newValue) => {
          const nextValue = newValue || '';

          if (!nextValue) {
            onChange('');
            return;
          }

          let digits = nextValue.replace(/\D/g, '');

          if (nextValue && country) {
            while (digits.length > 0) {
              const candidate = `+${digits}`;
              const lengthValidation = validatePhoneNumberLength(candidate, {
                defaultCountry: country,
              });

              if (lengthValidation !== 'TOO_LONG') {
                break;
              }

              digits = digits.slice(0, -1);
            }
          }

          if (!digits) {
            onChange('');
            return;
          }

          onChange(`+${digits}`);
        }}
        placeholder={placeholder}
        className="phone-input-field"
      />
    </div>
  );
}
