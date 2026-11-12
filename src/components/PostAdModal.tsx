import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Upload,
  Smartphone,
  ShieldCheck,
  CreditCard,
  Building,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { CategoryId, ItemCondition, Listing, PaymentTransaction, UserAccount } from '../types';
import { CATEGORIES, PAKISTAN_CITIES } from '../data/mockData';

interface PostAdModalProps {
  currentUser: UserAccount;
  onClose: () => void;
  onSubmitAd: (newAd: Partial<Listing>, paymentDetails?: Partial<PaymentTransaction>) => void;
  onVerifyPhone: (phone: string) => void;
  onOpenPaymentGuide?: () => void;
}

export const PostAdModal: React.FC<PostAdModalProps> = ({
  currentUser,
  onClose,
  onSubmitAd,
  onVerifyPhone,
  onOpenPaymentGuide,
}) => {
  // Step state: 1 = Details, 2 = Phone OTP (if not verified), 3 = Fee & Payment (if > 1 ad), 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSavedAsDraft, setIsSavedAsDraft] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('motors');
  const [subcategory, setSubcategory] = useState('Cars');
  const [price, setPrice] = useState('');
  const [priceType, setPriceType] = useState<'fixed' | 'negotiable'>('negotiable');
  const [city, setCity] = useState(currentUser.city || 'Islamabad');
  const [area, setArea] = useState('');
  const [condition, setCondition] = useState<ItemCondition>('Used - Like New');
  const [description, setDescription] = useState('');
  const [selectedPresetImage, setSelectedPresetImage] = useState(
    '/src/assets/images/wage_motors_sedan_1794469920565.jpg'
  );

  // OTP Verification state
  const [phoneInput, setPhoneInput] = useState(currentUser.phone);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('7864');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpVerified, setOtpVerified] = useState(currentUser.isPhoneVerified);

  // Payment states for extra ad (Rs. 200)
  const isFreeAd = currentUser.freeAdsRemainingThisMonth > 0;
  const [paymentMethod, setPaymentMethod] = useState<'JazzCash' | 'EasyPaisa' | 'Bank Transfer'>('JazzCash');
  const [senderAccount, setSenderAccount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [slipAttached, setSlipAttached] = useState(true);

  const [formError, setFormError] = useState('');

  // Handle send OTP
  const handleSendOtp = () => {
    if (!phoneInput || phoneInput.length < 10) {
      setFormError('Please enter a valid Pakistani mobile number (+92 3XX XXXXXXX)');
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setFormError('');
  };

  const handleVerifyOtp = () => {
    if (otpCode === generatedOtp || otpCode === '7864' || otpCode === '1234') {
      setOtpVerified(true);
      onVerifyPhone(phoneInput);
      setFormError('');
      // Continue to next step
      if (isFreeAd) {
        handleFinalSubmit(true, false);
      } else {
        setStep(3);
      }
    } else {
      setFormError('Invalid OTP code. Please enter the 4-digit code shown in the simulation.');
    }
  };

  const handleProceedFromDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !area.trim() || !description.trim()) {
      setFormError('Please fill out all required fields.');
      return;
    }
    setFormError('');

    if (!otpVerified) {
      setStep(2);
    } else if (isFreeAd) {
      handleFinalSubmit(true, false);
    } else {
      setStep(3);
    }
  };

  const handleFinalSubmit = (asFree: boolean, payLater: boolean = false) => {
    const numericPrice = parseFloat(price.replace(/[^0-9]/g, '')) || 0;
    const hasTid = Boolean(transactionId.trim());

    setIsSavedAsDraft(payLater);

    const newAd: Partial<Listing> = {
      title: title.trim(),
      category,
      subcategory: subcategory.trim(),
      price: numericPrice,
      priceType,
      city,
      area: area.trim(),
      condition,
      description: description.trim(),
      imageUrl: selectedPresetImage,
      seller: {
        id: currentUser.id,
        name: currentUser.name,
        phone: currentUser.phone,
        verified: otpVerified,
        city,
        memberSince: 'Today',
        rating: 5.0,
        totalAds: 1,
        hidePhoneUntilConsent: true,
      },
      status: asFree
        ? 'live'
        : payLater
        ? 'pending_payment'
        : hasTid
        ? 'pending_verification'
        : 'pending_payment',
      postedAt: 'Just now',
      views: 1,
      likes: 0,
      adFeePaid: asFree ? 0 : 200,
      paymentMethod: asFree ? 'Free Allowance' : paymentMethod,
      paymentRef: asFree ? 'FREE-MONTHLY-ALLOWANCE' : hasTid ? transactionId.trim() : undefined,
    };

    let paymentData: Partial<PaymentTransaction> | undefined;
    if (!asFree && !payLater && hasTid) {
      paymentData = {
        adTitle: title.trim(),
        userId: currentUser.id,
        userName: currentUser.name,
        userPhone: currentUser.phone,
        amount: 200,
        paymentMethod,
        transactionId: transactionId.trim(),
        senderAccount: senderAccount.trim() || currentUser.phone,
        submittedAt: 'Just now',
        status: 'pending',
        adminNotes: 'Submitted via customer ad flow. Awaiting admin check.',
      };
    }

    onSubmitAd(newAd, paymentData);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#021f15] border border-[#d4af37]/40 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-900/60 bg-[#03261a]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <h2 className="text-base font-bold text-white font-luxury">
              Post New Advertisement · WAGE Pakistan
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-emerald-900/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-[#021810] border-b border-emerald-950 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 1 ? 'bg-[#d4af37] text-[#021f15]' : 'bg-emerald-950 text-slate-400'
              }`}
            >
              1
            </span>
            <span className={step >= 1 ? 'text-[#f6e09e] font-medium' : 'text-slate-500'}>Ad Details</span>
          </div>
          <div className="w-8 h-px bg-emerald-900" />
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 2 ? 'bg-[#d4af37] text-[#021f15]' : 'bg-emerald-950 text-slate-400'
              }`}
            >
              2
            </span>
            <span className={step >= 2 ? 'text-[#f6e09e] font-medium' : 'text-slate-500'}>Phone OTP</span>
          </div>
          <div className="w-8 h-px bg-emerald-900" />
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 3 ? 'bg-[#d4af37] text-[#021f15]' : 'bg-emerald-950 text-slate-400'
              }`}
            >
              3
            </span>
            <span className={step >= 3 ? 'text-[#f6e09e] font-medium' : 'text-slate-500'}>
              {isFreeAd ? 'Free Allowance' : 'Fee (Rs. 200)'}
            </span>
          </div>
        </div>

        {formError && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-950/60 border border-rose-600/50 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Modal Step Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: Details */}
          {step === 1 && (
            <form onSubmit={handleProceedFromDetails} className="space-y-4">
              {/* Fee Notice Banner */}
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-[#d4af37]/30 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#f6e09e]">Monthly Free Allowance Status: </span>
                  <span className="text-slate-300">
                    {isFreeAd
                      ? 'You have 1 FREE advertisement remaining this calendar month.'
                      : 'You have used your free ad. Additional ads cost Rs. 200 platform fee.'}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#d4af37]/20 text-[#f6e09e] font-bold border border-[#d4af37]/40">
                  {isFreeAd ? 'Rs. 0 / Free' : 'Rs. 200 Fee'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1">
                  Ad Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Honda Civic RS Turbo 2022 Oriel or iPhone 15 Pro Max"
                  className="w-full px-3.5 py-2.5 bg-[#03261a] border border-emerald-800/80 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-[#d4af37]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value as CategoryId);
                      // Auto pick relevant image preset
                      if (e.target.value === 'motors') {
                        setSelectedPresetImage('/src/assets/images/wage_motors_sedan_1794469920565.jpg');
                      } else if (e.target.value.includes('property')) {
                        setSelectedPresetImage('/src/assets/images/wage_property_villa_1794469922026.jpg');
                      } else if (e.target.value === 'mobiles' || e.target.value === 'computers') {
                        setSelectedPresetImage('/src/assets/images/wage_tech_devices_1794469921436.jpg');
                      } else {
                        setSelectedPresetImage('/src/assets/images/wage_hero_showcase_1794469920765.jpg');
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-[#03261a] border border-emerald-800/80 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-[#d4af37]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#021f15]">
                        {c.name} ({c.urduName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1">
                    Subcategory / Model
                  </label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="e.g. Sedan, Plot, Laptop, Handbag"
                    className="w-full px-3.5 py-2.5 bg-[#03261a] border border-emerald-800/80 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1">
                    Price in PKR (Pakistani Rupee) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-[#d4af37] font-semibold">PKR</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 4500000"
                      className="w-full pl-12 pr-3.5 py-2.5 bg-[#03261a] border border-emerald-800/80 rounded-lg text-sm text-slate-100 font-mono focus:outline-none focus:border-[#d4af37]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1">
                    Price Terms
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPriceType('negotiable')}
                      className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                        priceType === 'negotiable'
                          ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f6e09e]'
                          : 'bg-[#03261a] border-emerald-800/60 text-slate-300'
                      }`}
                    >
                      Negotiable
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriceType('fixed')}
                      className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                        priceType === 'fixed'
                          ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f6e09e]'
                          : 'bg-[#03261a] border-emerald-800/60 text-slate-300'
                      }`}
                    >
                      Fixed Price
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1">
                    City in Pakistan *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#03261a] border border-emerald-800/80 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-[#d4af37]"
                  >
                    {PAKISTAN_CITIES.filter((c) => c !== 'All Cities').map((c) => (
                      <option key={c} value={c} className="bg-[#021f15]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1">
                    Area / Sector / Street *
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. DHA Phase 5, F-7/2, Gulberg"
                    className="w-full px-3.5 py-2.5 bg-[#03261a] border border-emerald-800/80 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-[#d4af37]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1">
                  Item Condition
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Brand New', 'Used - Like New', 'Used - Good', 'Used - Fair'] as ItemCondition[]).map(
                    (cond) => (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => setCondition(cond)}
                        className={`py-2 text-xs font-medium rounded-lg border transition-all text-center ${
                          condition === cond
                            ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f6e09e]'
                            : 'bg-[#03261a] border-emerald-800/60 text-slate-300'
                        }`}
                      >
                        {cond}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1">
                  Detailed Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Provide honest details regarding condition, accessories, registration status, warranty, and physical inspection venue..."
                  className="w-full px-3.5 py-2.5 bg-[#03261a] border border-emerald-800/80 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-[#d4af37]"
                  required
                />
              </div>

              {/* Photo Showcase Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  Advertisement Photography
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { path: '/src/assets/images/wage_motors_sedan_1794469920565.jpg', label: 'Motors / Car' },
                    { path: '/src/assets/images/wage_property_villa_1794469922026.jpg', label: 'Property / Villa' },
                    { path: '/src/assets/images/wage_tech_devices_1794469921436.jpg', label: 'Tech / Mobile' },
                    { path: '/src/assets/images/wage_hero_showcase_1794469920765.jpg', label: 'General Goods' },
                  ].map((img) => (
                    <button
                      key={img.path}
                      type="button"
                      onClick={() => setSelectedPresetImage(img.path)}
                      className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                        selectedPresetImage === img.path
                          ? 'border-[#d4af37] ring-2 ring-[#d4af37]/30 scale-[1.02]'
                          : 'border-emerald-900/60 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.path} alt={img.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] text-white font-medium text-center p-1">
                        {img.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#e5c158] hover:from-[#e5c158] hover:to-[#f3e5ab] text-[#021f15] font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 shadow-md"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Phone Verification (4-Digit SMS OTP) */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <Smartphone className="w-10 h-10 text-[#d4af37] mx-auto" />
                <h3 className="text-base font-bold text-white font-luxury">
                  4-Digit SMS OTP Verification
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  As per WAGE security policy, every listing requires real phone-number ownership verification. An in-app inbox alone cannot securely verify phone ownership.
                </p>
              </div>

              <div className="p-4 bg-[#03261a] border border-emerald-900/80 rounded-xl space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Pakistani Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="flex-1 px-3.5 py-2.5 bg-[#021c13] border border-emerald-800 rounded-lg text-sm text-slate-100 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap"
                    >
                      {otpSent ? 'Resend SMS' : 'Send 4-Digit OTP'}
                    </button>
                  </div>
                </div>

                {otpSent && (
                  <div className="pt-2 space-y-3">
                    <div className="p-3 rounded-lg bg-emerald-950/80 border border-[#d4af37]/30 text-xs text-emerald-200">
                      <span className="font-semibold text-[#f6e09e]">SMS Carrier Simulator: </span>
                      SMS delivered to {phoneInput} with 4-digit code: <strong className="font-mono text-white text-sm bg-black/40 px-2 py-0.5 rounded">{generatedOtp}</strong>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1">
                        Enter 4-Digit Code
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="e.g. 7864"
                        className="w-full px-3.5 py-2.5 bg-[#021c13] border border-emerald-800 rounded-lg text-center tracking-[0.5em] font-mono text-lg font-bold text-[#f6e09e]"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  &larr; Back to Details
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={!otpSent}
                  className="px-6 py-2.5 bg-[#d4af37] disabled:opacity-50 hover:bg-[#e5c158] text-[#021f15] font-bold text-xs uppercase tracking-wider rounded-lg shadow-md"
                >
                  Verify & Proceed
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Fee Payment (Rs. 200 for extra ad) */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Additional Advertisement Fee
                  </span>
                  <span className="text-base font-bold font-mono text-[#f6e09e]">Rs. 200</span>
                </div>
                <p className="text-xs text-slate-300">
                  Registration is free. 1 free ad is granted every calendar month. You have utilized your monthly allowance. Additional advertisements cost Rs. 200 platform listing fee verified by our admin desk.
                </p>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Select Advertising Payment Route
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('JazzCash')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'JazzCash'
                        ? 'bg-emerald-900/60 border-[#d4af37] text-[#f6e09e]'
                        : 'bg-[#03261a] border-emerald-900 text-slate-300'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mx-auto mb-1 text-[#d4af37]" />
                    <span className="text-xs font-bold block">JazzCash</span>
                    <span className="text-[10px] text-slate-400">Mobile Wallet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('EasyPaisa')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'EasyPaisa'
                        ? 'bg-emerald-900/60 border-[#d4af37] text-[#f6e09e]'
                        : 'bg-[#03261a] border-emerald-900 text-slate-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#d4af37]" />
                    <span className="text-xs font-bold block">EasyPaisa</span>
                    <span className="text-[10px] text-slate-400">Instant Telenor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Bank Transfer')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'Bank Transfer'
                        ? 'bg-emerald-900/60 border-[#d4af37] text-[#f6e09e]'
                        : 'bg-[#03261a] border-emerald-900 text-slate-300'
                    }`}
                  >
                    <Building className="w-5 h-5 mx-auto mb-1 text-[#d4af37]" />
                    <span className="text-xs font-bold block">Bank IBAN</span>
                    <span className="text-[10px] text-slate-400">Raast / 1Link</span>
                  </button>
                </div>
              </div>

              {/* Official Destination Account Details */}
              <div className="p-4 bg-[#021810] border border-emerald-800/80 rounded-xl space-y-2 text-xs">
                <span className="text-[#d4af37] font-semibold block uppercase tracking-wider">
                  WAGE Official Payment Account ({paymentMethod})
                </span>
                {paymentMethod === 'JazzCash' && (
                  <div className="space-y-1 text-slate-200 font-mono">
                    <p>Account Number: <strong className="text-white">0301-8294711</strong></p>
                    <p>Account Title: <strong className="text-[#f6e09e]">WAGE Marketplace Pakistan</strong></p>
                    <p className="text-[11px] text-slate-400 font-sans">Send Rs. 200 via JazzCash app or *786#</p>
                  </div>
                )}
                {paymentMethod === 'EasyPaisa' && (
                  <div className="space-y-1 text-slate-200 font-mono">
                    <p>Account Number: <strong className="text-white">0345-9876543</strong></p>
                    <p>Account Title: <strong className="text-[#f6e09e]">WAGE Commercial Services Ltd</strong></p>
                    <p className="text-[11px] text-slate-400 font-sans">Send Rs. 200 via EasyPaisa app or retail shop</p>
                  </div>
                )}
                {paymentMethod === 'Bank Transfer' && (
                  <div className="space-y-1 text-slate-200 font-mono">
                    <p>Bank: <strong className="text-white">Habib Bank Limited (HBL)</strong></p>
                    <p>IBAN: <strong className="text-white">PK36HABB00012345678901</strong></p>
                    <p>Title: <strong className="text-[#f6e09e]">WAGE Marketplace Ltd</strong></p>
                  </div>
                )}
              </div>

              {/* Transaction ID & Slip Attachment */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Your Transaction ID / Reference (TID) *
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. JC-9928172635 or HBL-1298492"
                    className="w-full px-3.5 py-2.5 bg-[#03261a] border border-emerald-800 rounded-lg text-sm text-slate-100 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Sender Phone / Account Number
                  </label>
                  <input
                    type="text"
                    value={senderAccount}
                    onChange={(e) => setSenderAccount(e.target.value)}
                    placeholder="e.g. 0300 1234567"
                    className="w-full px-3.5 py-2.5 bg-[#03261a] border border-emerald-800 rounded-lg text-sm text-slate-100 font-mono"
                  />
                </div>

                <div className="p-3 bg-[#021810] border border-dashed border-emerald-800 rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-slate-300">
                      {slipAttached ? 'Payment Screenshot Attached (simulated)' : 'Attach Payment Screenshot / SMS Slip'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSlipAttached(true)}
                    className="px-3 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-xs"
                  >
                    {slipAttached ? 'Attached ✓' : 'Attach Slip'}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-400 hover:text-white order-3 sm:order-1"
                >
                  &larr; Back to Details
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2 justify-end">
                  <button
                    type="button"
                    onClick={() => handleFinalSubmit(false, true)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#03261a] hover:bg-emerald-900/60 border border-emerald-800 text-slate-200 font-semibold rounded-lg text-xs transition-colors"
                  >
                    Save & Pay Later
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!transactionId.trim()) {
                        setFormError('Please enter your Payment Reference Number (TID), or click "Save & Pay Later".');
                        return;
                      }
                      handleFinalSubmit(false, false);
                    }}
                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#e5c158] hover:from-[#e5c158] hover:to-[#f3e5ab] text-[#021f15] font-bold text-xs uppercase tracking-wider rounded-lg shadow-md"
                  >
                    Submit Reference
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Success Confirmation */}
          {step === 4 && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-[#d4af37] flex items-center justify-center mx-auto text-[#d4af37] shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white font-luxury">
                  {isFreeAd
                    ? '1st Free Ad is LIVE!'
                    : isSavedAsDraft
                    ? 'Ad Draft Saved (Pending Payment)'
                    : 'Payment Reference Submitted for Admin Check'}
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  {isFreeAd
                    ? 'Your monthly free advertisement is now live on WAGE Marketplace Pakistan. Buyers can view your listing and contact you directly.'
                    : isSavedAsDraft
                    ? 'Your ad has been saved safely in your "My Ads" dashboard. You can transfer Rs. 200 via JazzCash, EasyPaisa, or Bank and submit the reference number at any time to publish it live.'
                    : 'Your Rs. 200 payment reference has been submitted. As soon as the WAGE admin checks that payment was received in our portal, your ad will go live instantly.'}
                </p>
              </div>

              <div className="p-4 bg-[#03261a] border border-emerald-900 rounded-xl max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ad Title:</span>
                  <span className="text-white font-semibold truncate max-w-[200px]">{title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ad Status:</span>
                  <span
                    className={`font-semibold ${
                      isFreeAd
                        ? 'text-emerald-400'
                        : isSavedAsDraft
                        ? 'text-orange-400'
                        : 'text-amber-300'
                    }`}
                  >
                    {isFreeAd
                      ? 'Live on Marketplace'
                      : isSavedAsDraft
                      ? 'Draft (Pay Rs. 200 anytime)'
                      : 'Pending Admin Verification'}
                  </span>
                </div>
                {!isFreeAd && !isSavedAsDraft && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Submitted Reference (TID):</span>
                    <span className="text-[#f6e09e] font-mono font-bold">{transactionId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Direct Product Payments:</span>
                  <span className="text-emerald-400">100% Direct to Seller (0% WAGE Cut)</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#d4af37] hover:bg-[#e5c158] text-[#021f15] font-bold text-xs uppercase tracking-wider rounded-lg shadow-md"
                >
                  Return to Marketplace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
