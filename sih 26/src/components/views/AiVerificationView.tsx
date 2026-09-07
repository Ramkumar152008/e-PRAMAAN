import React from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  FileText, 
  TableProperties,
  Scale
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AiVerificationView: React.FC = () => {
  const { 
    selectedDepartment,
    selectedTender, 
    selectedBidder, 
    setActiveView 
  } = useApp();

  const extractedAttributes = [
    { field: 'Company Name', extractedValue: selectedBidder.name, sourceDocument: 'Bid Submission Form 1 & PAN Card' },
    { field: 'PAN', extractedValue: selectedBidder.pan, sourceDocument: 'PAN_Card_Copy.pdf' },
    { field: 'GSTIN', extractedValue: selectedBidder.gstin, sourceDocument: 'GST_Registration_Certificate_Form_REG-06.pdf' },
    { field: 'Declared Annual Turnover', extractedValue: `₹${selectedBidder.claimedTurnover} Crore (Average FY 2023-26)`, sourceDocument: 'CA_Certified_Turnover_Statement_FY23-26.pdf' },
    { field: 'PESO Safety Certificate Number', extractedValue: 'PESO-EX-2023-88912 (ATEX Zone-1 Flameproof)', sourceDocument: 'Petroleum_Safety_Certificate_PESO_ATEX.pdf' },
    { field: 'PESO Safety Issue Date', extractedValue: '01-Jan-2025', sourceDocument: 'Petroleum_Safety_Certificate_PESO_ATEX.pdf' },
    { field: 'PESO Safety Expiry Date', extractedValue: '05-Aug-2026', sourceDocument: 'Petroleum_Safety_Certificate_PESO_ATEX.pdf' },
    { field: 'OEM Name & Partner Token', extractedValue: 'Honeywell Enraf / Emerson (Token: PETRO-SENS-2026-MAF-8812)', sourceDocument: 'OEM_Manufacturer_Authorization_Letter.pdf' },
    { field: 'Make in India Local Content', extractedValue: '62.5% (Declared Class-I Local Supplier)', sourceDocument: 'Make_in_India_Local_Content_Declaration.pdf' }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Page Header (Section 10) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gem-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gem-navy">AI Document Analysis</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            The system extracts relevant information from submitted documents for comparison with tender requirements and verification sources.
          </p>
        </div>

        <button
          onClick={() => setActiveView('document-review')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold shadow-2xs transition self-start sm:self-center"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Documents</span>
        </button>
      </div>

      {/* ── Persistent Context Bar (Section 3 & 10) ── */}
      <div className="bg-white rounded-xl border border-gem-border shadow-gov p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-500 font-medium block">Department</span>
          <span className="font-bold text-gem-navy mt-0.5 block">{selectedDepartment}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Tender</span>
          <span className="font-mono font-bold text-gem-navy mt-0.5 block">{selectedTender.gemBidNo}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Bidder</span>
          <span className="font-bold text-gem-navy mt-0.5 block">{selectedBidder.name}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Bid ID</span>
          <span className="font-mono font-bold text-gem-blue mt-0.5 block">{selectedBidder.id}</span>
        </div>
      </div>

      {/* ── Extracted Values Table (Section 10) ── */}
      <div className="bg-white rounded-xl border border-gem-border shadow-gov overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-gem-border flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-gem-navy">
            <TableProperties className="w-4 h-4 text-gem-blue" />
            <span>Extracted Information Summary</span>
          </div>
          <span className="text-xs text-emerald-800 bg-emerald-100 border border-emerald-300 font-bold px-2 py-0.5 rounded">
            Extraction Complete (9 Key Parameters)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-gem-border">
                <th className="p-3.5">Extracted Field</th>
                <th className="p-3.5">Extracted Value</th>
                <th className="p-3.5">Source Document</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gem-border">
              {extractedAttributes.map((attr, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-bold text-gem-navy">
                    {attr.field}
                  </td>
                  <td className="p-3.5 font-semibold text-slate-800">
                    {attr.extractedValue}
                  </td>
                  <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                    {attr.sourceDocument}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statutory Decision Support Notice */}
      <div className="p-3.5 bg-slate-50 border-l-4 border-gem-blue rounded-r-lg flex items-start gap-3 text-xs text-slate-700">
        <Scale className="w-4 h-4 text-gem-blue flex-shrink-0 mt-0.5" />
        <span>
          <strong>Decision Support:</strong> AI extracts and structures data from submitted documents to assist the Procurement Officer. Final procurement decisions remain with the authorized Procurement Officer.
        </span>
      </div>

      {/* ── Primary Action Button (Section 10) ── */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={() => setActiveView('government-verification')}
          className="px-6 py-3 bg-gem-navy hover:bg-gem-navyLight text-white font-bold text-sm rounded-lg shadow-gov transition flex items-center gap-2"
        >
          <span>Continue to Government & Reference Verification</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
