import React, { useState, useContext } from 'react';
import { LanguageContext } from '../App';

const FinancialCalculator: React.FC = () => {
  const { t } = useContext(LanguageContext);
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(7);
  const [tenure, setTenure] = useState(5);
  const [emi, setEmi] = useState<string | null>(null);

  const calculateEmi = () => {
    const principal = loanAmount;
    const rate = interestRate / 12 / 100;
    const time = tenure * 12;
    if (principal > 0 && rate > 0 && time > 0) {
      const emiValue = (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
      setEmi(emiValue.toFixed(2));
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('Financial Tools')}</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{t('Loan EMI Calculator')}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Loan Amount (₹)')}</label>
            <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Annual Interest Rate (%)')}</label>
            <input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Loan Tenure (Years)')}</label>
            <input type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
          </div>
          <button onClick={calculateEmi} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700">{t('Calculate EMI')}</button>
          {emi && (
            <div className="text-center bg-gray-100 p-4 rounded-md">
              <p className="text-gray-600">{t('Your Estimated Monthly EMI is')}</p>
              <p className="text-3xl font-bold text-green-700">₹{emi}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialCalculator;