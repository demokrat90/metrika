'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  isSupportedCountry,
  validatePhoneNumberLength,
  type CountryCode,
  type Examples,
} from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';
import * as Flags from 'country-flag-icons/react/3x2';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function PhoneInput({ value, onChange, placeholder }: PhoneInputProps) {
  const [country, setCountry] = useState<CountryCode>('AE');
  const [isCountryListOpen, setIsCountryListOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const manualCountryChangeRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const countryListRef = useRef<HTMLDivElement>(null);

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
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [countryNames],
  );

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countries;
    const q = searchQuery.trim().toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.code.toLowerCase().includes(q),
    );
  }, [countries, searchQuery]);

  const selectedDialCode = useMemo(() => `+${getCountryCallingCode(country)}`, [country]);

  const dynamicPlaceholder = useMemo(() => getPlaceholderMask(country), [country]);

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

  // IP-based country detection
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

  // Click outside to close
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

  // Escape key to close dropdown
  useEffect(() => {
    if (!isCountryListOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCountryListOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isCountryListOpen]);

  // Auto-focus search & scroll to selected on open
  useEffect(() => {
    if (!isCountryListOpen) return;

    requestAnimationFrame(() => {
      searchInputRef.current?.focus();

      const selected = countryListRef.current?.querySelector(
        `[data-country="${country}"]`,
      );
      selected?.scrollIntoView({ block: 'center' });
    });
  }, [isCountryListOpen, country]);

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
    setSearchQuery('');

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
          onClick={() => {
            setIsCountryListOpen((open) => !open);
            setSearchQuery('');
          }}
          aria-expanded={isCountryListOpen}
          aria-label="Select country"
        >
          <FlagIcon code={country} className="phone-country-flag" />
          <span className="phone-country-code">{selectedDialCode}</span>
          <svg
            className={`phone-country-arrow${isCountryListOpen ? ' phone-country-arrow-open' : ''}`}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 4l4 4 4-4" />
          </svg>
        </button>

        <input
          type="tel"
          value={formattedValue}
          onChange={(event) => handlePhoneInputChange(event.target.value)}
          placeholder={dynamicPlaceholder || placeholder}
          className="phone-number-input"
          dir="ltr"
          inputMode="tel"
          autoComplete="tel"
        />
      </div>

      {isCountryListOpen && (
        <div className="phone-country-list" role="listbox" ref={countryListRef}>
          <div className="phone-country-search-wrapper">
            <input
              ref={searchInputRef}
              type="text"
              className="phone-country-search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {filteredCountries.length === 0 ? (
            <div className="phone-country-no-results">No results</div>
          ) : (
            filteredCountries.map((item) => (
              <button
                key={item.code}
                type="button"
                className="phone-country-option"
                data-country={item.code}
                onClick={() => selectCountry(item.code)}
                role="option"
                aria-selected={item.code === country}
              >
                <span className="phone-country-option-name">{item.name}</span>
                <span className="phone-country-option-meta">
                  <span className="phone-country-option-code">{item.dialCode}</span>
                  <FlagIcon code={item.code} className="phone-country-option-flag" />
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const FlagComponents = Flags as unknown as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>;

function FlagIcon({ code, className }: { code: string; className?: string }) {
  const Flag = FlagComponents[code];
  if (!Flag) return null;
  return <Flag className={className} />;
}

function formatPhoneByCountry(country: CountryCode, nationalDigits: string): string {
  const dialCode = getCountryCallingCode(country);
  const formatter = new AsYouType(country);
  return formatter.input(`+${dialCode}${nationalDigits}`);
}

function getPlaceholderMask(country: CountryCode): string {
  try {
    const example = getExampleNumber(country, examples as unknown as Examples);
    if (!example) return '';

    const formatter = new AsYouType(country);
    const formatted = formatter.input(example.number as string);
    return formatted.replace(/\d/g, '0');
  } catch {
    return '';
  }
}
