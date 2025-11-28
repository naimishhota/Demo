"use client";

import React, { useState } from "react";
import Hero from "../components/Hero";

type FAQItem = {
  question: string;
  answer: string;
};

const visitorFAQs: FAQItem[] = [
  {
    question: "What are the expo timings?",
    answer: "The expo is open from 9:00 AM to 6:00 PM on all scheduled days.",
  },
  {
    question: "Is there an entry fee?",
    answer: "Yes, there is a nominal entry fee for visitors. You can register and pay online.",
  },
  {
    question: "How do I get my entry pass?",
    answer: "After successful registration and payment, your entry pass with a QR code will be sent to your registered email address.",
  },
  {
    question: "Is parking available?",
    answer: "Yes, ample parking space is available at the venue for visitors.",
  },
];

const exhibitorFAQs: FAQItem[] = [
  {
    question: "How can I book a stall?",
    answer: "You can book a stall by registering as an exhibitor on our website. Choose your preferred stall type and complete the payment.",
  },
  {
    question: "What is included in the stall package?",
    answer: "Standard stalls include basic furniture, lighting, and power points. Premium stalls offer additional branding space and amenities.",
  },
  {
    question: "Can I customize my stall?",
    answer: "Yes, you can customize your stall within the allotted space. Please contact our support team for guidelines.",
  },
  {
    question: "When can I start setting up my stall?",
    answer: "Stall setup usually begins 24 hours before the expo starts. Detailed timings will be shared via email.",
  },
];

function AccordionItem({ item, isOpen, onClick }: { item: FAQItem; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        className="flex w-full items-center justify-between py-4 text-left text-base font-medium text-gray-900 dark:text-white focus:outline-none"
        onClick={onClick}
      >
        <span>{item.question}</span>
        <span className="ml-6 flex items-center">
          {isOpen ? (
            <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 pr-12">
          <p className="text-base text-gray-600 dark:text-gray-300">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [openVisitorIndex, setOpenVisitorIndex] = useState<number | null>(null);
  const [openExhibitorIndex, setOpenExhibitorIndex] = useState<number | null>(null);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Hero title="Frequently Asked Questions" />

      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">For Visitors</h2>
          <div className="space-y-1">
            {visitorFAQs.map((faq, index) => (
              <AccordionItem
                key={index}
                item={faq}
                isOpen={openVisitorIndex === index}
                onClick={() => setOpenVisitorIndex(openVisitorIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">For Exhibitors</h2>
          <div className="space-y-1">
            {exhibitorFAQs.map((faq, index) => (
              <AccordionItem
                key={index}
                item={faq}
                isOpen={openExhibitorIndex === index}
                onClick={() => setOpenExhibitorIndex(openExhibitorIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
