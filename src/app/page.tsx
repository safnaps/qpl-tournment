"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldAlert,
  User,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  FileImage,
  Award,
  BookOpen,
  Trophy,
} from "lucide-react";

import {
  TextInput,
  SelectCards,
  MultiSelectCards,
  CheckboxGrid,
  Checkbox,
  FileUpload,
  ProgressBar,
} from "@/components/FormComponents";
import { PaymentForm } from "@/components/PaymentForm";

// Playing Positions Setup
const POSITION_OPTIONS = [
  { id: "goalkeeper", title: "Goalkeeper" },
  { id: "defender", title: "Defender" },
  { id: "midfielder", title: "Midfielder" },
  { id: "forward", title: "Forward" },
];

// Experience Level Setup
const EXPERIENCE_OPTIONS = [
  { id: "beginner", title: "Beginner", description: "Recreational play / learning fundamentals" },
  { id: "intermediate", title: "Intermediate", description: "Regular match play / tactical coordination" },
  { id: "advanced", title: "Advanced", description: "Competitive club / division-level tournaments" },
];

// Representative Levels Setup
const REPRESENTED_OPTIONS = [
  { id: "school", label: "School" },
  { id: "college", label: "College" },
  { id: "club", label: "Club" },
  { id: "district", label: "District" },
  { id: "state", label: "State" },
  { id: "national", label: "National" },
  { id: "none", label: "None" },
];

