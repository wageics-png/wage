import React from 'react';
import { X, Smartphone, CreditCard, Building, CheckCircle2, ArrowRight, ShieldCheck, Copy, Check } from 'lucide-react';

interface PaymentGuideModalProps {
  onClose: () => void;
}

export const PaymentGuideModal: React.FC<PaymentGuideModalProps> = ({ onClose }) => {
  const [copiedAccount, setCopiedAccount] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedAccount(key);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#021f15] border border-[#d4af37]/40 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-900/60 bg-[#03261a]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-base sm:text-lg font-bold text-white font-luxury">
              How to Pay WAGE Platform Ad Fee (Rs. 200)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-emerald-900/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Policy Banner */}
          <div className="p-4 bg-emerald-950/70 border border-[#d4af37]/30 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
              <strong className="text-white text-sm">WAGE Advertising Fee Policy</strong>
            </div>
            <p className="leading-relaxed">
              • <strong>1st Ad Every Month:</strong> 100% Free (Rs. 0) — published live immediately.<br />
              • <strong>Additional Ads (Unlimited):</strong> Rs. 200 flat fee per ad.<br />
              • <strong>When Does Your Ad Go Live?</strong> Your ad goes live immediately once our admin verifies that payment of Rs. 200 has been received into our official JazzCash, EasyPaisa, or Bank account.
            </p>
          </div>

          {/* Payment Routes */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#f6e09e] uppercase tracking-wider">
              Step-by-Step Payment Instructions
            </h3>

            {/* Route 1: JazzCash */}
            <div className="p-4 bg-[#03281c] border border-emerald-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-900 flex items-center justify-center text-[#d4af37]">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">Method 1: JazzCash</span>
                    <span className="text-[11px] text-emerald-400">Via JazzCash App or *786#</span>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard('03018294711', 'jc')}
                  className="px-2.5 py-1 rounded bg-[#021810] border border-emerald-700/60 text-[#f6e09e] hover:text-white flex items-center gap-1 text-[11px]"
                >
                  {copiedAccount === 'jc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedAccount === 'jc' ? 'Copied' : 'Copy Number'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-[#021810] rounded-lg border border-emerald-950 font-mono">
                <div>Account Number: <strong className="text-white">0301-8294711</strong></div>
                <div>Account Title: <strong className="text-[#f6e09e]">WAGE Marketplace Pakistan</strong></div>
                <div>Fee Amount: <strong className="text-emerald-400">Rs. 200</strong></div>
                <div>Purpose: <strong className="text-slate-300">Ad Listing Fee</strong></div>
              </div>

              <ol className="list-decimal list-inside space-y-1 text-slate-300 leading-normal">
                <li>Open your JazzCash Mobile App or dial <code className="text-[#f6e09e]">*786#</code>.</li>
                <li>Select <strong>Send Money</strong> &rarr; <strong>To Mobile Account</strong>.</li>
                <li>Enter recipient number: <code className="text-[#f6e09e]">0301-8294711</code> and amount: <code className="text-[#f6e09e]">200</code>.</li>
                <li>Verify recipient title is <strong>WAGE Marketplace Pakistan</strong> and confirm MPIN.</li>
                <li>Note down the <strong>TID (Transaction ID)</strong> from the SMS sent by 8558 (e.g., <code>JC-9928172635</code>).</li>
                <li>Paste this Reference Number / TID into your ad submission or edit form.</li>
              </ol>
            </div>

            {/* Route 2: EasyPaisa */}
            <div className="p-4 bg-[#03281c] border border-emerald-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-900 flex items-center justify-center text-[#d4af37]">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">Method 2: EasyPaisa</span>
                    <span className="text-[11px] text-emerald-400">Via EasyPaisa App or *786#</span>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard('03459876543', 'ep')}
                  className="px-2.5 py-1 rounded bg-[#021810] border border-emerald-700/60 text-[#f6e09e] hover:text-white flex items-center gap-1 text-[11px]"
                >
                  {copiedAccount === 'ep' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedAccount === 'ep' ? 'Copied' : 'Copy Number'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-[#021810] rounded-lg border border-emerald-950 font-mono">
                <div>Account Number: <strong className="text-white">0345-9876543</strong></div>
                <div>Account Title: <strong className="text-[#f6e09e]">WAGE Services Ltd</strong></div>
                <div>Fee Amount: <strong className="text-emerald-400">Rs. 200</strong></div>
                <div>Purpose: <strong className="text-slate-300">WAGE Ad Listing</strong></div>
              </div>

              <ol className="list-decimal list-inside space-y-1 text-slate-300 leading-normal">
                <li>Open EasyPaisa App and tap <strong>Send Money</strong> &rarr; <strong>EasyPaisa Transfer</strong>.</li>
                <li>Enter recipient: <code className="text-[#f6e09e]">0345-9876543</code> and amount: <code className="text-[#f6e09e]">Rs. 200</code>.</li>
                <li>Verify recipient name displays <strong>WAGE Services Ltd</strong> and complete transaction.</li>
                <li>Copy the <strong>Transaction ID (TID)</strong> from the EasyPaisa receipt SMS (3737).</li>
                <li>Enter this TID into WAGE for admin verification.</li>
              </ol>
            </div>

            {/* Route 3: Habib Bank / Raast Instant */}
            <div className="p-4 bg-[#03281c] border border-emerald-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-900 flex items-center justify-center text-[#d4af37]">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">Method 3: Bank Transfer / Raast</span>
                    <span className="text-[11px] text-emerald-400">Any Pakistani Bank Mobile App</span>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard('PK36HABB00012345678901', 'hbl')}
                  className="px-2.5 py-1 rounded bg-[#021810] border border-emerald-700/60 text-[#f6e09e] hover:text-white flex items-center gap-1 text-[11px]"
                >
                  {copiedAccount === 'hbl' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedAccount === 'hbl' ? 'Copied' : 'Copy IBAN'}</span>
                </button>
              </div>

              <div className="p-3 bg-[#021810] rounded-lg border border-emerald-950 font-mono space-y-1">
                <div>Bank: <strong className="text-white">Habib Bank Limited (HBL)</strong></div>
                <div className="break-all">IBAN: <strong className="text-white">PK36HABB00012345678901</strong></div>
                <div>Account Title: <strong className="text-[#f6e09e]">WAGE Marketplace Ltd</strong></div>
                <div>Amount: <strong className="text-emerald-400">Rs. 200</strong></div>
              </div>

              <p className="leading-relaxed">
                Send Rs. 200 via 1Link or Raast instant transfer from HBL, Meezan, UBL, MCB, Allied, Bank Alfalah, or any Pakistani bank. Enter the Bank Reference / Transaction Number in WAGE.
              </p>
            </div>
          </div>

          {/* Edit Anytime Highlight */}
          <div className="p-4 bg-[#021810] border border-emerald-900 rounded-xl space-y-1.5">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Can I pay later or edit my payment reference anytime?
            </h4>
            <p className="text-slate-300 leading-normal">
              <strong>Yes!</strong> You can create and save your advertisement at any time. If you haven't paid yet, your ad remains safely saved in your <strong>"My Ads"</strong> dashboard. Whenever you make the transfer, simply click <strong>"Edit Ad / Payment Ref"</strong>, enter your Transaction ID, and submit. The WAGE administrator checks that payment was received and immediately activates your ad live on the platform.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#03261a] border-t border-emerald-900/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#d4af37] hover:bg-[#e5c158] text-[#021f15] font-bold text-xs uppercase tracking-wider rounded-lg shadow-md"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
