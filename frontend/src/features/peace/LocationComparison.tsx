import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { LocationComparison as LocationComparisonType } from '../../types';
import { MapPin, TrendingUp, Home, DollarSign, Briefcase, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

export const LocationComparison: React.FC = () => {
  const [data, setData] = useState<LocationComparisonType | null>(null);
  const [loading, setLoading] = useState(true);
  const [expectedSalary, setExpectedSalary] = useState<number>(50000);

  useEffect(() => {
    loadLocations();
  }, [expectedSalary]);

  const loadLocations = async () => {
    setLoading(true);
    try {
      const res = await api.peace.getLocations(undefined, undefined, expectedSalary);
      if (res.data?.success && res.data.data) {
        setData(res.data.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            PEACE Location Intelligence
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compare cost of living, rental expenses, relocation investment, and net monthly savings across top regional hubs.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-500 font-medium">Assumed Monthly Income:</span>
          <input
            type="number"
            min="20000"
            max="300000"
            step="5000"
            value={expectedSalary}
            onChange={(e) => setExpectedSalary(parseFloat(e.target.value) || 50000)}
            className="w-28 px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-blue-600 text-xs"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs text-slate-500 mt-2">Computing cost-of-living models...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.cityComparisons.map((city) => (
            <div
              key={city.cityName}
              className={`p-6 rounded-2xl border shadow-sm transition-all flex flex-col justify-between ${
                city.isRemote
                  ? 'bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-950/30 dark:to-slate-900 border-blue-300 dark:border-blue-800 ring-2 ring-blue-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>{city.cityName}</span>
                    </h2>
                    <span className="text-[11px] text-slate-400">{city.state} • {city.tier}</span>
                  </div>
                  {city.isRemote && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Top Net Savings
                    </span>
                  )}
                </div>

                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Average 1BHK Rent:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      ₹{city.averageMonthlyRent.toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Living / Food Cost:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      ₹{city.monthlyLivingCost.toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Relocation Setup:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      ₹{city.estimatedRelocationCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Projected Net Savings:</span>
                    <span className="font-black text-emerald-600 text-sm">
                      ₹{city.projectedNetMonthlySavings.toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-xs">
                  <p className="text-[11px] font-semibold text-slate-500">Key Industries & Hubs:</p>
                  <p className="text-slate-700 dark:text-slate-300 mt-0.5 text-[11px]">{city.keyIndustries}</p>
                </div>

                <div className="mt-3 text-xs bg-slate-50 dark:bg-slate-800/30 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[11px]">
                  <strong>Why Suitable: </strong>{city.suitabilityReason}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Safety Notice */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs flex items-center space-x-2">
        <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span>
          Location benchmarks represent aggregate economic indices. Live employment vacancies vary by individual qualifications.
        </span>
      </div>
    </div>
  );
};
