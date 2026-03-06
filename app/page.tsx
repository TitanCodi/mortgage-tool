"use client";
import { useState } from "react";

export default function Home() {
  const [loan, setLoan] = useState(300000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const [payment, setPayment] = useState<number | null>(null);

  function calculateMortgage() {
    const monthlyRate = rate / 100 / 12;
    const totalPayments = years * 12;

    const monthlyPayment =
      loan *
      (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);

    setPayment(monthlyPayment);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-10 flex flex-col items-center">

      <h1 className="text-4xl font-bold mb-3 text-center">
        Mortgage Payment Calculator
      </h1>

      <p className="text-gray-600 mb-10 text-center max-w-xl">
        Calculate your monthly mortgage payment instantly and see how much your
        home loan will cost over time.
      </p>

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">

        <div className="mb-4">
          <label className="block font-medium">Loan Amount ($)</label>
          <input
            type="number"
            value={loan}
            onChange={(e) => setLoan(Number(e.target.value))}
            className="w-full p-3 border rounded mt-1"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Interest Rate (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full p-3 border rounded mt-1"
          />
        </div>

        <div className="mb-6">
          <label className="block font-medium">Loan Term (Years)</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full p-3 border rounded mt-1"
          />
        </div>

        <button
          onClick={calculateMortgage}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Calculate Payment
        </button>

        {payment && (
          <div className="mt-8 bg-blue-50 p-6 rounded-lg text-center">
            <p className="text-gray-600">Estimated Monthly Payment</p>
            <p className="text-3xl font-bold text-blue-600">
              ${payment.toFixed(2)}
            </p>
          </div>
        )}

      </div>

    </main>
  );
}