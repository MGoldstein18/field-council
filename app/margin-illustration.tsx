"use client";
import { useState } from "react";
export default function MarginIllustration() {
  const [revenue, setRevenue] = useState(2000000);
  const [points, setPoints] = useState(1);
  const dollars = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  return (
    <section className="margin-section">
      <div className="wrap margin-layout">
        <div>
          <p className="eyebrow">WHY THE NUMBERS DESERVE A CLOSER LOOK</p>
          <h2>
            What would one
            <br />
            margin point mean
            <br />
            <em>for your firm?</em>
          </h2>
          <p>
            On $2 million in revenue, one percentage point of operating margin
            is $20,000 a year. Use your own revenue below to see the difference
            a small change would make.
          </p>
          <p className="micro">
            Illustration only. Membership does not guarantee a financial
            improvement.
          </p>
        </div>
        <div className="margin-calculator">
          <div className="range-heading">
            <label htmlFor="revenue">Your annual revenue</label>
            <output htmlFor="revenue">{dollars.format(revenue)}</output>
          </div>
          <input
            id="revenue"
            type="range"
            min="500000"
            max="10000000"
            step="250000"
            value={revenue}
            onChange={(e) => setRevenue(Number(e.target.value))}
          />
          <div className="range-ends">
            <span>$500k</span>
            <span>$10m</span>
          </div>
          <div className="range-heading">
            <label htmlFor="points">An illustrative margin improvement</label>
            <output htmlFor="points">
              {points.toFixed(2).replace(/0$/, "")} percentage points
            </output>
          </div>
          <input
            id="points"
            type="range"
            min="0.25"
            max="2"
            step="0.25"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
          />
          <div className="range-ends">
            <span>0.25 points</span>
            <span>2 points</span>
          </div>
          <div className="margin-result" aria-live="polite">
            <span>ADDITIONAL ANNUAL OPERATING PROFIT</span>
            <strong>{dollars.format((revenue * points) / 100)}</strong>
            <small>
              {points}% × {dollars.format(revenue)} annual revenue
            </small>
          </div>
          <p className="calculator-price">
            Proposed annual membership <span>US$4,500 + travel</span>
          </p>
        </div>
      </div>
    </section>
  );
}
