// components/sections/Contacts.tsx
"use client";
import { useState, useRef } from "react";
import emailjs from '@emailjs/browser'; // Import library
import { FiLinkedin, FiGithub, FiInstagram } from 'react-icons/fi';
import { portfolioData } from "@/data/portfolioData";

export const Contacts = () => {
    const form = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const sendEmail = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!form.current) return;
        setStatus('sending');

        emailjs.sendForm(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
            form.current,
            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
        ).then((result) => {
            console.log(result.text);
            setStatus('success');
            form.current?.reset();
            setTimeout(() => setStatus('idle'), 3000);
        }, (error) => {
            console.log(error.text);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        });
    };
    
    // Fungsi untuk mendapatkan teks tombol berdasarkan status
    const getButtonClasses = () => {
        let baseClasses = "w-full py-3 text-lg font-semibold rounded-md transition-all duration-300";
        switch (status) {
            case 'sending': 
                return `${baseClasses} bg-gray-500 border-gray-400 text-foreground cursor-not-allowed`;
            case 'success': 
                return `${baseClasses} bg-green-500 border-green-500 text-green-300`;
            case 'error': 
                return `${baseClasses} bg-red-500 border-red-500 text-red-300`;
            default: 
                return `${baseClasses} border border-primary text-white `;
        }
    };
    
    return (
        <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Contact Me</h2>
            <p className="mb-8 text-foreground/80">Interested to work with me? Let me know!</p>

            <form ref={form} onSubmit={sendEmail} className="w-full p-8 space-y-6 rounded-xl glass-effect">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" name="name" placeholder="Name" required className="w-full p-3 rounded-lg bg-white/20 dark:bg-black/20 border border-transparent focus:border-primary focus:ring-primary outline-none transition"/>
                    <input type="email" name="email" placeholder="Email" required className="w-full p-3 rounded-lg bg-white/20 dark:bg-black/20 border border-transparent focus:border-primary focus:ring-primary outline-none transition"/>
                </div>
                <textarea name="message" placeholder="Message" rows={5} required className="w-full p-3 rounded-lg bg-white/20 dark:bg-black/20 border border-transparent focus:border-primary focus:ring-primary outline-none transition"></textarea>
                
                {/* Tombol dengan warna solid dan status dinamis */}
                <button type="submit" disabled={status === 'sending'} className={getButtonClasses()}>
                    {status === 'sending' ? 'Sending...' : status === 'success' ? 'Sent!' : status === 'error' ? 'Failed, please try again!' : 'Send Message'}
                </button>
            </form>

            <div className="mt-12">
                <p className="mb-4 text-foreground/70">Or find me at :</p>
                <div className="flex justify-center gap-6">
                    <a href={portfolioData.contacts.linkedin} target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-primary transition-colors"><FiLinkedin size={28} /></a>
                    <a href={portfolioData.contacts.github} target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-primary transition-colors"><FiGithub size={28} /></a>
                    <a href={portfolioData.contacts.instagram} target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-primary transition-colors"><FiInstagram size={28} /></a>
                </div>
            </div>
        </div>
    );
};