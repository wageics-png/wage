import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Smartphone,
  Building,
  Upload,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Save,
} from 'lucide-react';
import { CategoryId, ItemCondition, Listing, PaymentTransaction } from '../types';
import { CATEGORIES, PAKISTAN_CITIES } from '../data/mockData';

interface EditAdModalProps {
  listing: Listing;
  onClose: () => void;
  onSaveAd: (updatedListing: Listing, paymentUpdate?: Partial<PaymentTransaction>) => void;
  onOpenPaymentGuide: () => void;
}

export const EditAdModal: React.FC<EditAdModalProps> = ({
  listing,
  onClose,
  onSaveAd,
  onOpenPaymentGuide,
}) => {
  // Form fields
  const [title, setTitle] = useState(listing.title);
  const [category, setCategory] = useState<CategoryId>(listing.category);
  const [subcategory, setSubcategory] = useState(listing.subcategory);
  const [price, setPrice] = useState(listing.price.toString());
  const [priceType, setPriceType] = useState<'fixed' | 'negotiable'>(
    listing.priceType === 'fixed' ? 'fixed' : 'negotiable'
  );
  const [city, setCity] = useState(listing.city);
  const [area, setArea] = useState(listing.area);
  const [condition, setCondition] = useState<ItemCondition>(listing.condition);
  const [description, setDescription] = useState(listing.description);
  const [selectedImage, setSelectedImage] = useState(listing.imageUrl);

  // Payment Reference Fields
  const isPaidOrFreeLive = listing.status === 'live' && listing.adFeePaid === 0 && listing.paymentRef === 'FREE-MONTHLY-ALLOWANCE';
  const requiresPaymentRef = listing.status !== 'live';

  const [paymentMethod, setPaymentMethod] = useState<'JazzCash' | 'EasyPaisa' | 'Bank Transfer'>(
    listing.paymentMethod === 'EasyPaisa' || listing.paymentMethod === 'Bank Transfer'
      ? listing.paymentMethod
      : 'JazzCash'
  );
  const [referenceNo, setReferenceNo] = useState(
    listing.paymentRef && listing.paymentRef !== 'FREE-MONTHLY-ALLOWANCE' && listing.paymentRef !== 'PENDING-VERIFY'
      ? listing.paymentRef
      : ''
  );
  const [senderAccount, setSenderAccount] = useState(listing.seller.phone || '');
  const [slipAttached, setSlipAttached] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !price || !area.trim() || !description.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const numericPrice = parseFloat(price.replace(/[^0-9]/g, '')) || 0;

    const hasNewRef = referenceNo.trim().length > 0;
    const nextStatus =
      listing.status === 'live'
        ? 'live'
        : hasNewRef
        ? 'pending_verification'
        : 'pending_payment';

    const updatedListing: Listing = {
      ...listing,
      title: title.trim(),
      category,
      subcategory: subcategory.trim(),
      price: numericPrice,
      priceType,
      city,
      area: area.trim(),
      condition,
      description: description.trim(),
      imageUrl: selectedImage,
      status: nextStatus,
      paymentMethod: hasNewRef ? paymentMethod : listing.paymentMethod,
      paymentRef: hasNewRef ? referenceNo.trim() : listing.paymentRef,
    };

    let paymentUpdate: Partial<PaymentTransaction> | undefined;
    if (hasNewRef && nextStatus === 'pending_verification') {
      paymentUpdate = {
        adId: listing.id,
        adTitle: updatedListing.title,
        userId: listing.seller.id,
        userName: listing.seller.name,
        userPhone: listing.seller.phone,
        amount: 200,
        paymentMethod,
        transactionId: referenceNo.trim(),
        senderAccount: senderAccount.trim() || listing.seller.phone,
        submittedAt: 'Just now',
        status: 'pending',
        adminNotes: 'Updated payment reference submitted by customer. Awaiting admin check.',
      };
    }

    onSaveAd(updatedListing, paymentUpdate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#021f15] border border-[#d4af37]/40 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-900/60 bg-[#03261a]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white font-luxury">
              Edit Ad & Payment Reference
            </h2>
            <p className="text-xs text-slate-300">
              Update ad content anytime or submit your Rs. 200 fee Transaction ID to go live.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-emerald-900/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-950/60 border border-rose-600/50 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Ad Status Overview Card */}
          <div className="p-4 rounded-xl bg-[#03281c] border border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-slate-400 block text-[11px]">Current Status:</span>
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  listing.status === 'live'
                    ? 'text-emerald-400'
                    : listing.status === 'pending_verification'
                    ? 'text-amber-300'
                    : listing.status === 'pending_payment'
                    ? 'text-orange-400'
                    : 'text-rose-400'
                }`}
              >
                {listing.status === 'live'
                  ? 'Live on Marketplace'
                  : listing.status === 'pending_verification'
                  ? 'Payment Ref Submitted (Awaiting Admin Check)'
                  : listing.status === 'pending_payment'
                  ? 'Payment Pending (Rs. 200 Required to Go Live)'
                  : 'Payment Not Confirmed (Please update reference)'}
              </span>
            </div>

            <button
              type="button"
              onClick={onOpenPaymentGuide}
              className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-[#d4af37]/40 text-[#f6e09e] hover:text-white flex items-center gap-1.5 text-xs whitespace-nowrap self-start sm:self-center"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>How to Pay Guide</span>
            </button>
          </div>

          {/* PAYMENT REFERENCE SECTION (If not free monthly ad) */}
          {requiresPaymentRef && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/90 to-[#021f15] border border-[#d4af37]/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-sm font-bold text-white font-luxury">
                    WAGE Platform Listing Fee: Rs. 200
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#f6e09e] font-mono font-bold text-xs border border-[#d4af37]/40">
                  Rs. 200
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed text-[11px]">
                To activate this advertisement live on WAGE Pakistan, send Rs. 200 to our official account and enter your Transaction Reference Number (TID) below. Our admin will check that payment was received and approve your ad live immediately.
              </p>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-slate-200 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Select Where You Paid
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['JazzCash', 'EasyPaisa', 'Bank Transfer'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-2.5 rounded-lg border text-center transition-all ${
                        paymentMethod === method
                          ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f6e09e] font-semibold'
                          : 'bg-[#021810] border-emerald-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Account Reminder */}
              <div className="p-3 bg-[#021810] rounded-lg border border-emerald-950 text-[11px] font-mono text-slate-300">
                {paymentMethod === 'JazzCash' && (
                  <div>
                    JazzCash Account: <strong className="text-white">0301-8294711</strong> (Title: WAGE Marketplace Pakistan)
                  </div>
                )}
                {paymentMethod === 'EasyPaisa' && (
                  <div>
                    EasyPaisa Account: <strong className="text-white">0345-9876543</strong> (Title: WAGE Services Ltd)
                  </div>
                )}
                {paymentMethod === 'Bank Transfer' && (
                  <div>
                    HBL IBAN: <strong className="text-white">PK36HABB00012345678901</strong> (Title: WAGE Marketplace Ltd)
                  </div>
                )}
              </div>

              {/* Reference Number Input */}
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-200 font-semibold mb-1">
                    Enter Your Payment Reference / Transaction ID (TID) *
                  </label>
                  <input
                    type="text"
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    placeholder="e.g. JC-9928172635 or EP-1928374 or Bank Ref"
                    className="w-full px-3.5 py-2.5 bg-[#021c13] border border-emerald-800 rounded-lg text-sm text-[#f6e09e] font-mono focus:outline-none focus:border-[#d4af37]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Found in the confirmation SMS received from JazzCash (8558), EasyPaisa (3737), or your bank mobile app.
                  </span>
                </div>

                <div>
                  <label className="block text-slate-200 font-semibold mb-1">
                    Your Sender Mobile or Account Number
                  </label>
                  <input
                    type="text"
                    value={senderAccount}
                    onChange={(e) => setSenderAccount(e.target.value)}
                    placeholder="e.g. 0300 1234567"
                    className="w-full px-3.5 py-2.5 bg-[#021c13] border border-emerald-800 rounded-lg text-sm text-slate-100 font-mono focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="p-3 bg-[#021810] border border-dashed border-emerald-800 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-slate-300">
                      {slipAttached ? 'Payment slip screenshot verified' : 'Upload payment screenshot'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSlipAttached(!slipAttached)}
                    className="px-2.5 py-1 bg-emerald-800 text-white rounded text-xs"
                  >
                    {slipAttached ? 'Attached ✓' : 'Attach'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EDIT AD METADATA SECTION */}
          <div className="space-y-4 pt-2 border-t border-emerald-950">
            <h4 className="text-sm font-bold text-white font-luxury uppercase tracking-wider">
              Advertisement Content
            </h4>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Ad Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#03261a] border border-emerald-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#d4af37]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryId)}
                  className="w-full px-3.5 py-2 bg-[#03261a] border border-emerald-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#d4af37]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#021f15]">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subcategory</label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#03261a] border border-emerald-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Price (PKR) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#03261a] border border-emerald-800 rounded-lg text-sm text-[#f6e09e] font-mono focus:outline-none focus:border-[#d4af37]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">City in Pakistan</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#03261a] border border-emerald-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#d4af37]"
                >
                  {PAKISTAN_CITIES.filter((c) => c !== 'All Cities').map((c) => (
                    <option key={c} value={c} className="bg-[#021f15]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Area / Street / Sector *</label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#03261a] border border-emerald-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#d4af37]"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Detailed Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2 bg-[#03261a] border border-emerald-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#d4af37]"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-emerald-900/60 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#e5c158] hover:from-[#e5c158] hover:to-[#f3e5ab] text-[#021f15] font-bold text-xs uppercase tracking-wider rounded-lg shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes & Submit Ref</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
