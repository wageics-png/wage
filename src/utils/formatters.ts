export function formatPKR(amount: number): string {
  if (amount >= 10000000) {
    const crore = amount / 10000000;
    return `PKR ${crore % 1 === 0 ? crore : crore.toFixed(2)} Crore`;
  }
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `PKR ${lakh % 1 === 0 ? lakh : lakh.toFixed(2)} Lakh`;
  }
  return `PKR ${amount.toLocaleString('en-PK')}`;
}

export function formatExactPKR(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export function formatPhonePK(phone: string): string {
  return phone.replace(/(\+92)\s?(\d{3})\s?(\d{7})/, '$1 $2 $3');
}
