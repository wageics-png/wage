export type CategoryId =
  | 'motors'
  | 'property_sale'
  | 'property_rent'
  | 'mobiles'
  | 'computers'
  | 'jobs'
  | 'furniture'
  | 'kitchen_items'
  | 'home_decor'
  | 'fashion'
  | 'watches'
  | 'electronics'
  | 'agriculture'
  | 'livestock'
  | 'books'
  | 'sports'
  | 'construction'
  | 'business'
  | 'education'
  | 'services'
  | 'other';

export interface CategoryItem {
  id: CategoryId;
  name: string;
  urduName?: string;
  iconName: string;
  count: number;
}

export type ItemCondition = 'Brand New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair' | 'Not Applicable';

export interface Seller {
  id: string;
  name: string;
  phone: string;
  verified: boolean;
  city: string;
  memberSince: string;
  rating: number;
  totalAds: number;
  hidePhoneUntilConsent: boolean;
}

export interface Listing {
  id: string;
  title: string;
  category: CategoryId;
  subcategory: string;
  price: number; // PKR
  priceType?: 'fixed' | 'negotiable' | 'per_month' | 'per_year';
  city: string;
  area: string;
  condition: ItemCondition;
  description: string;
  imageUrl: string;
  additionalImages?: string[];
  seller: Seller;
  isFeatured?: boolean;
  status: 'live' | 'pending_payment' | 'pending_verification' | 'rejected' | 'sold';
  postedAt: string;
  views: number;
  likes: number;
  adFeePaid: number; // 0 for free monthly ad, 200 for paid
  paymentRef?: string;
  paymentMethod?: 'Free Allowance' | 'JazzCash' | 'EasyPaisa' | 'Bank Transfer';
}

export interface PaymentTransaction {
  id: string;
  adId: string;
  adTitle: string;
  userId: string;
  userName: string;
  userPhone: string;
  amount: number; // Rs. 200
  paymentMethod: 'JazzCash' | 'EasyPaisa' | 'Bank Transfer';
  transactionId: string;
  senderAccount: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  slipProofUrl?: string;
  bankVerificationStatus?: 'verified_in_bank' | 'not_received_in_bank' | 'pending_check' | 'reconciled' | 'unmatched';
  adPlacementStatus?: 'ad_placed_live' | 'pending_admin_approval' | 'rejected_payment_missing' | 'awaiting_payment_confirmation' | 'rejected_unpublished';
  verifiedAt?: string;
}

export interface BankStatementItem {
  id: string;
  channel: 'JazzCash' | 'EasyPaisa' | 'Bank Transfer';
  amount: number;
  senderPhoneOrIban: string;
  transactionId: string;
  receivedAt: string;
  verifiedInBank: boolean;
  reconciledAdId?: string;
  notes: string;
}

export interface UserAccount {
  id: string;
  accountNumber: string; // 8-digit account number (e.g. '82910482')
  pin: string; // 4-digit PIN (e.g. '4819')
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  isPhoneVerified: boolean;
  status: 'active' | 'frozen' | 'suspended';
  freeAdsRemainingThisMonth: number;
  paidAdsCount: number;
  isVerifiedSeller: boolean;
  joinedDate: string;
  freezeReason?: string;
}

export interface DirectBuyOrder {
  id: string;
  orderRef: string; // 4-digit simple reference number (e.g. '7482')
  listingId: string;
  listingTitle: string;
  listingPrice: number;
  listingImage: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  status: 'placed' | 'seller_contacted' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface InboxMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAccount?: string;
  recipientId: string;
  recipientName: string;
  recipientAccount: string;
  subject: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  type: 'system_credentials' | 'order_notice' | 'direct_message' | 'payment_notice';
  orderRef?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'buyer' | 'seller';
  text: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingPrice: number;
  listingImage: string;
  otherPartyName: string;
  otherPartyPhone: string;
  otherPartyVerified: boolean;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface FlaggedReport {
  id: string;
  listingId: string;
  listingTitle: string;
  sellerName: string;
  reporterPhone: string;
  reason: 'Suspected Fraud / Advance Demand' | 'Counterfeit Product' | 'Misleading Price' | 'Harassment / Spam';
  reportedAt: string;
  status: 'pending_review' | 'action_taken' | 'dismissed';
}

export interface PlatformAnnouncement {
  id: string;
  title: string;
  content: string;
  type: 'rule' | 'safety' | 'promo';
  date: string;
  active: boolean;
}
