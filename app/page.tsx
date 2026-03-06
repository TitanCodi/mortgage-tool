"use client";

import { useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function Home() {

  const [loan, setLoan] = useState(300000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const [extra, setExtra] = useState(0);

  const [payment, setPayment] = useState<number | null>(null);
  const [interestSaved, setInterestSaved] = useState<number | null>(null);
  const [yearsSaved, setYearsSaved] = useState<number | null>(null);

  const [schedule, setSchedule] = useState<any[]>([]);

  function calculateMortgage() {

    const monthlyRate = rate / 100 / 12;
    const payments = years * 12;

    const basePayment =
      loan *
      (monthlyRate * Math.pow(1 + monthlyRate, payments)) /
      (Math.pow(1 + monthlyRate, payments) - 1);

    const totalPaidOriginal = basePayment * payments;

    let balance = loan;
    let month = 0;
    let table = [];
    let totalPaid = 0;

    while (balance > 0 && month < 1000) {

      const interest = balance * monthlyRate;
      const principal = basePayment + extra - interest;

      balance -= principal;

      totalPaid += basePayment + extra;

      month++;

      table.push({
        month,
        payment: basePayment + extra,
        interest,
        principal,
        balance: balance > 0 ? balance : 0
      });

    }

    const totalInterestNew = totalPaid - loan;

    const interestSavedValue =
      (totalPaidOriginal - loan) - totalInterestNew;

    const yearsSavedValue =
      years - month / 12;

    setPayment(basePayment);
    setInterestSaved(interestSavedValue);
    setYearsSaved(yearsSavedValue);
    setSchedule(table);

  }

  return (

    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-10">

      <h1 className="text-4xl font-bold mb-2 text-center">
        Mortgage Payment Calculator
      </h1>

      <p className="text-gray-600 mb-10 text-center">
        Calculate your mortgage and see how extra payments reduce your loan.
      </p>

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl">

        <label className="block font-medium mb-1">Loan Amount ($)</label>
        <input
          type="number"
          value={loan}
          onChange={(e) => setLoan(Number(e.target.value))}
          className="w-full border p-3 rounded mb-4"
        />

        <label className="block font-medium mb-1">Interest Rate (%)</label>
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full border p-3 rounded mb-4"
        />

        <label className="block font-medium mb-1">Loan Term (Years)</label>
        <input
          type="number"
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="w-full border p-3 rounded mb-4"
        />

        <label className="block font-medium mb-1">
          Extra Monthly Payment ($)
        </label>

        <input
          type="number"
          value={extra}
          onChange={(e) => setExtra(Number(e.target.value))}
          className="w-full border p-3 rounded mb-6"
        />

        <button
          onClick={calculateMortgage}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Calculate
        </button>

        {payment && (

          <div className="mt-8 space-y-4">

            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <p className="text-gray-500">Base Monthly Payment</p>
              <p className="text-3xl font-bold text-blue-600">
                ${payment.toFixed(2)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="bg-gray-100 p-4 rounded text-center">
                <p className="text-gray-500 text-sm">Interest Saved</p>
                <p className="font-bold">
                  ${interestSaved?.toFixed(0)}
                </p>
              </div>

              <div className="bg-gray-100 p-4 rounded text-center">
                <p className="text-gray-500 text-sm">Years Saved</p>
                <p className="font-bold">
                  {yearsSaved?.toFixed(1)}
                </p>
              </div>

            </div>

          </div>

        )}

      </div>

      {schedule.length > 0 && (

        <div className="mt-12 w-full max-w-5xl">

          <h2 className="text-2xl font-bold mb-4 text-center">
            Loan Balance Over Time
          </h2>

          <div style={{ width: "100%", height: 300 }}>

            <ResponsiveContainer>

              <LineChart data={schedule}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={false}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

      )}

      {schedule.length > 0 && (

        <div className="mt-12 w-full max-w-5xl">

          <h2 className="text-2xl font-bold mb-4 text-center">
            Amortization Schedule
          </h2>

          <table className="w-full border border-gray-300">

            <thead className="bg-gray-100">

              <tr>
                <th className="p-2 border">Month</th>
                <th className="p-2 border">Payment</th>
                <th className="p-2 border">Interest</th>
                <th className="p-2 border">Principal</th>
                <th className="p-2 border">Balance</th>
              </tr>

            </thead>

            <tbody>

              {schedule.slice(0, 60).map((row, index) => (

                <tr key={index}>

                  <td className="p-2 border">{row.month}</td>
                  <td className="p-2 border">${row.payment.toFixed(2)}</td>
                  <td className="p-2 border">${row.interest.toFixed(2)}</td>
                  <td className="p-2 border">${row.principal.toFixed(2)}</td>
                  <td className="p-2 border">${row.balance.toFixed(2)}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </main>
  );
}