"use client";

import { useState } from "react";

export default function Home() {

  const [loan, setLoan] = useState(300000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);

  const [payment, setPayment] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<any[]>([]);

  function calculateMortgage() {

    const monthlyRate = rate / 100 / 12;
    const payments = years * 12;

    const monthlyPayment =
      loan *
      (monthlyRate * Math.pow(1 + monthlyRate, payments)) /
      (Math.pow(1 + monthlyRate, payments) - 1);

    const totalPaid = monthlyPayment * payments;
    const interestPaid = totalPaid - loan;

    setPayment(monthlyPayment);
    setTotalInterest(interestPaid);
    setTotalCost(totalPaid);

    let balance = loan;
    let table = [];

    for (let month = 1; month <= payments; month++) {

      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;

      balance -= principal;

      table.push({
        month,
        payment: monthlyPayment,
        interest,
        principal,
        balance: balance > 0 ? balance : 0
      });

    }

    setSchedule(table);
  }

  return (

    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-10">

      <h1 className="text-4xl font-bold mb-2 text-center">
        Mortgage & Loan Comparison Calculator
      </h1>

      <p className="text-gray-600 mb-10 text-center">
        Instantly calculate your monthly mortgage payment.
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
              <p className="text-gray-500">Monthly Payment</p>
              <p className="text-3xl font-bold text-blue-600">
                ${payment.toFixed(2)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="bg-gray-100 p-4 rounded text-center">
                <p className="text-gray-500 text-sm">Total Interest</p>
                <p className="font-bold">
                  ${totalInterest?.toFixed(0)}
                </p>
              </div>

              <div className="bg-gray-100 p-4 rounded text-center">
                <p className="text-gray-500 text-sm">Total Cost</p>
                <p className="font-bold">
                  ${totalCost?.toFixed(0)}
                </p>
              </div>

            </div>

          </div>

        )}

      </div>

      {schedule.length > 0 && (

        <div className="mt-12 w-full max-w-4xl">

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