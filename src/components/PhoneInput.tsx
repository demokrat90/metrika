'use client';

import { useEffect, useRef, useState } from 'react';
import PhoneInputWithCountry from 'react-phone-number-input';
import { validatePhoneNumberLength, type CountryCode } from 'libphonenumber-js';
import 'react-phone-number-input/style.css';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function PhoneInput({ value, onChange, placeholder }: PhoneInputProps) {
  const [country, setCountry] = useState<CountryCode>('FI');
  const manualCountryChangeRef = useRef(false);
  const MAX_E164_DIGITS = 15;

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) return;
        const data = await response.json();
        const detected = data?.country_code as CountryCode | undefined;
        if (detected && !manualCountryChangeRef.current) {
          setCountry(detected);
        }
      } catch {
        // Keep default country when detection is unavailable.
      }
    };
    detectCountry();
  }, []);

  return (
    <div className="phone-input-wrapper">
      <PhoneInputWithCountry
        international
        limitMaxLength
        countryCallingCodeEditable={false}
        country={country}
        onCountryChange={(nextCountry) => {
          manualCountryChangeRef.current = true;
          setCountry(nextCountry || 'FI');
        }}
        value={value}
        onChange={(newValue) => {
          const nextValue = newValue || '';

          if (nextValue && country) {
            const lengthValidation = validatePhoneNumberLength(nextValue, {
              defaultCountry: country,
            });
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
