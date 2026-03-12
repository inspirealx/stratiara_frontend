import React from 'react';
import { motion } from 'framer-motion';
import {
    Bot,
    Linkedin,
    Twitter,
    Instagram,
    Youtube,
    Sparkles,
    Mic,
    Image as ImageIcon,
    Video
} from 'lucide-react';
import { Link } from 'react-router-dom';

const IntegrationsSection = () => {
    // Core platforms and models specifically curated for the landing page
    const coreIntegrations = [
        { name: 'Gemini', icon: Sparkles, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'ChatGPT', icon: Bot, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { name: 'Claude', icon: Bot, color: 'text-orange-600', bg: 'bg-orange-600/10' },
        { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', bg: 'bg-blue-700/10' },
        { name: 'Twitter/X', icon: Twitter, color: 'text-black dark:text-white', bg: 'bg-white/10' },
        { name: 'Instagram', icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-600/10' },
        { name: 'YouTube', icon: Youtube, color: 'text-red-600', bg: 'bg-red-600/10' },
        { name: 'ElevenLabs', icon: Mic, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    ];

    return (
        <section className="py-20 bg-secondary/30 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto mb-16"
                >
                    <span className="inline-flex h-8 items-center rounded-full border border-primary/20 bg-primary/10 px-4 text-sm font-medium text-primary mb-6">
                        Powerful Ecosystem
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                        Integrate with <span className="bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">everything.</span>
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Connect Stratiara directly to the world's best AI models and social platforms.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
                    {coreIntegrations.map((integration, index) => (
                        <motion.div
                            key={integration.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05, duration: 0.4 }}
                            className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all border border-border/50 hover:border-primary/30 group"
                        >
                            <div className={`mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-xl ${integration.bg} transition-transform group-hover:scale-110 duration-300`}>
                                <integration.icon className={`w-6 h-6 ${integration.color}`} />
                            </div>
                            <h4 className="font-medium text-foreground">{integration.name}</h4>
                        </motion.div>
                    ))}
                </div>

                {/* CTA to Features Page */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 flex flex-col items-center justify-center space-y-4"
                >
                    <p className="text-sm text-muted-foreground">
                        Plus 30+ more AI models including Viggle, Veo 3, Midjourney, and Luma.
                    </p>
                    <Link
                        to="/features"
                        className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 h-11 px-8 py-2"
                    >
                        See all 40+ Integrations →
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default IntegrationsSection;
