/**
 * Public pricing. Kept static so the page prerenders and search engines see the
 * prices; the backend's `seed_plans` command mirrors these values and enforces
 * the limits.
 */
export const plans = [
  {
    name: "Basic",
    price: 1000,
    blurb: "For growing local ISPs. 14-day free trial",
    customers: "Up to 200 customers",
    highlight: false,
    features: [
      "500 SMS per month",
      "5 staff accounts",
      "MikroTik auto disable / enable",
      "Expense & profit reports",
    ],
    bn: {
      blurb: "বর্ধনশীল স্থানীয় আইএসপির জন্য। ১৪ দিন ফ্রি ট্রায়াল",
      customers: "২০০ জন গ্রাহক পর্যন্ত",
      features: [
        "মাসে ৫০০ এসএমএস",
        "৫টি স্টাফ অ্যাকাউন্ট",
        "মাইক্রোটিক অটো চালু/বন্ধ",
        "খরচ ও মুনাফা রিপোর্ট",
      ],
    },
  },
  {
    name: "Standard",
    price: 2000,
    blurb: "Most popular for busy ISPs",
    customers: "Up to 500 customers",
    highlight: true,
    features: [
      "1,250 SMS per month",
      "10 staff accounts",
      "Customer portal with bKash / Nagad payment",
      "Complaint & support tickets",
    ],
    bn: {
      blurb: "ব্যস্ত আইএসপির সবচেয়ে জনপ্রিয় প্ল্যান",
      customers: "৫০০ জন গ্রাহক পর্যন্ত",
      features: [
        "মাসে ১,২৫০ এসএমএস",
        "১০টি স্টাফ অ্যাকাউন্ট",
        "বিকাশ / নগদ পেমেন্টসহ কাস্টমার পোর্টাল",
        "অভিযোগ ও সাপোর্ট টিকেট",
      ],
    },
  },
  {
    name: "Premium",
    price: 3000,
    blurb: "Large networks and resellers",
    customers: "Up to 1,000 customers",
    highlight: false,
    features: [
      "2,500 SMS per month",
      "20 staff accounts",
      "Everything in Standard",
      "Priority support",
    ],
    bn: {
      blurb: "বড় নেটওয়ার্ক ও রিসেলারদের জন্য",
      customers: "১,০০০ জন গ্রাহক পর্যন্ত",
      features: [
        "মাসে ২,৫০০ এসএমএস",
        "২০টি স্টাফ অ্যাকাউন্ট",
        "স্ট্যান্ডার্ডের সব সুবিধা",
        "অগ্রাধিকার সাপোর্ট",
      ],
    },
  },
] as const

export const pricingFaqsBn = [
  {
    question: "ফ্রি ট্রায়াল আছে কি?",
    answer:
      "হ্যাঁ। নতুন প্রতিটি আইএসপি কার্ড ছাড়াই ১৪ দিনের ফ্রি ট্রায়াল পায়। শুরু থেকেই গ্রাহক যোগ, বিল তৈরি ও পেমেন্ট নেওয়া যায়।",
  },
  {
    question: "বিলশেবা চালাতে কি মাইক্রোটিক রাউটার লাগবে?",
    answer:
      "না। বিলশেবা নিজে থেকেই একটি বিলিং সিস্টেম। মাইক্রোটিক যুক্ত করলে যারা বিল দেয়নি তাদের সংযোগ স্বয়ংক্রিয়ভাবে বন্ধ হয় এবং পেমেন্ট করলে আবার চালু হয়।",
  },
  {
    question: "গ্রাহক কি বিকাশ বা নগদে বিল দিতে পারবে?",
    answer:
      "হ্যাঁ। গ্রাহক আপনার বিলশেবা পোর্টালে গিয়ে বকেয়া বিল দেখে বিকাশ, নগদ বা রকেটের ট্রানজেকশন আইডি জমা দেয়। আপনি এক ক্লিকে অনুমোদন করলেই বিল পরিশোধিত হয়।",
  },
  {
    question: "ট্রায়াল বা সাবস্ক্রিপশন শেষ হলে কী হয়?",
    answer:
      "আপনার ডেটা নিরাপদ থাকে। রিনিউ না করা পর্যন্ত অ্যাকাউন্ট শুধু দেখার মোডে থাকে, তাই লগইন করে সবকিছু দেখতে পারবেন।",
  },
  {
    question: "এসএমএস কি বাংলায় যায়?",
    answer:
      "হ্যাঁ। বিল, পেমেন্ট রশিদ ও সংযোগ বন্ধের মেসেজ বাংলায় যায়, আর মেসেজের টেমপ্লেট আপনি নিজে বদলাতে পারেন।",
  },
] as const

export const pricingFaqs = [
  {
    question: "Is there a free trial?",
    answer:
      "Yes. Every new ISP gets a 14-day free trial with no card required. You can add customers, generate bills and record payments straight away.",
  },
  {
    question: "Do I need a MikroTik router to use Billsheba?",
    answer:
      "No. Billsheba works as a billing system on its own. If you connect a MikroTik router, customers who do not pay are disabled automatically and re-enabled when they pay.",
  },
  {
    question: "Can my customers pay with bKash or Nagad?",
    answer:
      "Yes. Your customers open your Billsheba portal page, see their due bill and submit their bKash, Nagad or Rocket transaction ID. You approve it with one click and the bill is marked paid.",
  },
  {
    question: "What happens when my trial or subscription ends?",
    answer:
      "Your data stays safe. The account becomes read-only until you renew, so you can still log in and view everything.",
  },
  {
    question: "Does it send SMS in Bangla?",
    answer:
      "Yes. Bill, payment-receipt and suspension messages are sent in Bangla, and you can edit the message templates.",
  },
] as const
