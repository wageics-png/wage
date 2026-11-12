import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  MapPin,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { UserAccount, InboxMessage } from '../types';
import { PAKISTAN_CITIES } from '../data/mockData';

interface AuthModalProps {
  initialMode?: 'login' | 'register' | 'retrieve';
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  registeredUsers: UserAccount[];
  onRegisterAccount: (newUser: UserAccount, welcomeMessage: InboxMessage) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode = 'login',
  onClose,
  onLoginSuccess,
  registeredUsers,
  onRegisterAccount,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'retrieve' | 'registered_success'>(initialMode);

  // Registration Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lahore');

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPin, setLoginPin] = useState('');

  // Retrieve PIN State
  const [retrievePhone, setRetrievePhone] = useState('');
  const [retrievedPinData, setRetrievedPinData] = useState<{
    accountNumber: string;
    pin: string;
    name: string;
    phone: string;
  } | null>(null);

  // Newly Registered Credentials State
  const [newCredentials, setNewCredentials] = useState<{
    accountNumber: string;
    pin: string;
    name: string;
    phone: string;
  } | null>(null);

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Helper to generate unique 8-digit account number
  const generate8DigitAccount = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  // Helper to generate 4-digit PIN
  const generate4DigitPin = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  // Handle Register
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setErrorMessage('Please fill in your name, phone number, and address.');
      return;
    }

    setErrorMessage('');
    const newAccountNumber = generate8DigitAccount();
    const newPin = generate4DigitPin();

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      accountNumber: newAccountNumber,
      pin: newPin,
      name: name.trim(),
      phone: phone.trim().startsWith('+92') ? phone.trim() : `+92 ${phone.trim().replace(/^0/, '')}`,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@user.wage.pk`,
      address: address.trim(),
      city,
      isPhoneVerified: true,
      status: 'active',
      freeAdsRemainingThisMonth: 1, // 1st free ad per month
      paidAdsCount: 0,
      isVerifiedSeller: true,
      joinedDate: 'Today',
    };

    // System welcome & credentials message dispatched to their new inbox
    const welcomeMessage: InboxMessage = {
      id: `msg-cred-${Date.now()}`,
      senderId: 'sys-wage',
      senderName: 'WAGE Security Dispatch',
      senderAccount: 'WAGE-OFFICIAL',
      recipientId: newUser.id,
      recipientName: newUser.name,
      recipientAccount: newUser.accountNumber,
      subject: `Official Credentials: Your 8-Digit Account #${newAccountNumber} & 4-Digit Security PIN`,
      body: `Assalam-o-Alaikum ${newUser.name},

Welcome to WAGE Marketplace Pakistan. Your official 8-digit digital trading account and 4-digit security PIN have been generated:

• 8-Digit Account Number: ${newAccountNumber}
• 4-Digit Security PIN: ${newPin}
• Registered Mobile: ${newUser.phone}
• Registered Address: ${newUser.address}, ${newUser.city}

Account Benefits:
• 1 Free Advertisement per calendar month (Rs. 0).
• Additional advertisements cost Rs. 200 platform listing fee.
• Direct Buyer-to-Seller payments with 0% platform sales cut.
• Simple 4-digit Buy Orders Reference system.

Security Notice:
Never share your 4-digit PIN with anyone. If you ever forget your PIN, you can retrieve it at any time using your registered phone number only.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'system_credentials',
    };

    onRegisterAccount(newUser, welcomeMessage);
    setNewCredentials({
      accountNumber: newAccountNumber,
      pin: newPin,
      name: newUser.name,
      phone: newUser.phone,
    });
    setMode('registered_success');
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPin.trim()) {
      setErrorMessage('Please enter your 8-digit Account Number / Phone and 4-digit PIN.');
      return;
    }

    const cleanId = loginIdentifier.trim().replace(/[\s-]/g, '');
    const cleanPin = loginPin.trim();

    // Match by 8-digit account number OR phone number
    const matchedUser = registeredUsers.find((u) => {
      const matchAcc = u.accountNumber === cleanId;
      const matchPhone = u.phone.replace(/[\s-]/g, '').includes(cleanId) || cleanId.includes(u.phone.replace(/[\s-]/g, ''));
      return (matchAcc || matchPhone) && u.pin === cleanPin;
    });

    if (matchedUser) {
      if (matchedUser.status === 'frozen') {
        setErrorMessage(`Account is restricted. Reason: ${matchedUser.freezeReason || 'Administrative suspension'}.`);
        return;
      }
      onLoginSuccess(matchedUser);
      onClose();
    } else {
      setErrorMessage('Invalid Account Number/Phone or 4-digit PIN. Please verify or use "Retrieve PIN".');
    }
  };

  // Handle Retrieve PIN
  const handleRetrievePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!retrievePhone.trim()) {
      setErrorMessage('Please enter your registered Pakistani mobile number.');
      return;
    }

    const cleanInput = retrievePhone.trim().replace(/[\s-+]/g, '');
    const matched = registeredUsers.find((u) => {
      const cleanUserPhone = u.phone.replace(/[\s-+]/g, '');
      return cleanUserPhone.includes(cleanInput) || cleanInput.includes(cleanUserPhone);
    });

    if (matched) {
      setRetrievedPinData({
        accountNumber: matched.accountNumber,
        pin: matched.pin,
        name: matched.name,
        phone: matched.phone,
      });
      setErrorMessage('');
    } else {
      setErrorMessage('No registered WAGE account found matching this phone number. Please register a new account.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#021f15] border border-[#d4af37]/40 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Brand Banner Header */}
        <div className="relative border-b border-emerald-900/60 bg-[#03261a] p-4 text-center">
          <img
            src="/assets/aistudio/image_b0ecc101.png"
            alt="WAGE PAKISTAN"
            className="h-10 mx-auto object-contain drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-emerald-900/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Mode Tabs */}
        {mode !== 'registered_success' && (
          <div className="flex border-b border-emerald-950 bg-[#021810] text-xs font-semibold">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-3 text-center transition-colors ${
                mode === 'login'
                  ? 'text-[#f6e09e] border-b-2 border-[#d4af37] bg-emerald-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`flex-1 py-3 text-center transition-colors ${
                mode === 'register'
                  ? 'text-[#f6e09e] border-b-2 border-[#d4af37] bg-emerald-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register (8-Digit Acc + 4-Digit PIN)
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-950/60 border border-rose-600/50 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* MODE 1: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                  8-Digit Account Number or Phone *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-[#d4af37]" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. 82910482 or +92 301 5558899"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#03261a] border border-emerald-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-[#d4af37]"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                    4-Digit Security PIN *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('retrieve');
                      setErrorMessage('');
                    }}
                    className="text-[#f6e09e] hover:underline text-[11px]"
                  >
                    Retrieve PIN by Phone?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-[#d4af37]" />
                  <input
                    type="password"
                    maxLength={4}
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    placeholder="••••"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#03261a] border border-emerald-800 rounded-lg text-sm text-[#f6e09e] font-mono tracking-[0.4em] focus:outline-none focus:border-[#d4af37]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-[#d4af37] to-[#e5c158] hover:from-[#e5c158] hover:to-[#f3e5ab] text-[#021f15] font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Login to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo Account Quick Switcher */}
              <div className="pt-3 border-t border-emerald-950 space-y-2">
                <span className="text-[11px] text-slate-400 block text-center">
                  Or select a registered test account:
                </span>
                <div className="space-y-1.5">
                  {registeredUsers.slice(0, 2).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setLoginIdentifier(u.accountNumber);
                        setLoginPin(u.pin);
                      }}
                      className="w-full p-2 bg-[#021810] hover:bg-emerald-950/60 border border-emerald-900 rounded-lg flex items-center justify-between text-[11px] text-left transition-colors"
                    >
                      <div>
                        <strong className="text-white block">{u.name}</strong>
                        <span className="text-slate-400">Acc: {u.accountNumber} · PIN: {u.pin}</span>
                      </div>
                      <span className="text-[#d4af37] text-[10px]">Auto Fill &rarr;</span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* MODE 2: REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="p-3 bg-emerald-950/60 border border-[#d4af37]/30 rounded-lg text-[11px] text-slate-300">
                <span className="font-semibold text-[#f6e09e]">Instant Registration: </span>
                Enter your details to generate your unique <strong>8-digit Account Number</strong> and <strong>4-digit Security PIN</strong> sent straight to your dashboard inbox.
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-[#d4af37]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full pl-9 pr-3.5 py-2 bg-[#03261a] border border-emerald-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#d4af37]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                  Pakistani Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-[#d4af37]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0300 1234567 or +92 300 1234567"
                    className="w-full pl-9 pr-3.5 py-2 bg-[#03261a] border border-emerald-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-[#d4af37]"
                    required
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Used for SMS OTP and retrieving your 4-digit PIN.
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                  City in Pakistan *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#03261a] border border-emerald-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#d4af37]"
                >
                  {PAKISTAN_CITIES.filter((c) => c !== 'All Cities').map((c) => (
                    <option key={c} value={c} className="bg-[#021f15]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                  Complete Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-[#d4af37]" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. House 14, Street 9, DHA Phase 5 or Gulberg"
                    className="w-full pl-9 pr-3.5 py-2 bg-[#03261a] border border-emerald-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#d4af37]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-[#d4af37] to-[#e5c158] hover:from-[#e5c158] hover:to-[#f3e5ab] text-[#021f15] font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create 8-Digit Account & PIN</span>
              </button>
            </form>
          )}

          {/* MODE 3: RETRIEVE PIN */}
          {mode === 'retrieve' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <KeyRound className="w-8 h-8 text-[#d4af37] mx-auto" />
                <h3 className="text-sm font-bold text-white font-luxury">
                  Retrieve 4-Digit Security PIN
                </h3>
                <p className="text-[11px] text-slate-300">
                  Enter your registered Pakistani mobile number to retrieve your 4-digit PIN.
                </p>
              </div>

              {!retrievedPinData ? (
                <form onSubmit={handleRetrievePin} className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                      Registered Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 w-4 h-4 text-[#d4af37]" />
                      <input
                        type="text"
                        value={retrievePhone}
                        onChange={(e) => setRetrievePhone(e.target.value)}
                        placeholder="e.g. 0301 5558899"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-[#03261a] border border-emerald-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-[#d4af37]"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#d4af37] hover:bg-[#e5c158] text-[#021f15] font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all"
                  >
                    Lookup & Retrieve PIN
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-slate-400 hover:text-white text-xs underline"
                    >
                      &larr; Return to Sign In
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 bg-[#03281c] border border-[#d4af37]/40 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Account Retrieved for {retrievedPinData.name}</span>
                  </div>

                  <div className="p-3 bg-[#021810] rounded-lg border border-emerald-950 font-mono space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">8-Digit Account:</span>
                      <strong className="text-white">{retrievedPinData.accountNumber}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">4-Digit Security PIN:</span>
                      <strong className="text-[#f6e09e] text-base">{retrievedPinData.pin}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Registered Phone:</span>
                      <span className="text-slate-200">{retrievedPinData.phone}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const matched = registeredUsers.find((u) => u.accountNumber === retrievedPinData.accountNumber);
                      if (matched) {
                        onLoginSuccess(matched);
                        onClose();
                      }
                    }}
                    className="w-full py-2 bg-gradient-to-r from-[#d4af37] to-[#e5c158] text-[#021f15] font-bold rounded-lg text-xs uppercase tracking-wider shadow"
                  >
                    Sign In Directly With This PIN &rarr;
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MODE 4: REGISTRATION SUCCESS CREDENTIALS DISPLAY */}
          {mode === 'registered_success' && newCredentials && (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-950 border border-[#d4af37] flex items-center justify-center mx-auto text-[#d4af37] shadow-lg">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-luxury">
                  Welcome, {newCredentials.name}!
                </h3>
                <p className="text-xs text-slate-300">
                  Your official 8-digit WAGE account and 4-digit PIN have been generated and dispatched to your dashboard inbox.
                </p>
              </div>

              {/* Generated Credentials Card */}
              <div className="p-4 bg-[#03281c] border border-[#d4af37]/50 rounded-xl text-left space-y-3 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-900/60">
                  <span className="text-xs text-slate-300 uppercase tracking-wider font-semibold">
                    Account Credentials
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Active & Verified
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">8-Digit Account Number</span>
                    <strong className="text-base font-mono text-white tracking-wider">
                      {newCredentials.accountNumber}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(newCredentials.accountNumber, 'acc')}
                    className="px-2.5 py-1 rounded bg-[#021810] border border-emerald-800 text-[#f6e09e] flex items-center gap-1 text-[11px]"
                  >
                    {copiedField === 'acc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === 'acc' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">4-Digit Security PIN</span>
                    <strong className="text-lg font-mono text-[#f6e09e] tracking-[0.25em]">
                      {newCredentials.pin}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(newCredentials.pin, 'pin')}
                    className="px-2.5 py-1 rounded bg-[#021810] border border-emerald-800 text-[#f6e09e] flex items-center gap-1 text-[11px]"
                  >
                    {copiedField === 'pin' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === 'pin' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-[#021810] rounded-lg border border-emerald-950 text-[11px] text-slate-400 text-left">
                • <strong>Stored in Inbox:</strong> These credentials have also been saved in your Dashboard Inbox.<br />
                • <strong>PIN Recovery:</strong> You can retrieve your 4-digit PIN anytime using phone <code>{newCredentials.phone}</code>.
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-gradient-to-r from-[#d4af37] to-[#e5c158] hover:from-[#e5c158] hover:to-[#f3e5ab] text-[#021f15] font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Enter User Dashboard & Inbox</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
