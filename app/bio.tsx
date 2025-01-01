'use client';

export function Bio() {
  return (
    <div>
      <p className="text-gray-700 dark:text-gray-300 text-base -mt-3 mb-2">
        Builder, marketer, anthropologist.
      </p>
      <div className="flex items-center gap-2 text-sm">
        <span>I'm in:</span>
        <span className="flex items-center gap-2">
          <span role="img" aria-label="Taiwan">🇹🇼</span>
          <span>Taiwan</span>
        </span>
      </div>
    </div>
  );
}