export default function Home() {
  const [step, setStep] = useState(0);
  const totalSteps = 3; // 0: Form (Details + Consent), 1: Payment (QR + Proof), 2: Receipt

  // Form Field States
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [photograph, setPhotograph] = useState<File | null>(null);
  const [company, setCompany] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const [positions, setPositions] = useState<string[]>([]);
  const [experience, setExperience] = useState("beginner");
  const [represented, setRepresented] = useState<string[]>([]);

  const [consentChecked, setConsentChecked] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);

  // Live URL Previews
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

  // Field Validation Errors State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
      if (screenshotUrl) URL.revokeObjectURL(screenshotUrl);
    };
  }, [photoUrl, screenshotUrl]);

  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted details on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("qpl_name");
      const savedMobile = localStorage.getItem("qpl_mobile");
      const savedEmail = localStorage.getItem("qpl_email");
      const savedCity = localStorage.getItem("qpl_city");
      const savedCompany = localStorage.getItem("qpl_company");
      const savedEmployeeId = localStorage.getItem("qpl_employeeId");
      const savedExperience = localStorage.getItem("qpl_experience");
      const savedConsent = localStorage.getItem("qpl_consentChecked");

      try {
        const savedPositions = localStorage.getItem("qpl_positions");
        const savedRepresented = localStorage.getItem("qpl_represented");

        if (savedName) setName(savedName);
        if (savedMobile) setMobile(savedMobile);
        if (savedEmail) setEmail(savedEmail);
        if (savedCity) setCity(savedCity);
        if (savedCompany) setCompany(savedCompany);
        if (savedEmployeeId) setEmployeeId(savedEmployeeId);
        if (savedExperience) setExperience(savedExperience);
        if (savedConsent) setConsentChecked(savedConsent === "true");
        if (savedPositions) setPositions(JSON.parse(savedPositions));
        if (savedRepresented) setRepresented(JSON.parse(savedRepresented));
      } catch (e) {
        console.error("Error loading persisted registration data:", e);
      }
      setIsLoaded(true);
    }
  }, []);

  // Save details when any field changes, but ONLY after initial load has finished
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem("qpl_name", name);
      localStorage.setItem("qpl_mobile", mobile);
      localStorage.setItem("qpl_email", email);
      localStorage.setItem("qpl_city", city);
      localStorage.setItem("qpl_company", company);
      localStorage.setItem("qpl_employeeId", employeeId);
      localStorage.setItem("qpl_experience", experience);
      localStorage.setItem("qpl_consentChecked", consentChecked.toString());
      localStorage.setItem("qpl_positions", JSON.stringify(positions));
      localStorage.setItem("qpl_represented", JSON.stringify(represented));
    }
  }, [isLoaded, name, mobile, email, city, company, employeeId, experience, consentChecked, positions, represented]);

  // Handle player photo preview
  const handlePhotoSelect = (file: File | null) => {
    setPhotograph(file);
    if (errors.photograph) setErrors((prev) => ({ ...prev, photograph: "" }));

    if (photoUrl) {
      URL.revokeObjectURL(photoUrl);
      setPhotoUrl(null);
    }
    if (file) {
      setPhotoUrl(URL.createObjectURL(file));
    }
  };

  // Handle payment screenshot preview and submit to Google Sheet
  const handleScreenshotSelect = async ({ screenshot }: { screenshot: File }) => {
    setPaymentScreenshot(screenshot);

    if (screenshotUrl) {
      URL.revokeObjectURL(screenshotUrl);
      setScreenshotUrl(null);
    }
    setScreenshotUrl(URL.createObjectURL(screenshot));
    setStep(2); // Go directly to receipt confirmation page

    // Send details and files asynchronously to Google Sheets / Google Drive
    try {
      const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      };

      const photoBase64 = photograph ? await fileToBase64(photograph) : null;
      const screenshotBase64 = screenshot ? await fileToBase64(screenshot) : null;

      const payload = {
        name,
        mobile,
        email,
        city,
        company,
        employeeId,
        positions,
        experience,
        represented,
        consentChecked,
        photoBase64,
        photoName: photograph?.name || "photo.jpg",
        screenshotBase64,
        screenshotName: screenshot.name || "screenshot.jpg"
      };

      await fetch("https://script.google.com/macros/s/AKfycbzo3kvaS9irM72y2u1WhdiOnB0N5TW8ihTnz_x8HNNdXuL1qEQT_xfjFXufpjQAJ-su/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      console.log("Registration successfully sent to Google Sheet.");
    } catch (err) {
      console.error("Error sending registration to Google Sheet:", err);
    }
  };

  // Checking registration status state
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  // Validate entire Page 1 (Personal details, Football Profile, and Declaration Consent)
  const validatePage1 = () => {
    const tempErrors: Record<string, string> = {};

    // 1. Personal Details
    if (!name.trim()) tempErrors.name = "Full name as per ID is required";
    if (!mobile.trim()) {
      tempErrors.mobile = "Mobile number is required";
    } else if (!/^[0-9+\s-]{8,15}$/.test(mobile)) {
      tempErrors.mobile = "Please enter a valid mobile number";
    }
    if (!email.trim()) {
      tempErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Please enter a valid email address";
    }
    if (!city.trim()) tempErrors.city = "City / District is required";
    if (!company.trim()) tempErrors.company = "Company Name is required";
    if (!photograph) tempErrors.photograph = "A recent photograph is required";

    // 2. Football Details
    if (positions.length === 0) {
      tempErrors.positions = "Select at least one playing position";
    }
    if (represented.length === 0) {
      tempErrors.represented = "Please select representative levels (or 'None')";
    }

    // 3. Declaration & Consent
    if (!consentChecked) {
      tempErrors.consent = "You must check the box to confirm your declaration consent";
    }

    setErrors(tempErrors);
    return tempErrors;
  };

  const handleProceedToPayment = async () => {
    const tempErrors = validatePage1();
    const hasErrors = Object.keys(tempErrors).length > 0;

    if (!hasErrors) {
      setIsCheckingDuplicate(true);
      try {
        const cleanMobile = mobile.replace(/\D/g, "");
        const response = await fetch(
          `https://script.google.com/macros/s/AKfycbzo3kvaS9irM72y2u1WhdiOnB0N5TW8ihTnz_x8HNNdXuL1qEQT_xfjFXufpjQAJ-su/exec?mobile=${cleanMobile}`
        );
        const result = await response.json();
        
        if (result.exists) {
          setErrors((prev) => ({
            ...prev,
            mobile: "This mobile number is already registered for QPL."
          }));
          
          setTimeout(() => {
            const errorField = document.getElementsByName("mobile")[0];
            errorField?.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 100);
        } else {
          setStep(1); // Advance to QR payment page
        }
      } catch (err) {
        console.error("Error checking duplicates:", err);
        // Fallback: if script fails or throws CORS issue, proceed or alert the user
        setStep(1);
      } finally {
        setIsCheckingDuplicate(false);
      }
    } else {
      // Auto scroll to first error for convenience
      const firstErrorKey = Object.keys(tempErrors)[0];
      if (firstErrorKey && typeof window !== "undefined") {
        const errorField = document.getElementsByName(firstErrorKey)[0];
        errorField?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(0); // Return to Form page (Page 1)
    }
  };

  const handleReset = () => {
    setName("");
    setMobile("");
    setEmail("");
    setCity("");
    setPhotograph(null);
    setCompany("");
    setEmployeeId("");
    setPositions([]);
    setExperience("beginner");
    setRepresented([]);
    setConsentChecked(false);
    setPaymentScreenshot(null);
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    if (screenshotUrl) URL.revokeObjectURL(screenshotUrl);
    setPhotoUrl(null);
    setScreenshotUrl(null);
    setErrors({});
    setStep(0);

    if (typeof window !== "undefined") {
      localStorage.removeItem("qpl_name");
      localStorage.removeItem("qpl_mobile");
      localStorage.removeItem("qpl_email");
      localStorage.removeItem("qpl_city");
      localStorage.removeItem("qpl_company");
      localStorage.removeItem("qpl_employeeId");
      localStorage.removeItem("qpl_experience");
      localStorage.removeItem("qpl_consentChecked");
      localStorage.removeItem("qpl_positions");
      localStorage.removeItem("qpl_represented");
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-start py-8 px-4 sm:py-16 sm:px-6 relative overflow-hidden">

      {/* Background neon visual elements (mimicking QPL smoke/spotlight poster effects) */}
      <div className="absolute top-[10%] left-[-15%] w-[60%] aspect-square rounded-full bg-pink-600/15 blur-[150px] pointer-events-none" />
      <div className="absolute top-[25%] right-[-20%] w-[50%] aspect-square rounded-full bg-pink-500/10 blur-[130px] pointer-events-none" />
      
      {/* Pink Dot Grid Overlay (similar to bottom right corner in poster) */}
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
        <div className="shrink-0 flex items-center justify-center">
          <Image
            src="/qpl.png"
            alt="Queens Premier League Logo"
            width={224}
            height={224}
            className="w-40 md:w-56 h-auto object-contain"
            priority
          />
        </div>
      </header>

      {/* Main Container */}
      <div className="w-full max-w-[92%] flex flex-col gap-6 z-10 print:p-0">

        {/* Wizard Form Layout */}
        <main className={`w-full glass-panel rounded-2xl p-6 sm:p-10 transition-all duration-300 print:bg-white print:text-black print:border-none print:shadow-none print:p-0 ${step === 2 ? "animate-scale-up border-neutral-800" : ""
          }`}>

          {/* Progress Indicators (Hidden for Success Receipt & Print) */}
          {step < 2 && (
            <div className="mb-8 print:hidden">
              <ProgressBar currentStep={step} totalSteps={totalSteps - 1} />
            </div>
          )}

          {/* Form Step Router */}
          <div className="w-full">

            {/* PAGE 1: Player details, football details, and declaration */}
            {step === 0 && (
              <div className="flex flex-col gap-16 animate-slide-in-right">

                {/* 1. Personal Details Section */}
                <div className="flex flex-col gap-6">
                  <div className="pb-2">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-neutral-400" />
                      Personal Details
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">Please provide your employee registration details and contact credentials.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <TextInput
                      label="Full Name (as per ID)"
                      placeholder="Enter your official name"
                      description="Use your name as it appears on your official photo identification."
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                      }}
                      error={errors.name}
                    />

                    <TextInput
                      name="mobile"
                      label="Mobile Number"
                      placeholder="+91 98765 43210"
                      description="Active mobile contact number for tournament communications."
                      value={mobile}
                      onChange={(e) => {
                        setMobile(e.target.value);
                        if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: "" }));
                      }}
                      error={errors.mobile}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <TextInput
                      label="Email Address"
                      type="email"
                      placeholder="employee@company.com"
                      description="Your official corporate email inbox."
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      error={errors.email}
                    />

                    <TextInput
                      label="City / District"
                      placeholder="e.g. Kochi, Ernakulam"
                      description="Your current corporate base location/district."
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (errors.city) setErrors((prev) => ({ ...prev, city: "" }));
                      }}
                      error={errors.city}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <TextInput
                      label="Company Name"
                      placeholder="e.g. Infosys, Wipro"
                      description="Your current employer or parent corporate group."
                      value={company}
                      onChange={(e) => {
                        setCompany(e.target.value);
                        if (errors.company) setErrors((prev) => ({ ...prev, company: "" }));
                      }}
                      error={errors.company}
                    />

                    
                  </div>

                  <div className="w-full">
                    <FileUpload
                      label="Recent Photograph"
                      description="Attach a clear, professional front-facing image (Max 5MB)."
                      selectedFile={photograph}
                      onFileSelect={handlePhotoSelect}
                      error={errors.photograph}
                      accept=".png,.jpg,.jpeg"
                    />
                  </div>
                </div>

                {/* 2. Football Profile Section */}
                <div className="flex flex-col gap-6">
                  <div className="pb-2">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-neutral-400" />
                      Football Profile
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">Specify your playing positions and previous representative experience.</p>
                  </div>

                  <MultiSelectCards
                    label="Playing Position"
                    description="Click options below to select all positions you are comfortable playing."
                    options={POSITION_OPTIONS}
                    selectedValues={positions}
                    onChange={(vals) => {
                      setPositions(vals);
                      if (errors.positions) setErrors((prev) => ({ ...prev, positions: "" }));
                    }}
                    error={errors.positions}
                  />

                  <SelectCards
                    label="Playing Experience"
                    description="Select the experience tier that best matches your football capabilities."
                    options={EXPERIENCE_OPTIONS}
                    selectedValue={experience}
                    onChange={(val) => setExperience(val)}
                  />

                  <CheckboxGrid
                    label="Have you represented any of the following?"
                    description="Select all competitive tiers you have represented in tournament play."
                    options={REPRESENTED_OPTIONS}
                    selectedValues={represented}
                    onChange={(vals) => {
                      setRepresented(vals);
                      if (errors.represented) setErrors((prev) => ({ ...prev, represented: "" }));
                    }}
                    error={errors.represented}
                  />
                </div>

                {/* 3. Declaration & Consent Section */}
                <div className="flex flex-col gap-6">
                  <div className="pb-2">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-neutral-400" />
                      Declaration & Consent
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">Please review the terms of tournament entry before proceeding to payment.</p>
                  </div>

                  {/* Declaration guidelines card */}
                  <div className="p-5 rounded-xl bg-neutral-900/30 border border-neutral-850 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm pb-2">
                      <ShieldAlert className="w-4.5 h-4.5 text-neutral-400" />
                      <span>Code of Integrity & Verification Statement</span>
                    </div>

                    <ul className="list-disc pl-5 text-xs sm:text-sm text-zinc-400 flex flex-col gap-3 leading-relaxed">
                      <li>I confirm that I am currently employed by the company mentioned above (<span className="font-semibold text-white">{company || "..."}</span>).</li>
                      <li>I confirm that all registration information provided in this portal is accurate.</li>
                      <li>I agree to abide by all Queens Premier League tournament rules, regulations, and official scheduling decisions.</li>
                      <li>I understand that player eligibility, credentials, and active employment details may be verified by the tournament organizers.</li>
                    </ul>
                  </div>

                  {/* Consent checkbox */}
                  <div>
                    <Checkbox
                      id="qpl-consent-checkbox"
                      checked={consentChecked}
                      onChange={(e) => {
                        setConsentChecked(e.target.checked);
                        if (e.target.checked && errors.consent) {
                          setErrors((prev) => ({ ...prev, consent: "" }));
                        }
                      }}
                      label="I declare that I have read and agree to all the above verification statements."
                      error={errors.consent}
                    />
                  </div>
                </div>

                {/* Submit to Payment Button */}
                <div className="flex justify-end mt-4 border-t border-neutral-800 pt-6">
                  <button
                    type="button"
                    onClick={handleProceedToPayment}
                    disabled={isCheckingDuplicate}
                    className="py-3 px-8 rounded-lg bg-white hover:bg-neutral-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-900 font-bold flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                  >
                    {isCheckingDuplicate ? (
                      <>Checking status...</>
                    ) : (
                      <>
                        Proceed to Payment <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}

            {/* PAGE 2: UPI QR Payment scan and proof screenshot upload */}
            {step === 1 && (
              <div className="flex flex-col gap-6 animate-slide-in-right">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Secure UPI Payment</h2>
                  <p className="text-xs text-zinc-400">Scan the QR code below and upload your UPI payment screenshot to complete registration.</p>
                </div>

                <PaymentForm
                  amount={699}
                  onPaymentSuccess={handleScreenshotSelect}
                  onBack={handleBack}
                />
              </div>
            )}

            {/* PAGE 3: Success Confirmation Receipt page */}
            {step === 2 && paymentScreenshot && (
              <div className="flex flex-col items-center text-center py-2 print:py-0 animate-fade-in">

                {/* Success Indicator */}
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mb-4 print:hidden">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 print:hidden">
                  Registration completed!
                </h2>
                <p className="text-sm text-zinc-400 max-w-lg mb-8 leading-relaxed print:hidden">
                  Player registration details for <span className="font-semibold text-white print:text-black">{name}</span> have been sent to QPL audit cells. An email copy has been forwarded to <span className="font-medium text-white print:text-black">{email}</span>.
                </p>

                {/* Printable Invoice Receipt Card */}
                <div className="w-full max-w-2xl p-6 sm:p-8 rounded-2xl border border-white/10 bg-slate-950/60 text-left relative overflow-hidden shadow-xl print:bg-white print:text-black print:border-solid print:border-zinc-300 print:shadow-none print:w-full print:p-6 print-receipt-card">

                  {/* Glowing header accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-amber-500 print:hidden" />

                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col">
                      <span className="text-xs uppercase text-zinc-500 font-semibold tracking-wider">
                        ProSportz Raiders &bull; QPL Registry
                      </span>
                      <span className="text-sm font-black text-white mt-1 print:text-black uppercase">
                        Official Entry Confirmation
                      </span>
                    </div>
                  </div>

                  {/* Player Metadata & Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 py-6 border-y border-white/5 print:border-zinc-200 print:mb-4 print:py-4 print:gap-4">

                    {/* Column 1: Personal info */}
                    <div className="flex flex-col gap-4 md:col-span-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-pink-500 print:text-indigo-700">
                        Player Information
                      </h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs sm:text-sm">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-zinc-500 text-[10px] uppercase">Full Name</span>
                          <span className="text-zinc-200 font-semibold print:text-zinc-800">{name}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-zinc-500 text-[10px] uppercase">Mobile Number</span>
                          <span className="text-zinc-200 font-semibold print:text-zinc-800">{mobile}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-zinc-500 text-[10px] uppercase">Email Address</span>
                          <span className="text-zinc-200 font-semibold print:text-zinc-800">{email}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-zinc-500 text-[10px] uppercase">Corporate Employer</span>
                          <span className="text-zinc-200 font-semibold print:text-zinc-800">{company}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 col-span-2">
                          <span className="text-zinc-500 text-[10px] uppercase">Home City / District</span>
                          <span className="text-zinc-200 font-semibold print:text-zinc-800">{city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Passphoto Preview */}
                    <div className="flex flex-col items-center md:items-end justify-center">
                      {photoUrl ? (
                        <div className="w-24 h-24 rounded-lg overflow-hidden border border-white/10 relative shadow-md bg-slate-900 flex items-center justify-center print:border-zinc-300 print:w-20 print:h-20">
                          <Image
                            src={photoUrl}
                            alt="Player Passphoto"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-lg border border-dashed border-white/10 flex items-center justify-center text-zinc-500 text-xs">
                          Photo Missing
                        </div>
                      )}
                      <span className="text-[9px] uppercase tracking-wider text-zinc-500 mt-2">
                        Registered Photo
                      </span>
                    </div>

                  </div>

                  {/* Football Profile Metadata */}
                  <div className="mb-6 flex flex-col gap-4 print:mb-4 print:gap-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-pink-500 print:text-indigo-700">
                      Football Profile details
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/40 p-4 rounded-xl border border-white/5 print:bg-zinc-50 print:border-zinc-200 print:gap-3 print:p-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-zinc-500 text-[10px] uppercase">Position(s)</span>
                        <span className="text-sm font-semibold text-zinc-200 print:text-zinc-800 capitalize">
                          {positions.join(", ")}
                        </span>
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <span className="text-zinc-500 text-[10px] uppercase">Skill Experience</span>
                        <span className="text-sm font-semibold text-zinc-200 print:text-zinc-800 capitalize">
                          {experience}
                        </span>
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <span className="text-zinc-500 text-[10px] uppercase">Represented Level</span>
                        <span className="text-sm font-semibold text-zinc-200 print:text-zinc-800 capitalize">
                          {represented.join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Transaction breakdown & proof */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5 print:border-zinc-200 text-sm print:gap-4 print:pt-4">
                    {/* Invoice math */}
                    <div className="flex flex-col justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-pink-500 print:text-indigo-700 mb-2">
                          Transaction Summary
                        </h4>
                        <div className="flex flex-col gap-1.5 text-xs sm:text-sm">
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Entry Registration Fee</span>
                            <span className="text-zinc-300 print:text-zinc-700">₹699.00</span>
                          </div>
                          <div className="flex justify-between font-bold border-t border-dashed border-white/10 pt-2 print:border-zinc-200">
                            <span className="text-white print:text-black">Paid (via UPI QR)</span>
                            <span className="text-amber-500 print:text-pink-700">₹699.00 INR</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-zinc-500 leading-relaxed bg-slate-900/30 p-2.5 rounded border border-white/5 print:bg-zinc-50 print:border-zinc-200 print:text-zinc-600">
                        * Tournament auditors will cross-reference the uploaded transaction proof screenshot against the UPI ledger within 24-48 business hours.
                      </div>
                    </div>

                    {/* Screenshot file preview */}
                    <div className="flex flex-col gap-2">
                      <span className="text-xs uppercase text-zinc-500 font-semibold tracking-wider">
                        Uploaded Payment Proof
                      </span>
                      {screenshotUrl ? (
                        <div className="w-full h-32 rounded-lg border border-pink-500/20 overflow-hidden relative shadow-md bg-slate-950 flex items-center justify-center group cursor-pointer print:border-zinc-300 print:h-20">
                          <Image
                            src={screenshotUrl}
                            alt="Payment Receipt Proof"
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-32 rounded-lg border border-dashed border-white/10 flex items-center justify-center text-zinc-500 text-xs">
                          Receipt Missing
                        </div>
                      )}
                    </div>
                  </div>

                </div>
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center mt-8 print:hidden">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="py-2.5 px-5 rounded-lg border border-white/10 text-zinc-350 hover:text-white hover:bg-white/5 transition-all duration-200 text-sm font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Print Registration
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="py-2.5 px-6 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-[0_4px_12px_rgba(226,30,122,0.25)] transition-all duration-200"
                  >
                    Register Another Player
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer info links - Hidden when printing receipt */}
        <footer className="flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500 gap-4 mt-2 mb-12 print:hidden animate-fade-in">
          <span>&copy; {new Date().getFullYear()} Queens Premier League Committee. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm font-semibold text-zinc-400 hover:text-white underline underline-offset-4 transition-colors">Terms & Conditions</Link>
          </div>
        </footer>

      </div>
    </div>
  );
}
