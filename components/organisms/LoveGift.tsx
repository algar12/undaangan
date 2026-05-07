"use client";

import { useState } from "react";
import { Gift, CreditCard, Copy, CheckCircle2 } from "lucide-react";

interface BankAccount {
  bank_name: string;
  account_number: string;
  account_name: string;
}

interface LoveGiftProps {
  banks?: BankAccount[];
}

export function LoveGift({ banks }: LoveGiftProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  // Default banks if none provided by the theme_config
  const defaultBanks: BankAccount[] = banks?.length ? banks : [
    { bank_name: "BCA", account_number: "1234567890", account_name: "Wahyu" },
    { bank_name: "Mandiri", account_number: "0987654321", account_name: "Riski" },
  ];

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary-dark)] mb-8 mx-auto">
        <Gift size={28} />
      </div>
      <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] mb-6">
        Love Gift
      </h2>
      <p className="text-[var(--color-text-muted)] mb-10 leading-relaxed px-4">
        Doa restu Anda merupakan karunia yang sangat berarti bagi kami. 
        Namun jika Anda bermaksud memberikan tanda kasih, Anda dapat mengirimkannya melalui:
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        {defaultBanks.map((bank, idx) => (
          <div key={idx} className="modern-card p-6 flex flex-col items-center text-center">
            <CreditCard size={24} className="text-[var(--color-text-subtle)] mb-4" />
            <p className="font-bold text-lg mb-1">{bank.bank_name}</p>
            <p className="text-[var(--color-text-muted)] mb-4">{bank.account_name}</p>
            <div className="bg-[var(--color-surface-hover)] rounded-xl py-3 px-4 flex items-center justify-between w-full mt-auto">
              <span className="font-mono text-sm tracking-widest">{bank.account_number}</span>
              <button
                onClick={() => handleCopy(bank.account_number)}
                className="text-[var(--color-primary-dark)] hover:opacity-70 transition-opacity"
                aria-label="Copy Account Number"
              >
                {copied === bank.account_number ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
