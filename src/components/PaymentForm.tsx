"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Loader2, ShieldCheck, ArrowLeft, Smartphone } from "lucide-react";
import { FileUpload } from "./FormComponents";

interface PaymentFormProps {
  amount: number;
  onPaymentSuccess: (details: { screenshot: File }) => void;
  onBack: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ amount, onPaymentSuccess, onBack }) => {
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshot) {
      setError("Please upload a screenshot of your successful transaction");
      return;
    }

    setIsProcessing(true);
    setProcessingStep(0);

    const steps = [
      "Uploading payment screenshot...",
      "Analyzing transaction details...",
      "Matching with payment ledger...",
      "Confirming player registration...",
    ];

    const interval = setInterval(() => {
      setProcessingStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            if (screenshot) {
              onPaymentSuccess({ screenshot });
            }
          }, 800);
          return prev;
        }
      });
    }, 1000);
  };

  const stepsTexts = [
    "Uploading payment screenshot...",
    "Analyzing transaction details...",
    "Matching with payment ledger...",
    "Confirming player registration...",
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 animate-fade-in">
        
        {/* Scan Info Summary */}
        <div className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
              QPL Registration Fee
            </span>
            <span className="text-xs text-zinc-500 mt-0.5">Pay using GPay, PhonePe, Paytm, or any UPI app</span>
          </div>
          <div className="flex flex-col md:items-end">
            <span className="text-2xl font-black text-white">₹{amount} INR</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Scan & attach proof</span>
          </div>
        </div>

        {/* Secure details info */}
        <div className="flex items-center gap-2.5 text-xs text-emerald-400 bg-emerald-950/10 border border-emerald-500/10 p-3 rounded-lg">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Upload the official transaction receipt screen containing the UTR / Ref number.</span>
        </div>

        {/* Payment QR Code Layout */}
        <div className="flex flex-col lg:flex-row items-center gap-8 bg-neutral-900/30 p-6 rounded-2xl border border-neutral-800 shadow-lg">
          
          {/* QR Code Container */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="p-3 bg-neutral-900 rounded-2xl relative group overflow-hidden border border-neutral-800 flex items-center justify-center shadow-md">
              {/* Subtle light border overlay instead of gold/pink */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/5 to-white/10 opacity-70 pointer-events-none rounded-2xl" />
              <div className="p-2.5 bg-white rounded-xl relative z-10">
                <Image
                  src="/payment_qr.png"
                  alt="UPI Payment QR Code"
                  width={180}
                  height={180}
                  className="rounded-lg object-contain"
                />
              </div>
            </div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-zinc-500" />
              Scan to pay ₹{amount}
            </span>
          </div>

          {/* Instruction Lists */}
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <h4 className="text-sm font-bold text-white mb-2">Payment Instructions:</h4>
              <ol className="list-decimal pl-4 text-xs text-zinc-400 flex flex-col gap-2 leading-relaxed">
                <li>Scan the QR code using your mobile UPI App (GPay/PhonePe/Paytm).</li>
                <li>Verify payee details read <span className="font-bold text-zinc-200">Noble Jonathan</span>.</li>
                <li>Confirm the transfer of exactly <span className="font-extrabold text-white">₹{amount}</span>.</li>
                <li>Take a clear screenshot of the successful payment page.</li>
                <li>Upload the screenshot in the file field below.</li>
              </ol>
            </div>

            {/* UPI details table */}
            <div className="bg-neutral-900/50 p-3 rounded-lg border border-neutral-800 text-xs flex flex-col gap-1.5 shadow-inner">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">UPI ID:</span>
                <span className="font-mono text-zinc-300 font-semibold selection:bg-white/10">jonathanjacobnoble@okaxis</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Merchant Name:</span>
                <span className="text-zinc-300 font-semibold">Noble Jonathan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Screenshot Uploader Component */}
        <div className="w-full">
          <FileUpload
            label="Upload Payment Screenshot (JPG, PNG, JPEG)"
            selectedFile={screenshot}
            onFileSelect={(file) => {
              if (isProcessing) return;
              setScreenshot(file);
              if (file) setError("");
            }}
            error={error}
            accept=".png,.jpg,.jpeg"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-2">
          <button
            type="button"
            onClick={onBack}
            disabled={isProcessing}
            className="py-3 px-6 rounded-lg border border-white/10 text-zinc-350 hover:text-white hover:bg-white/5 transition-all duration-200 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" /> Edit the details
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex-1 py-3 px-6 rounded-lg bg-white hover:bg-neutral-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-900 transition-all duration-200 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg min-h-[48px]"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin text-neutral-900" />
            ) : (
              <>Submit Screenshot & Complete</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
