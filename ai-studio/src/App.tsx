/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ArrowRight, Menu, X, Facebook, Instagram, Linkedin } from "lucide-react";
import { useState, useEffect } from "react";

type Lang = "KA" | "EN";

const Nav = ({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "მთავარი", en: "Home", href: "/" },
    { label: "ჩვენს შესახებ", en: "About", href: "/about" },
    { label: "სერვისები", en: "Services", href: "/services" },
    { label: "მეცნიერება და ტექნოლოგია", en: "Science & Technology", href: "/technologies" },
    { label: "პაკეტები", en: "Packages", href: "/packages" },
    { label: "კორპორატიული", en: "Corporate", href: "/corporate" },
    { label: "ხშირი კითხვები", en: "FAQ", href: "/faq" },
    { label: "კონტაქტი", en: "Contact", href: "/contact" },
  ];

  const Logo = () => (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 relative flex items-center justify-center">
        {/* Simple but elegant circular monogram placeholder for LD */}
        <svg viewBox="0 0 100 100" className="w-full h-full fill-dark-brown">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="50" y="65" textAnchor="middle" className="font-serif italic text-5xl font-black">L</text>
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-dark-brown font-black text-lg md:text-xl uppercase tracking-widest leading-none">
          Longevity
        </span>
        <span className="text-burnt-orange font-black text-lg md:text-xl uppercase tracking-widest leading-none">
          One
        </span>
      </div>
    </div>
  );

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 py-6 px-6 md:px-16 ${
        isScrolled ? "bg-bone-white shadow-sm py-4" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        <div className="flex-shrink-0 cursor-pointer">
          <a href="/" className="flex items-center gap-4 group">
            <Logo />
          </a>
        </div>

        {/* Desktop Links */}
        <div className="hidden xl:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a
              key={link.en}
              href={link.href}
              className="text-[11px] font-bold uppercase tracking-[0.1em] text-dark-brown hover:text-burnt-orange transition-colors truncate"
            >
              {lang === "KA" ? link.label : link.en}
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-6">
          <div className="hidden sm:flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-dark-brown">
            <button 
              onClick={() => setLang("KA")}
              className={`hover:opacity-70 transition-opacity ${lang === "KA" ? "text-burnt-orange" : "opacity-40"}`}
            >
              KA
            </button>
            <span className="text-dark-brown/30">/</span>
            <button 
              onClick={() => setLang("EN")}
              className={`hover:opacity-70 transition-opacity ${lang === "EN" ? "text-burnt-orange" : "opacity-40"}`}
            >
              EN
            </button>
          </div>
          <a
            href="#"
            className="bg-burnt-orange text-white px-8 py-3 text-[11px] font-bold uppercase tracking-[0.15em] transition-all hover:bg-dark-brown"
          >
            {lang === "KA" ? "დაჯავშნეთ" : "BOOK NOW"}
          </a>
          <button
            className="xl:hidden text-dark-brown"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-bone-white shadow-xl xl:hidden py-10 px-8 flex flex-col space-y-4 animate-fade-in">
          {navLinks.map((link) => (
            <a
              key={link.en}
              href={link.href}
              className="text-sm font-bold uppercase tracking-[0.1em] text-dark-brown"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {lang === "KA" ? link.label : link.en}
            </a>
          ))}
          <div className="pt-6 border-t border-dark-brown/10 flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-dark-brown">
              {lang === "KA" ? "ენის შერჩევა" : "Language Selection"}
            </span>
            <div className="space-x-4">
              <button 
                onClick={() => { setLang("KA"); setIsMobileMenuOpen(false); }}
                className={`font-bold ${lang === "KA" ? "text-burnt-orange" : "text-dark-brown/40"}`}
              >
                KA
              </button>
              <button 
                onClick={() => { setLang("EN"); setIsMobileMenuOpen(false); }}
                className={`font-bold ${lang === "EN" ? "text-burnt-orange" : "text-dark-brown/40"}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const SectionHeader = ({ lang, eyebrowKa, eyebrowEn, titleKa, titleEn, subtitleKa, subtitleEn }: { 
  lang: Lang;
  eyebrowKa: string; 
  eyebrowEn: string;
  titleKa: string; 
  titleEn: string;
  subtitleKa?: string; 
  subtitleEn?: string;
}) => (
  <div className="mb-16">
    <p className="eyebrow">{lang === "KA" ? eyebrowKa : eyebrowEn}</p>
    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-dark-brown mb-4 font-serif">
      {lang === "KA" ? titleKa : titleEn}
    </h2>
    {(lang === "KA" ? subtitleKa : subtitleEn) && (
      <p className="text-lg font-light text-dark-brown/70 leading-relaxed">
        {lang === "KA" ? subtitleKa : subtitleEn}
      </p>
    )}
  </div>
);

export default function App() {
  const [lang, setLang] = useState<Lang>("KA");
  
  const journeySteps = [
    {
      num: "01",
      ka: "იდენტიფიკაცია",
      en: "IDENTIFICATION",
      textKa: "თქვენი მოგზაურობა იწყება 360° ბიოლოგიური აუდიტით. ჩვენ ვაანალიზებთ თქვენს ფიზიკურ მაჩვენებლებს, მეტაბოლიზმს, VO₂ Max-ს, ეპიგენეტიკასა და მიკრობიომს.",
      textEn: "Your journey begins with a 360° biological audit. We analyse your physical metrics, metabolism, VO₂ Max, epigenetics, and microbiome.",
    },
    {
      num: "02",
      ka: "მოდელირება",
      en: "MODELLING",
      textKa: "მიღებული მონაცემების საფუძველზე ვქმნით თქვენი ჯანმრთელობის ინდივიდუალურ მოდელს — პერსონალურ დღეგრძელობის რუქას.",
      textEn: "Based on the gathered data, we build your individual health model — your personal longevity map.",
    },
    {
      num: "03",
      ka: "ოპტიმიზაცია",
      en: "OPTIMISATION",
      textKa: "ვიწყებთ მიზნობრივ თერაპიებს — IHHT და Red Light — უჯრედული ენერგიის აღსადგენად და შესაძლებლობების მაქსიმიზაციისთვის.",
      textEn: "We begin targeted therapies — IHHT and Red Light — to restore your cellular energy and maximise your capabilities.",
    },
    {
      num: "04",
      ka: "ევოლუცია",
      en: "EVOLUTION",
      textKa: "ჩვენი ექსპერტები რეგულარულად აფასებენ თქვენს პროგრესს და განაახლებენ სტრატეგიას — განუწყვეტელი, გაზომვადი გაუმჯობესებისთვის.",
      textEn: "Our experts regularly assess your progress and refine the strategy — for continuous, measurable improvement.",
    },
  ];

  const pillars = [
    {
      ka: "დღეგრძელობა",
      en: "LONGEVITY",
      descKa: "დაბერების პროცესის შენელება და ბიოლოგიური ასაკის მართვა — მაღალი პროდუქტიულობის შენარჩუნებისთვის.",
      descEn: "Slowing the ageing process and managing your biological age to sustain peak productivity.",
    },
    {
      ka: "მეტაბოლური ჯანმრთელობა",
      en: "METABOLIC HEALTH",
      descKa: "ნივთიერებათა ცვლის ოპტიმიზაცია და პერსონალიზებული კვება — თქვენი უჯრედული მეტაბოლიზმის მონაცემებზე დაყრდნობით.",
      descEn: "Optimising metabolism and personalised nutrition based entirely on your cellular metabolic data.",
    },
    {
      ka: "ელიტური პერფორმანსი",
      en: "ELITE PERFORMANCE",
      descKa: "ფიზიკური შესაძლებლობების პიკი და სწრაფი აღდგენა — მეცნიერული უპირატესობით.",
      descEn: "Peak physical capability and accelerated recovery, backed by science.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Nav lang={lang} setLang={setLang} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale scale-105 pointer-events-none"
          style={{ 
            backgroundImage: `url('https://lh3.googleusercontent.com/aida/ADBb0ui99I_g92zKIS0Ot4mo7qj6GvVrb1Cm2wpPtGNab0An-oeJvUY3_m3aKWIhDZOZlm92B17-tZsiKYPeKwJOATpHUH5hLkN8yQ36PAVZag0A9lfrXDM0VwXkNMCSU4MY8rvQ1cMGQmrvyqWYCLwinMWAg_NYjWvhSybImDOOWp3NaREpllYFe3N823PWgBYthckhnuXFARuGYi6jolzQEV5TAa_TIAcmLr4EIJPt5RT4Q6N1ZauY20F6Ht9wEHpQUg0fppDqkoDiJI4')`,
            backgroundAttachment: 'fixed',
            filter: 'grayscale(100%) contrast(1.1) brightness(1.2)'
          }}
        />
        <div className="absolute inset-0 bg-bone-white/70 backdrop-blur-[2px]" />
        
        <div className="section-container relative z-10 text-center">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="eyebrow"
          >
            {lang === "KA" ? "დღეგრძელობის ხელოვნება" : "THE ART OF LIVING LONGER"}
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black leading-[1.05] mb-8 font-serif"
          >
            {lang === "KA" ? (
              <>მართეთ თქვენი<br />ბიოლოგიური დრო.</>
            ) : (
              <>Master Your<br />Biological Time.</>
            )}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-2xl font-light mb-8 font-serif italic"
          >
            {lang === "KA" ? "სიცოცხლის გახანგრძლივება სიზუსტით" : "Longevity through precision."}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-2xl mx-auto space-y-6 text-dark-brown/90 leading-relaxed mb-12"
          >
            <p className="text-xl">
              {lang === "KA" 
                ? "Longevity One — პრევენციული მედიცინის ცენტრი, სადაც სამეცნიერო სიზუსტე შეხვდება დღეგრძელობის ხელოვნებას."
                : "Longevity One — a preventive medicine centre where scientific precision meets the art of longevity."
              }
            </p>
            <p className="text-sm opacity-70 font-medium italic">
              {lang === "KA"
                ? "ჩვენი მიზანი არ არის მხოლოდ დაავადების არარსებობა, არამედ ადამიანის ბიოლოგიური პოტენციალის მაქსიმიზაცია — ზუსტ მონაცემებსა და მეცნიერებაზე დაყრდნობით."
                : "Our goal is not merely the absence of disease, but the maximisation of human biological potential — grounded in precise data and science."
              }
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <button className="btn-primary min-w-[280px]">
              {lang === "KA" ? "დაიწყეთ თქვენი მოგზაურობა" : "START YOUR JOURNEY"} <span>→</span>
            </button>
            <button className="btn-secondary min-w-[240px]">
              {lang === "KA" ? "გაიგეთ მეტი" : "DISCOVER MORE"} <span>→</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-32 relative overflow-hidden bg-bone-white">
        <div 
          className="absolute right-0 top-0 w-1/2 h-full opacity-15 grayscale mix-blend-multiply pointer-events-none"
          style={{ 
            backgroundImage: `url('https://lh3.googleusercontent.com/aida/ADBb0ujI4WgTnxVKHUsTyBqZiZ04Lopf8xoGUoPy7ugvPbzFfRHQLEuwh-e4h36nhsUnecYoJxbMJujsz3yEbWI1fkMhsO9wPDbZ9mXTBA5zL2-etxDAN1nOSYiLwJFGQ19WISrZ0V1mndqaAuZQloc_-L5I7vIBbwi_5WZWhZL4M661LW2jzIpqnYKReNdDRShzgYR6MsA4gZclD8-5vFS1kmNHqoSQCGqyQ2oxKFyOglTTV7EBt2By2SqTWSTm9vHdVXt-uPEVFrlBBNc')`,
            backgroundSize: 'contain',
            backgroundPosition: 'right center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="section-container relative z-10">
          <SectionHeader 
            lang={lang}
            eyebrowKa="თქვენი გზა — ოთხი ნაბიჯი"
            eyebrowEn="YOUR JOURNEY — FOUR STEPS"
            titleKa="თქვენი მოგზაურობა ოთხ ნაბიჯში"
            titleEn="Your Journey in Four Steps"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-20">
            {journeySteps.map((step, idx) => (
              <motion.div 
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group"
              >
                <span className="text-7xl font-black text-burnt-orange/15 font-serif block mb-4 group-hover:text-burnt-orange/30 transition-colors">
                  {step.num}
                </span>
                <h3 className="text-xl font-bold uppercase tracking-widest mb-1">{lang === "KA" ? step.ka : step.en}</h3>
                <div className="space-y-4 text-sm leading-relaxed mt-6">
                  <p className="font-medium text-dark-brown">{lang === "KA" ? step.textKa : step.textEn}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-32 bg-dark-brown text-bone-white relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10 grayscale pointer-events-none mix-blend-overlay"
          style={{ 
            backgroundImage: `url('https://lh3.googleusercontent.com/aida/ADBb0uj8iTv9Z-HSn3QputBCqMwJVLqrkvfvxfUN2GnBFWOZGS9xvP4ZjmKu5Q86IXbeoP5ZgWckjhlVVSDSFxU85uuDHB6l8IN7GoNVHsFkJGNu1Sga1Cq0WRpYKdgptzbe7CP88JsheOL_6Siu2AcqWqsHBuKUk-UTIpvR_QK5NLZ2uLAiO63jSgULSl1NT9xNxEDlewIo-hRP6kBdaEieKVrBKGPPfTkwAV4mNtB56uRzyNlnCbH0UmFKPxU-GQE46WHVVCdjd1DeJ6g')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="section-container relative z-10 text-center">
          <p className="text-burnt-orange uppercase tracking-[0.3em] font-bold text-xs mb-6">
            {lang === "KA" ? "სამი მიმართულება. ერთი მიზანი." : "THREE PILLARS. ONE PURPOSE."}
          </p>
          <h2 className="text-4xl md:text-6xl font-black mb-24 font-serif whitespace-pre-line">
            {lang === "KA" ? "სამი საყრდენი\nერთი მიზანი" : "Three Pillars\nOne Purpose"}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 text-left">
            {pillars.map((pillar, idx) => (
              <motion.div 
                key={pillar.en}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="border-t border-bone-white/10 pt-10 flex flex-col group cursor-default"
              >
                <h3 className="text-2xl font-bold mb-1 group-hover:text-burnt-orange transition-colors">
                  {lang === "KA" ? pillar.ka : pillar.en}
                </h3>
                <div className="space-y-4 text-sm font-light mb-10 mt-6 flex-grow">
                  <p className="leading-relaxed opacity-90">{lang === "KA" ? pillar.descKa : pillar.descEn}</p>
                </div>
                <a href="#" className="flex items-center text-burnt-orange font-bold uppercase tracking-[0.2em] text-[10px] group-hover:pl-2 transition-all">
                  {lang === "KA" ? "გაიგეთ მეტი" : "EXPLORE"} <ArrowRight size={14} className="ml-2" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Science Section */}
      <section className="py-32 bg-bone-white relative overflow-hidden">
        <div 
          className="absolute right-0 bottom-0 w-1/3 h-full opacity-10 grayscale pointer-events-none"
          style={{ 
            backgroundImage: `url('https://lh3.googleusercontent.com/aida/ADBb0ujNkPIbipN1fdx63bKMDGvxru0JxhwmpPqO7XJcIB0zqXwtwNCCpy-h-pR1rmG6x8qdFE4LgACmDAjj0uZLoJ4xguevv69SPHupOiQZPKkBSOmOWh3pRM-u68nbVrqRygbXi9KEsDsxygCKXB-KJqgVwAhHZazOd25xQXvcqqcJYZIA5GZ1UQaDmCUIgookwAe04nxFS1SJwpNk9hHpDJMmFp6AVncrEYtshM8vPiwTD17iTiX5QQgb76Tyh7VkMP-y1EQ0FSHSMvc')`,
            backgroundSize: 'contain',
            backgroundPosition: 'right bottom',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="section-container relative z-10">
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="lg:w-1/3">
              <SectionHeader 
                lang={lang}
                eyebrowKa="ინოვაციური დიაგნოსტიკა — სიზუსტის ხელოვნება"
                eyebrowEn="INNOVATIVE DIAGNOSTICS — THE ART OF PRECISION"
                titleKa="მეცნიერება შედეგების მიღმა"
                titleEn="The Science Behind the Results"
                subtitleKa="ოპტიმიზაციის დაწყებამდე ჩვენ ზუსტად ვზომავთ თქვენს ბიოლოგიურ საწყის მდგომარეობას — მსოფლიოს წამყვანი ტექნოლოგიებით."
                subtitleEn="Before optimisation begins, we precisely measure your biological baseline using the world's leading technologies."
              />
            </div>
            
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
              {[
                { name: "PNOE", ka: "მეტაბოლიზმის „ოქროს სტანდარტი\"", en: "The gold standard of metabolism testing" },
                { name: "IHHT", ka: "უჯრედული გაკაჟება", en: "Train your cells, not just your muscles" },
                { name: "Red Light", ka: "ფოტო-ბიომოდულაცია", en: "Cellular regeneration through light" },
                { name: "TrueDiagnostic", ka: "გაიგეთ თქვენი ბიოლოგიური ასაკი", en: "Know your biological age" },
                { name: "Enbiosis", ka: "ნაწლავები — ჯანმრთელობის გასაღები", en: "Your gut holds the key to your health" },
              ].map((tech) => (
                <div key={tech.name} className="border-t border-dark-brown/10 pt-6">
                  <h4 className="text-2xl font-bold mb-1">{tech.name}</h4>
                  <p className="text-sm font-bold text-dark-brown leading-tight mb-1">{lang === "KA" ? tech.ka : tech.en}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-bone-white border-y border-dark-brown/5">
        <div className="section-container text-center mb-24">
          <SectionHeader 
            lang={lang}
            eyebrowKa="ინვესტიცია თქვენს მომავალში"
            eyebrowEn="INVESTMENT IN YOUR FUTURE"
            titleKa="ინვესტიცია თქვენს მომავალში"
            titleEn="Invest in Your Future"
            subtitleKa="ჩვენ არ გთავაზობთ სტანდარტულ პროცედურებს. ჩვენ გთავაზობთ სიცოცხლის გახანგრძლივების მეცნიერულად დასაბუთებულ, პერსონალურ სტრატეგიას."
            subtitleEn="We do not offer standard procedures. We provide a scientifically validated, personalised strategy for extending your life."
          />
        </div>

        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="border border-dark-brown/20 p-12 hover:border-burnt-orange transition-all flex flex-col">
              <h3 className="text-2xl font-black tracking-[0.2em] uppercase mb-6 font-sans">STARTER</h3>
              <div className="text-4xl font-bold text-burnt-orange mb-10 pb-10 border-b border-dark-brown/10 font-serif lowercase italic">
                550 <span className="text-sm font-sans font-bold uppercase tracking-widest not-italic">GEL</span>
              </div>
              <ul className="space-y-6 text-sm font-medium text-dark-brown/80 mb-12 flex-grow">
                <li>PNOE Diagnostics</li>
                <li>{lang === "KA" ? "დინამომეტრია" : "Dynamometry"}</li>
              </ul>
              <button className="btn-secondary w-full">{lang === "KA" ? "არჩევა" : "SELECT"}</button>
            </div>

            {/* Performance */}
            <div className="bg-dark-brown text-bone-white p-12 border border-dark-brown shadow-2xl relative lg:-mt-8 lg:mb-8 flex flex-col transform lg:scale-105 z-10 transition-transform">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-burnt-orange" />
              <h3 className="text-2xl font-black tracking-[0.2em] uppercase mb-6 font-sans">PERFORMANCE</h3>
              <div className="text-4xl font-bold text-burnt-orange mb-10 pb-10 border-b border-bone-white/10 font-serif lowercase italic">
                1,850 <span className="text-sm font-sans font-bold uppercase tracking-widest not-italic">GEL</span>
              </div>
              <ul className="space-y-6 text-sm font-medium mb-12 flex-grow">
                <li className="font-black text-burnt-orange uppercase">{lang === "KA" ? "STARTER პაკეტი" : "STARTER PACKAGE"}</li>
                <li>5 {lang === "KA" ? "სესია" : "sessions"} Red Light</li>
                <li>5 {lang === "KA" ? "სესია" : "sessions"} IHHT</li>
              </ul>
              <button className="btn-primary w-full shadow-lg">{lang === "KA" ? "არჩევა" : "SELECT"}</button>
            </div>

            {/* Elite */}
            <div className="border border-dark-brown/20 p-12 hover:border-burnt-orange transition-all flex flex-col">
              <h3 className="text-2xl font-black tracking-[0.2em] uppercase mb-6 font-sans">ELITE</h3>
              <div className="text-4xl font-bold text-burnt-orange mb-10 pb-10 border-b border-dark-brown/10 font-serif lowercase italic">
                3,200 <span className="text-sm font-sans font-bold uppercase tracking-widest not-italic">GEL</span>
              </div>
              <ul className="space-y-6 text-sm font-medium text-dark-brown/80 mb-12 flex-grow">
                <li className="font-black text-burnt-orange/60 uppercase">{lang === "KA" ? "STARTER პაკეტი" : "STARTER PACKAGE"}</li>
                <li>10 {lang === "KA" ? "სესია" : "sessions"} Red Light</li>
                <li>10 {lang === "KA" ? "სესია" : "sessions"} IHHT</li>
                <li className="font-black text-burnt-orange italic">{lang === "KA" ? "პერსონალური გეგმა" : "Personal Longevity Plan"}</li>
              </ul>
              <button className="btn-secondary w-full">{lang === "KA" ? "არჩევა" : "SELECT"}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Team Intro */}
      <section className="py-40 bg-dark-brown text-bone-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-5xl md:text-8xl font-black mb-8 leading-tight font-serif"
          >
            {lang === "KA" ? "თქვენი დღეგრძელობის გუნდი" : "Your Longevity Team"}
          </motion.h2>
          <p className="text-burnt-orange uppercase tracking-widest font-bold mb-10">
            {lang === "KA" ? "ხუთი ექიმი. ერთი ხედვა." : "FIVE PHYSICIANS. ONE VISION."}
          </p>
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-xl md:text-2xl font-light leading-relaxed">
              {lang === "KA" 
                ? "საქართველოსა და საერთაშორისო სცენაზე დაგროვილი გამოცდილება — გაერთიანებული ქვეყნის პირველი სპეციალიზებული დღეგრძელობის კლინიკის შესაქმნელად."
                : "Combined international experience — brought together to build the country's first dedicated longevity clinic."
              }
            </p>
          </div>
        </div>
      </section>

      {/* Stop Guessing CTA */}
      <section className="py-40 relative overflow-hidden bg-black text-bone-white text-center">
        <div 
          className="absolute inset-0 grayscale opacity-40 mix-blend-overlay scale-110"
          style={{ 
            backgroundImage: `url('https://lh3.googleusercontent.com/aida/ADBb0uglcaUHSiWpEZkLrdwmY3ijU0ArOsUJ3TAxm3q5HBYQ444EwNsJCr0BSM27n88LWkvg3kMAnFkaJsLwP1tistsc0orH1z8rBSmbXP9i_HgRSJHP6dVNE0XnwWnLXqL0nFhilEPXJTDG_Z6a6d6Qp_r7Q9mFUd8K7PeDi1Ih04ORL8gTt5tpUz3PzBYN3AQjUm9-1j-9SdDwat1n_3_AI_tReO6v-jqdGXKRz3y1bWbka3W8yuOQ41DykTzZ3KaxTau_ueBYceC4GvM')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="section-container relative z-10 max-w-4xl">
          <motion.h2 
            initial={{ opacity: 0, scale: 1.1 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-8xl font-black mb-8 leading-none font-serif"
          >
            {lang === "KA" ? (
              <>შეწყვიტეთ ვარაუდი.<br />დაიწყეთ გაზომვა.</>
            ) : (
              <>Stop Guessing.<br />Start Measuring.</>
            )}
          </motion.h2>
          
          <div className="max-w-xl mx-auto mb-16 space-y-4">
            <p className="text-lg">
              {lang === "KA" 
                ? "დაჯავშნეთ პირველი კონსულტაცია და მიიღეთ სრული ბიოლოგიური შეფასება."
                : "Book your initial consultation and receive a complete biological assessment."
              }
            </p>
          </div>

          <button className="btn-primary min-w-[300px]">
            {lang === "KA" ? "კონსულტაციის დაჯავშნა" : "BOOK A CONSULTATION"} <span>→</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bone-white pt-32 pb-16 px-6 md:px-16 border-t border-dark-brown/10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
          <div>
            <div className="font-black text-2xl uppercase tracking-tighter mb-2">
            LONGEVITY ONE
          </div>
          <p className="text-[10px] font-bold text-burnt-orange uppercase tracking-widest mb-1">
            {lang === "KA" ? "დღეგრძელობის ხელოვნება" : "THE ART OF LIVING LONGER"}
          </p>
          
          <div className="mt-10 flex space-x-4">
              <a href="#" className="hover:text-burnt-orange transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-burnt-orange transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-burnt-orange transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="font-bold uppercase text-xs tracking-widest">{lang === "KA" ? "კონტაქტი" : "Contact"}</h5>
            <div className="text-sm font-light space-y-4">
              <p>{lang === "KA" ? "თამარაშვილის 4ა, თბილისი" : "4a Tamarashvili Street, Tbilisi"}</p>
              
              <p>{lang === "KA" ? "ყოველდღე 09:00 – 21:00" : "Every day 09:00 – 21:00"}</p>

              <p className="font-bold">+995 577 26 05 57<br />
              <span className="text-burnt-orange font-normal">info@longevityone.ge</span></p>
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="font-bold uppercase text-xs tracking-widest">{lang === "KA" ? "ნავიგაცია" : "Menu"}</h5>
            <ul className="text-sm font-medium space-y-3">
              <li><a href="/about" className="hover:text-burnt-orange transition-colors uppercase">{lang === "KA" ? "ჩვენს შესახებ" : "About Us"}</a></li>
              <li><a href="/services" className="hover:text-burnt-orange transition-colors uppercase">{lang === "KA" ? "სერვისები" : "Services"}</a></li>
              <li><a href="/technologies" className="hover:text-burnt-orange transition-colors uppercase">{lang === "KA" ? "ტექნოლოგია" : "Technology"}</a></li>
              <li><a href="/packages" className="hover:text-burnt-orange transition-colors uppercase">{lang === "KA" ? "პაკეტები" : "Packages"}</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="font-bold uppercase text-xs tracking-widest">{lang === "KA" ? "ინფორმაცია" : "Legal"}</h5>
            <ul className="text-sm font-medium space-y-3">
              <li><a href="/faq" className="hover:text-burnt-orange transition-colors uppercase">{lang === "KA" ? "ხშირი კითხვები" : "FAQ"}</a></li>
              <li><a href="/privacy" className="hover:text-burnt-orange transition-colors uppercase">{lang === "KA" ? "კონფიდენციალურობა" : "Privacy Policy"}</a></li>
              <li><a href="/terms" className="hover:text-burnt-orange transition-colors uppercase">{lang === "KA" ? "წესები და პირობები" : "Terms"}</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto mt-32 pt-10 border-t border-dark-brown/10 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold text-dark-brown/40 uppercase tracking-widest">
          <p>
            {lang === "KA" 
              ? "© 2026 Longevity One. ყველა უფლება დაცულია." 
              : "© 2026 Longevity One. All rights reserved."
            }
          </p>
        </div>
      </footer>
    </div>
  );
}
