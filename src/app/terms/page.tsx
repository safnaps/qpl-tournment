"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, ShieldCheck } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-start py-8 px-4 sm:py-16 sm:px-6 relative overflow-hidden min-h-screen bg-black text-white">
      
      {/* Background neon visual elements (mimicking QPL smoke/spotlight poster effects) */}
      <div className="absolute top-[10%] left-[-15%] w-[60%] aspect-square rounded-full bg-pink-600/15 blur-[150px] pointer-events-none" />
      <div className="absolute top-[25%] right-[-20%] w-[50%] aspect-square rounded-full bg-pink-500/10 blur-[130px] pointer-events-none" />
      
      {/* Pink Dot Grid Overlay */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] dot-grid opacity-60 pointer-events-none" />
      <div className="absolute bottom-[20%] left-0 w-[200px] h-[300px] dot-grid opacity-30 pointer-events-none" />

      {/* Tournament Header with Logos Left/Right */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 w-full max-w-[92%] px-4 sm:px-8 print:hidden animate-fade-in-up pb-6 mb-4 z-10">

        {/* Left Logo - ProSportz */}
        <div className="shrink-0 relative w-40 h-28 md:w-56 md:h-40 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="ProSportz Raiders Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Center Heading */}
        <div className="flex-1 flex flex-col items-center text-center gap-1.5 w-full max-w-2xl">
          <h1 className="flex flex-col items-center gap-1.5 leading-normal">
            <span className="text-lg sm:text-2xl font-bold tracking-wide text-white uppercase flex items-baseline gap-2 py-1">
              ProSportz Raiders
              <span className="text-xs sm:text-sm font-medium text-zinc-500 lowercase italic tracking-normal normal-case">presents</span>
            </span>
            <span className="text-3xl sm:text-5xl font-black tracking-tight text-gradient-gold py-2 px-1">
              Queens Premier League
            </span>
          </h1>
        </div>

        {/* Right Logo - QPL */}
        <div className="shrink-0 relative w-40 h-32 md:w-56 md:h-48 flex items-center justify-center">
          <Image
            src="/logo_qpl.png"
            alt="Queens Premier League Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </header>

      {/* Main Content Card Container */}
      <div className="w-full max-w-[92%] flex flex-col gap-6 z-10">
        <main className="w-full glass-panel rounded-2xl p-6 sm:p-10 transition-all duration-300">
          
          <div className="flex flex-col gap-8">
            
            {/* Page Title */}
            <div className="pb-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                <BookOpen className="w-5.5 h-5.5 text-pink-500" />
                Terms & Conditions
              </h2>
              <p className="text-xs text-neutral-500 mt-1">Please review the official guidelines and regulations of tournament registry.</p>
            </div>

            {/* Rules Content Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              
              {/* Eligibility */}
              <div className="flex flex-col gap-3 p-5 rounded-xl bg-neutral-900/30 border border-pink-500/10">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Eligibility</h3>
                <ul className="list-disc pl-4 text-xs sm:text-sm text-zinc-400 flex flex-col gap-2 leading-relaxed">
                  <li>Participation is open exclusively to women employed in corporate or private organizations.</li>
                  <li>Participants may be required to provide valid proof of employment for verification purposes.</li>
                  <li>The organizers reserve the right to reject or cancel registrations that do not meet the eligibility criteria.</li>
                </ul>
              </div>

              {/* Registration */}
              <div className="flex flex-col gap-3 p-5 rounded-xl bg-neutral-900/30 border border-pink-500/10">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Registration</h3>
                <ul className="list-disc pl-4 text-xs sm:text-sm text-zinc-400 flex flex-col gap-2 leading-relaxed">
                  <li>A registration fee of ₹699 is mandatory to complete the registration process.</li>
                  <li>Team allocation will be conducted through the official player auction process organized by QPL.</li>
                </ul>
              </div>

              {/* Refund Policy */}
              <div className="flex flex-col gap-3 p-5 rounded-xl bg-neutral-900/30 border border-pink-500/10">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Refund Policy</h3>
                <ul className="list-disc pl-4 text-xs sm:text-sm text-zinc-400 flex flex-col gap-2 leading-relaxed">
                  <li>Registration fees are non-refundable and non-transferable.</li>
                  <li>Refunds will only be considered in the event of tournament cancellation by the organizers.</li>
                </ul>
              </div>

              {/* Tournament Rules */}
              <div className="flex flex-col gap-3 p-5 rounded-xl bg-neutral-900/30 border border-pink-500/10">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Tournament Rules</h3>
                <ul className="list-disc pl-4 text-xs sm:text-sm text-zinc-400 flex flex-col gap-2 leading-relaxed">
                  <li>All participants are required to adhere to tournament regulations and fair-play guidelines.</li>
                  <li>The organizers' decisions regarding player eligibility, auction procedures, fixtures, disciplinary actions, and tournament administration shall be final and binding.</li>
                </ul>
              </div>

            </div>

            {/* Full Width Media Consent Section */}
            <div className="flex flex-col gap-3 p-5 rounded-xl bg-neutral-900/30 border border-pink-500/10 text-left">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Media Consent
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                By registering, participants consent to the use of photographs, videos, and other media captured during the tournament for promotional, marketing, and social media purposes by the organizers.
              </p>
            </div>

            {/* Back Button Action */}
            <div className="flex justify-start mt-4 border-t border-neutral-800/40 pt-6">
              <Link
                href="/"
                className="py-3 px-6 rounded-lg border border-white/10 text-zinc-350 hover:text-white hover:bg-white/5 transition-all duration-200 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Registration
              </Link>
            </div>

          </div>
        </main>

        <footer className="flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500 gap-4 mt-2 mb-12 animate-fade-in">
          <span>&copy; {new Date().getFullYear()} Queens Premier League Committee. All rights reserved.</span>
        </footer>
      </div>

    </div>
  );
}
