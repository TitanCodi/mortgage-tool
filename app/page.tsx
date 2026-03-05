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
    <main className="min-h-screen bg-white flex flex-col items-center p-10">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Mortgage & Loan Comparison Calculator
      </h1>

      <p className="text-lg mb-8 text-center max-w-xl">
        Instantly calculate your monthly mortgage payment.
      </p>

      <div className="bg-gray-100 p-6 rounded-xl shadow-md w-full max-w-md">
        <label className="block mb-2 font-medium">Loan Amount ($)</label>
        <input
          type="number"
          value={loan}
          onChange={(e) => setLoan(Number(e.target.value))}
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-2 font-medium">Interest Rate (%)</label>
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-2 font-medium">Loan Term (Years)</label>
        <input
          type="number"
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="w-full p-2 mb-4 border rounded"
        />

        <button
          onClick={calculateMortgage}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Calculate
        </button>

        {payment && (
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold">Monthly Payment</p>
            <p className="text-3xl font-bold text-blue-600">
              ${payment.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
