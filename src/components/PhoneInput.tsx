'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  isSupportedCountry,
  validatePhoneNumberLength,
  type CountryCode,
} from 'libphonenumber-js';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function PhoneInput({ value, onChange, placeholder }: PhoneInputProps) {
  const [country, setCountry] = useState<CountryCode>('AE');
  const [isCountryListOpen, setIsCountryListOpen] = useState(false);
  const manualCountryChangeRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const countryNames = useMemo(
    () => new Intl.DisplayNames(['en'], { type: 'region' }),
    [],
  );

  const countries = useMemo(
    () =>
      getCountries()
        .filter((item) => isSupportedCountry(item))
        .map((item) => ({
          code: item,
          dialCode: `+${getCountryCallingCode(item)}`,
          name: countryNames.of(item) || item,
          flag: countryCodeToFlagEmoji(item),
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [countryNames],
  );

  const selectedDialCode = useMemo(() => `+${getCountryCallingCode(country)}`, [country]);
  const selectedFlag = useMemo(() => countryCodeToFlagEmoji(country), [country]);

  const formattedValue = useMemo(() => {
    if (!value) {
      return '';
    }

    const digits = value.replace(/\D/g, '');
    const dialDigits = selectedDialCode.replace(/\D/g, '');
    const nationalDigits = digits.startsWith(dialDigits)
      ? digits.slice(dialDigits.length)
      : digits;

    return formatPhoneByCountry(country, nationalDigits);
  }, [country, selectedDialCode, value]);

  useEffect(() => {
    const trySetCountry = (rawCountry: unknown) => {
      const candidate = typeof rawCountry === 'string' ? rawCountry.toUpperCase() : '';
      if (candidate && isSupportedCountry(candidate) && !manualCountryChangeRef.current) {
        setCountry(candidate);
        return true;
      }
      return false;
    };

    const localeCountry = navigator.language.split('-')[1] || '';
    trySetCountry(localeCountry);

    for (const locale of navigator.languages) {
      const localeParts = locale.split('-');
      if (trySetCountry(localeParts[1])) {
        break;
      }
    }

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

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsCountryListOpen(false);
      }
    };

    document.addEventListener('click', onDocumentClick);
    return () => {
      document.removeEventListener('click', onDocumentClick);
    };
  }, []);

  const handlePhoneInputChange = (nextValue: string) => {
    const digits = nextValue.replace(/\D/g, '');
    const dialDigits = selectedDialCode.replace(/\D/g, '');
    let nationalDigits = digits.startsWith(dialDigits) ? digits.slice(dialDigits.length) : digits;

    while (nationalDigits.length > 0) {
      const candidate = `${selectedDialCode}${nationalDigits}`;
      const lengthValidation = validatePhoneNumberLength(candidate, {
        defaultCountry: country,
      });

      if (lengthValidation !== 'TOO_LONG') {
        break;
      }

      nationalDigits = nationalDigits.slice(0, -1);
    }

    if (!nationalDigits) {
      onChange('');
      return;
    }

    const formatted = formatPhoneByCountry(country, nationalDigits);
    const normalized = formatted.replace(/\D/g, '');
    onChange(`+${normalized}`);
  };

  const selectCountry = (nextCountry: CountryCode) => {
    const currentDigits = value.replace(/\D/g, '');
    const currentDialDigits = selectedDialCode.replace(/\D/g, '');
    const nextDialDigits = getCountryCallingCode(nextCountry);
    const nationalDigits = currentDigits.startsWith(currentDialDigits)
      ? currentDigits.slice(currentDialDigits.length)
      : currentDigits;

    manualCountryChangeRef.current = true;
    setCountry(nextCountry);
    setIsCountryListOpen(false);

    if (nationalDigits) {
      onChange(`+${nextDialDigits}${nationalDigits}`);
    }
  };

  return (
    <div className="phone-input-wrapper" ref={rootRef}>
      <div className="phone-input-shell">
        <button
          type="button"
          className="phone-country-trigger"
          onClick={() => setIsCountryListOpen((open) => !open)}
          aria-expanded={isCountryListOpen}
          aria-label="Select country"
        >
          <span className="phone-country-flag">{selectedFlag}</span>
          <span className="phone-country-code">{selectedDialCode}</span>
          <span className="phone-country-arrow">v</span>
        </button>

        <input
          type="tel"
          value={formattedValue}
          onChange={(event) => handlePhoneInputChange(event.target.value)}
          placeholder={placeholder}
          className="phone-number-input"
          dir="ltr"
          inputMode="tel"
          autoComplete="tel"
        />
      </div>

      {isCountryListOpen && (
        <div className="phone-country-list" role="listbox">
          {countries.map((item) => (
            <button
              key={item.code}
              type="button"
              className="phone-country-option"
              onClick={() => selectCountry(item.code)}
              role="option"
              aria-selected={item.code === country}
            >
              <span className="phone-country-option-name">{item.name}</span>
              <span className="phone-country-option-meta">
                <span className="phone-country-option-code">{item.dialCode}</span>
                <span className="phone-country-option-flag">{item.flag}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function countryCodeToFlagEmoji(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

function formatPhoneByCountry(country: CountryCode, nationalDigits: string): string {
  const dialCode = getCountryCallingCode(country);
  const formatter = new AsYouType(country);
  return formatter.input(`+${dialCode}${nationalDigits}`);
}
