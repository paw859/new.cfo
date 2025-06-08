import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Activity } from 'lucide-react';
import { fetchRiskData, RiskData } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

const RiskAssessment = () => {
  const [risks, setRisks] = useState<RiskData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getColorClass = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  useEffect(() => {
    const loadRiskData = async () => {
      try {
        setLoading(true);
        const data = await fetchRiskData();
        setRisks(data);
        setError(null);
      } catch (err) {
        setError('Failed to load risk assessment data');
        console.error('Error fetching risk data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRiskData();
    
    // Refresh risk data every 50 seconds
    const interval = setInterval(loadRiskData, 50000);
    return () => clearInterval(interval);
  }, []);

  const overallRiskScore = risks.length > 0 ? 
    Math.round(risks.reduce((sum, risk) => sum + risk.score, 0) / risks.length) : 0;

  const getRiskLevel = (score: number) => {
    if (score >= 70) return 'High';
    if (score >= 40) return 'Moderate';
    return 'Low';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Shield className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
        </div>
        <LoadingSpinner className="h-32" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Shield className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
        </div>
        <div className="text-red-600 text-center py-8">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Shield className="w-6 h-6 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
      </div>
      <div className="space-y-6">
        {risks.map((risk, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 hover:border-gray-300">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">{risk.category}</h4>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getColorClass(risk.level)}`}>
                {risk.level}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{risk.description}</p>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    risk.score >= 70 ? 'bg-red-500' : 
                    risk.score >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${risk.score}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700">{risk.score}/100</span>
            </div>
          </div>
        ))}
        <div className={`flex items-center justify-center p-4 rounded-lg border ${
          overallRiskScore >= 70 ? 'bg-red-50 border-red-200' :
          overallRiskScore >= 40 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
        }`}>
          <Activity className={`w-5 h-5 mr-2 ${
            overallRiskScore >= 70 ? 'text-red-600' :
            overallRiskScore >= 40 ? 'text-yellow-600' : 'text-green-600'
          }`} />
          <span className={`text-sm font-medium ${
            overallRiskScore >= 70 ? 'text-red-700' :
            overallRiskScore >= 40 ? 'text-yellow-700' : 'text-green-700'
          }`}>
            Overall Risk Score: {overallRiskScore}/100 ({getRiskLevel(overallRiskScore)})
          </span>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;