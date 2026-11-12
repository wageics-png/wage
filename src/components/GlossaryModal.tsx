import React from 'react';
import {
  X,
  Shield,
  CheckCircle2,
  DollarSign,
  Smartphone,
  HardDrive,
  Lock,
  Layers,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface GlossaryModalProps {
  onClose: () => void;
  onOpenPostAd: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  onClose,
  onOpenPostAd,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#021f15] border border-[#d4af37]/40 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-900/60 bg-[#03261a]">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-base sm:text-lg font-bold text-white font-luxury">
              WAGE Marketplace Glossary & Platform Constitution
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-emerald-900/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-8">
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#03261a] border border-[#d4af37]/25 space-y-1">
              <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">Rule 01</span>
              <h4 className="text-sm font-bold text-white">Free Registration</h4>
              <p className="text-xs text-slate-300">
                WAGE never charges any registration fees to create an account or browse Pakistani listings.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#03261a] border border-[#d4af37]/25 space-y-1">
              <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">Rule 02</span>
              <h4 className="text-sm font-bold text-white">1 Free Ad / Month</h4>
              <p className="text-xs text-slate-300">
                Every verified Pakistani user receives 1 complimentary active advertisement every calendar month.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#03261a] border border-[#d4af37]/25 space-y-1">
              <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">Rule 03</span>
              <h4 className="text-sm font-bold text-white">Rs. 200 Paid Ad Fee</h4>
              <p className="text-xs text-slate-300">
                Additional listings cost a flat Rs. 200 fee verified via JazzCash, EasyPaisa, or Bank transfer.
              </p>
            </div>
          </div>

          {/* Section 1: Detailed Rulebook Comparison Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#f6e09e] uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#d4af37]" />
              Official Business & Payment Policy Matrix
            </h3>

            <div className="overflow-x-auto rounded-xl border border-emerald-900/80 bg-[#021810]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#032b1e] border-b border-emerald-800 text-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider">Feature</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider">WAGE Policy</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider">Implementation Mechanism</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950 text-slate-300">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Account Registration</td>
                    <td className="py-3 px-4 text-emerald-400 font-medium">100% Free Forever</td>
                    <td className="py-3 px-4">No subscription charges or recurring account fees.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Phone Verification</td>
                    <td className="py-3 px-4 text-[#f6e09e] font-medium">4-Digit SMS Carrier OTP</td>
                    <td className="py-3 px-4">Verified through real telecom gateway to prevent fake multi-account spam.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Free Advertisement</td>
                    <td className="py-3 px-4 text-emerald-400 font-medium">1 per calendar month</td>
                    <td className="py-3 px-4">Automatic monthly quota reset on the 1st of each calendar month.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Additional Advertisements</td>
                    <td className="py-3 px-4 text-[#f6e09e] font-mono font-bold">Rs. 200 each</td>
                    <td className="py-3 px-4">Submitted via JazzCash/EasyPaisa/Bank slip with Transaction ID (TID).</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Product & Vehicle Payments</td>
                    <td className="py-3 px-4 text-emerald-400 font-medium">Direct to Seller</td>
                    <td className="py-3 px-4">Physical hand-to-hand inspection or bank draft. No escrow hold.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Platform Commission</td>
                    <td className="py-3 px-4 text-emerald-400 font-medium">0% on item sales</td>
                    <td className="py-3 px-4">WAGE collects advertising maintenance fees only; zero sales cut.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Seller Phone Privacy</td>
                    <td className="py-3 px-4 text-slate-200">Consent-based display</td>
                    <td className="py-3 px-4">Shielded behind user click to stop automated web scrapers.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Device Protection</td>
                    <td className="py-3 px-4 text-emerald-400 font-medium">Server-Side Cloud Only</td>
                    <td className="py-3 px-4">Never uses user devices as distributed nodes or runs intrusive scans.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Technical Architecture & Device Safety */}
          <div className="p-5 rounded-xl bg-[#03261a]/70 border border-[#d4af37]/30 space-y-4">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-[#d4af37]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Production Architecture & Zero-Exploit Guarantee
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Regarding the "Rs. 0 Database" Architecture:</strong> A commercial nationwide marketplace cannot operate legitimately without cloud infrastructure costs. Free-tier cloud instances have traffic and storage ceilings. WAGE utilizes modern high-efficiency server-side databases (PostgreSQL/Firestore) managed on cloud nodes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-3 bg-[#021810] rounded-lg border border-emerald-950 space-y-1">
                <span className="text-[#d4af37] font-semibold block">Client Privacy</span>
                <p className="text-slate-400">User computers or smartphones are never utilized as hidden database nodes.</p>
              </div>

              <div className="p-3 bg-[#021810] rounded-lg border border-emerald-950 space-y-1">
                <span className="text-[#d4af37] font-semibold block">Admin Audit Trail</span>
                <p className="text-slate-400">Every Rs. 200 payment reference and admin approval is permanently logged.</p>
              </div>

              <div className="p-3 bg-[#021810] rounded-lg border border-emerald-950 space-y-1">
                <span className="text-[#d4af37] font-semibold block">Anti-Scam Protocols</span>
                <p className="text-slate-400">Advance token payment requests on WhatsApp are flagged and penalized.</p>
              </div>
            </div>
          </div>

          {/* Section 3: Official Payment Channels */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#f6e09e] uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#d4af37]" />
              Official WAGE Platform Fee Payment Accounts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 bg-[#03281c] rounded-xl border border-emerald-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">JazzCash Wallet</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">Corporate</span>
                </div>
                <p className="text-slate-300 font-mono">0301-8294711</p>
                <p className="text-[11px] text-slate-400">Title: WAGE Marketplace Pakistan</p>
              </div>

              <div className="p-4 bg-[#03281c] rounded-xl border border-emerald-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">EasyPaisa Wallet</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">Corporate</span>
                </div>
                <p className="text-slate-300 font-mono">0345-9876543</p>
                <p className="text-[11px] text-slate-400">Title: WAGE Services Ltd</p>
              </div>

              <div className="p-4 bg-[#03281c] rounded-xl border border-emerald-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Habib Bank Limited</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">1Link / Raast</span>
                </div>
                <p className="text-slate-300 font-mono text-[10px] break-all">PK36HABB00012345678901</p>
                <p className="text-[11px] text-slate-400">Title: WAGE Marketplace Ltd</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#03261a] border-t border-emerald-900/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            WAGE Marketplace Pakistan · Constitution v2.0
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenPostAd();
              }}
              className="px-4 py-2 bg-[#d4af37] hover:bg-[#e5c158] text-[#021f15] font-semibold text-xs rounded-lg transition-colors shadow-md"
            >
              Post Free Ad Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
