'use client'

import api from '@/lib/api';
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    CheckCircle2,
    Palmtree,
    Image as ImageIcon,
    MapPin,
    Calendar,
    Users,
    Package,
    Plus,
    Trash2,
    Save,
    Send,
    Loader2,
    Navigation,
    Briefcase
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import ImageUpload from "@/components/ImageUpload";

export default function CreateTourPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        location: '',
        price: '',
        duration: '',
        description: '',
        hero_image: '',
        status: 'DRAFT',
        available_slots: 50,
        tags: [] as string[],
        themes: [] as string[],
        itinerary: [] as any[],
        guides: [] as any[],
        included: [] as any[],
        excluded: [] as any[],
        meeting_point: '',
        packing_list: [] as string[]
    });

    const [newTag, setNewTag] = useState('');
    const [newTheme, setNewTheme] = useState('');
    const [newPackingItem, setNewPackingItem] = useState('');

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else router.back();
    };

    const addItineraryDay = () => {
        setFormData({
            ...formData,
            itinerary: [...formData.itinerary, { day: formData.itinerary.length + 1, title: '', subtitle: '', content: '', images: [] }]
        });
    };

    const removeItineraryDay = (index: number) => {
        const newItinerary = formData.itinerary.filter((_, i) => i !== index);
        // Re-index days
        const reindexed = newItinerary.map((day, i) => ({ ...day, day: i + 1 }));
        setFormData({ ...formData, itinerary: reindexed });
    };

    const addGuide = () => {
        setFormData({
            ...formData,
            guides: [...formData.guides, { name: '', role: '', image: '' }]
        });
    };

    const addInclusion = () => {
        setFormData({
            ...formData,
            included: [...formData.included, { label: '', icon_name: 'CheckCircle2' }]
        });
    };

    const addExclusion = () => {
        setFormData({
            ...formData,
            excluded: [...formData.excluded, { label: '' }]
        });
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await api.post('/tours', {
                ...formData,
                price: Number(formData.price),
                available_slots: Number(formData.available_slots)
            });

            if (response.status === 201 || response.status === 200) {
                router.push('/agent/tours');
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (error: any) {
            console.error('Submit error:', error);
            alert(`Failed to save tour: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 lg:space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between sticky top-0 bg-[#F8F9FA]/80 backdrop-blur-md py-4 lg:py-6 z-30 gap-4">
                <div className="flex items-center gap-4 lg:gap-6">
                    <button
                        onClick={handleBack}
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-all shadow-sm"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl lg:text-2xl font-black text-zinc-900 tracking-tight">Experience Builder</h1>
                        <p className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase mt-0.5">
                            {step === 1 ? 'Primary Details' : step === 2 ? 'Experience Map' : 'Inclusions & Experts'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="flex items-center gap-1.5 lg:gap-2 px-2 sm:px-4 lg:px-6">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`h-1 lg:h-1.5 rounded-full transition-all duration-500 ${step === s ? 'w-8 lg:w-10 bg-amber shadow-sm' : step > s ? 'w-3 lg:w-4 bg-emerald-500' : 'w-3 lg:w-4 bg-zinc-200'
                                    }`}
                            />
                        ))}
                    </div>
                    {step < 3 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="bg-zinc-900 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-xs tracking-widest uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-zinc-200"
                        >
                            Next Module
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="bg-emerald-500 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-xs tracking-widest uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                            Publish
                        </button>
                    )}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 lg:space-y-8"
                >
                    {step === 1 && (
                        <div className="space-y-6 lg:space-y-8">
                            {/* Core Info */}
                            <section className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-10 border border-zinc-100 shadow-sm space-y-6 lg:space-y-8">
                                <div className="flex items-center gap-3 text-zinc-900">
                                    <Palmtree size={20} className="text-amber" />
                                    <h3 className="font-bold tracking-tight text-base lg:text-lg">Core Metadata</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Experience Title</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Serengeti Silk Safari"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-zinc-50 border-none rounded-xl lg:rounded-2xl py-4 lg:py-5 px-6 lg:px-8 text-xs lg:text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all placeholder:text-zinc-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">SEO Slug</label>
                                        <input
                                            type="text"
                                            placeholder="serengeti-safari"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="w-full bg-zinc-50 border-none rounded-xl lg:rounded-2xl py-4 lg:py-5 px-6 lg:px-8 text-xs lg:text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all placeholder:text-zinc-200"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Global Location</label>
                                        <div className="relative">
                                            <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300" />
                                            <input
                                                type="text"
                                                placeholder="Tokyo, Japan"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full bg-zinc-50 border-none rounded-xl lg:rounded-2xl py-4 lg:py-5 pl-14 pr-6 lg:pr-8 text-xs lg:text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Meeting Point</label>
                                        <div className="relative">
                                            <Navigation size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300" />
                                            <input
                                                type="text"
                                                placeholder="Terminal Gate B-12"
                                                value={formData.meeting_point}
                                                onChange={(e) => setFormData({ ...formData, meeting_point: e.target.value })}
                                                className="w-full bg-zinc-50 border-none rounded-xl lg:rounded-2xl py-4 lg:py-5 pl-14 pr-6 lg:pr-8 text-xs lg:text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Base Rate (PP)</label>
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 font-black">₦</span>
                                            <input
                                                type="number"
                                                placeholder="1850000"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full bg-zinc-50 border-none rounded-xl lg:rounded-2xl py-4 lg:py-5 pl-12 pr-6 lg:pr-8 text-xs lg:text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Duration</label>
                                        <div className="relative">
                                            <Calendar size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300" />
                                            <input
                                                type="text"
                                                placeholder="7 Days / 6 Nights"
                                                value={formData.duration}
                                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                                className="w-full bg-zinc-50 border-none rounded-xl lg:rounded-2xl py-4 lg:py-5 pl-14 pr-6 lg:pr-8 text-xs lg:text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Visuals & Description */}
                            <section className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-10 border border-zinc-100 shadow-sm space-y-6 lg:space-y-8">
                                <div className="flex items-center gap-3 text-zinc-900">
                                    <ImageIcon size={20} className="text-amber" />
                                    <h3 className="font-bold tracking-tight text-base lg:text-lg">Visual Storytelling</h3>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Hero Image (Header)</label>
                                    <ImageUpload
                                        value={formData.hero_image}
                                        onChange={(url) => setFormData({ ...formData, hero_image: url })}
                                        onRemove={() => setFormData({ ...formData, hero_image: '' })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Elevator Pitch</label>
                                    <textarea
                                        rows={5}
                                        placeholder="Traverse ancient pathways..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-zinc-50 border-none rounded-xl lg:rounded-2xl py-4 lg:py-5 px-6 lg:px-8 text-xs lg:text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all resize-none"
                                    />
                                </div>
                            </section>

                            {/* Tags & Themes */}
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                <div className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-8 border border-zinc-100 shadow-sm space-y-4 lg:space-y-6">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Marketing Tags</label>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map(tag => (
                                            <span key={tag} className="bg-zinc-900 text-white text-[9px] lg:text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-2">
                                                {tag}
                                                <button onClick={() => setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })}>×</button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (setFormData({ ...formData, tags: [...formData.tags, newTag] }), setNewTag(''))}
                                            placeholder="Tag..."
                                            className="flex-1 bg-zinc-50 border-none rounded-lg lg:rounded-xl py-2.5 lg:py-3 px-4 lg:px-6 text-[10px] lg:text-xs font-bold"
                                        />
                                        <button
                                            onClick={() => { if (newTag) setFormData({ ...formData, tags: [...formData.tags, newTag] }), setNewTag('') }}
                                            className="w-10 h-10 lg:w-12 lg:h-12 bg-zinc-100 rounded-lg lg:rounded-xl flex items-center justify-center text-zinc-900"
                                        ><Plus size={18} /></button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-8 border border-zinc-100 shadow-sm space-y-4 lg:space-y-6">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Core Themes</label>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.themes.map(theme => (
                                            <span key={theme} className="bg-amber text-black text-[9px] lg:text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-2">
                                                {theme}
                                                <button onClick={() => setFormData({ ...formData, themes: formData.themes.filter(t => t !== theme) })}>×</button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newTheme}
                                            onChange={(e) => setNewTheme(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (setFormData({ ...formData, themes: [...formData.themes, newTheme] }), setNewTheme(''))}
                                            placeholder="Theme..."
                                            className="flex-1 bg-zinc-50 border-none rounded-lg lg:rounded-xl py-2.5 lg:py-3 px-4 lg:px-6 text-[10px] lg:text-xs font-bold"
                                        />
                                        <button
                                            onClick={() => { if (newTheme) setFormData({ ...formData, themes: [...formData.themes, newTheme] }), setNewTheme('') }}
                                            className="w-10 h-10 lg:w-12 lg:h-12 bg-zinc-100 rounded-lg lg:rounded-xl flex items-center justify-center text-zinc-900"
                                        ><Plus size={18} /></button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 lg:space-y-8">
                            <div className="flex items-center justify-between gap-4">
                                <h3 className="text-lg lg:text-xl font-black text-zinc-900">Itinerary Orchestration</h3>
                                <button
                                    onClick={addItineraryDay}
                                    className="text-amber font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:underline flex-shrink-0"
                                >
                                    <Plus size={16} /> <span className="hidden sm:inline">Add Day Sequence</span><span className="sm:hidden">Add Day</span>
                                </button>
                            </div>

                            <div className="space-y-6">
                                {formData.itinerary.map((day, idx) => (
                                    <motion.div
                                        key={idx}
                                        layout
                                        className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden"
                                    >
                                        <div className="p-6 lg:p-8 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/50 gap-4">
                                            <div className="flex items-center gap-3 lg:gap-4 flex-1">
                                                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-black text-[10px] lg:text-xs flex-shrink-0">
                                                    {day.day}
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Day Title"
                                                    value={day.title}
                                                    onChange={(e) => {
                                                        const newItinerary = [...formData.itinerary];
                                                        newItinerary[idx].title = e.target.value;
                                                        setFormData({ ...formData, itinerary: newItinerary });
                                                    }}
                                                    className="bg-transparent border-none text-[13px] lg:text-sm font-black text-zinc-900 focus:ring-0 p-0 w-full"
                                                />
                                            </div>
                                            <button
                                                onClick={() => removeItineraryDay(idx)}
                                                className="text-zinc-300 hover:text-red-500 transition-colors flex-shrink-0"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <div className="p-6 lg:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Daily Focus</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Arrival & Welcome"
                                                        value={day.subtitle}
                                                        onChange={(e) => {
                                                            const newItinerary = [...formData.itinerary];
                                                            newItinerary[idx].subtitle = e.target.value;
                                                            setFormData({ ...formData, itinerary: newItinerary });
                                                        }}
                                                        className="w-full bg-zinc-50 border-none rounded-xl py-3.5 lg:py-4 px-6 text-xs lg:text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Narrative</label>
                                                    <textarea
                                                        rows={4}
                                                        placeholder="Narrative detail..."
                                                        value={day.content}
                                                        onChange={(e) => {
                                                            const newItinerary = [...formData.itinerary];
                                                            newItinerary[idx].content = e.target.value;
                                                            setFormData({ ...formData, itinerary: newItinerary });
                                                        }}
                                                        className="w-full bg-zinc-50 border-none rounded-xl py-3.5 lg:py-4 px-6 text-xs lg:text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all resize-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sequence Images</label>
                                                <div className="flex flex-col gap-4">
                                                    <ImageUpload
                                                        value=""
                                                        onChange={(url) => {
                                                            const newItinerary = [...formData.itinerary];
                                                            newItinerary[idx].images = [...(newItinerary[idx].images || []), url];
                                                            setFormData({ ...formData, itinerary: newItinerary });
                                                        }}
                                                        onRemove={() => { }}
                                                    />
                                                    <div className="flex flex-wrap gap-2">
                                                        {(day.images || []).map((img: any, i: any) => (
                                                            <div key={i} className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-zinc-100 overflow-hidden relative shadow-sm border border-zinc-200 group">
                                                                <Image src={img} alt="Day preview" fill className="object-cover" />
                                                                <button
                                                                    onClick={() => {
                                                                        const newItinerary = [...formData.itinerary];
                                                                        newItinerary[idx].images = newItinerary[idx].images.filter((_: any, idx2: any) => idx2 !== i);
                                                                        setFormData({ ...formData, itinerary: newItinerary });
                                                                    }}
                                                                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >×</button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {formData.itinerary.length === 0 && (
                                    <div className="py-16 lg:py-20 border-2 border-dashed border-zinc-100 rounded-[2rem] lg:rounded-[3rem] flex flex-col items-center justify-center gap-4">
                                        <Calendar size={32} className="text-zinc-200" />
                                        <p className="text-[10px] lg:text-xs text-zinc-400 font-bold tracking-widest uppercase">No mapping found.</p>
                                        <button onClick={addItineraryDay} className="text-amber font-black text-[10px] lg:text-xs uppercase tracking-widest hover:underline">Start Mapping</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                            {/* Experts / Guides */}
                            <div className="space-y-6 lg:space-y-8">
                                <div className="flex items-center justify-between gap-4">
                                    <h3 className="text-lg lg:text-xl font-black text-zinc-900 flex items-center gap-2">
                                        <Users size={20} className="text-amber" /> Experts
                                    </h3>
                                    <button onClick={addGuide} className="text-amber font-black text-[10px] uppercase tracking-widest flex items-center gap-1 hover:underline flex-shrink-0"><Plus size={16} /> Add Expert</button>
                                </div>
                                <div className="space-y-4">
                                    {formData.guides.map((guide, idx) => (
                                        <div key={idx} className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-8 border border-zinc-100 shadow-sm flex flex-col sm:flex-row items-start gap-4 lg:gap-6 relative group">
                                            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-zinc-50 relative overflow-hidden flex-shrink-0 border border-zinc-200">
                                                {guide.image ? <Image src={guide.image} alt="Guide" fill className="object-cover" /> : <Users size={24} className="m-auto mt-4 text-zinc-200" />}
                                            </div>
                                            <div className="flex-1 w-full grid grid-cols-1 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="Expert Name"
                                                    value={guide.name}
                                                    onChange={(e) => {
                                                        const newGuides = [...formData.guides];
                                                        newGuides[idx].name = e.target.value;
                                                        setFormData({ ...formData, guides: newGuides });
                                                    }}
                                                    className="w-full bg-zinc-50 border-none rounded-lg px-4 py-2.5 text-xs font-bold text-zinc-900"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Focus / Role"
                                                    value={guide.role}
                                                    onChange={(e) => {
                                                        const newGuides = [...formData.guides];
                                                        newGuides[idx].role = e.target.value;
                                                        setFormData({ ...formData, guides: newGuides });
                                                    }}
                                                    className="w-full bg-zinc-50 border-none rounded-lg px-4 py-2.5 text-[10px] font-bold text-zinc-500"
                                                />
                                                <div className="space-y-3">
                                                    <label className="text-[9px] lg:text-[10px] font-black text-zinc-400 uppercase tracking-widest">Expert Portrait</label>
                                                    <ImageUpload
                                                        value={guide.image}
                                                        onChange={(url) => {
                                                            const newGuides = [...formData.guides];
                                                            newGuides[idx].image = url;
                                                            setFormData({ ...formData, guides: newGuides });
                                                        }}
                                                        onRemove={() => {
                                                            const newGuides = [...formData.guides];
                                                            newGuides[idx].image = '';
                                                            setFormData({ ...formData, guides: newGuides });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setFormData({ ...formData, guides: formData.guides.filter((_, i) => i !== idx) })}
                                                className="absolute top-4 lg:top-6 right-4 lg:right-6 text-zinc-200 hover:text-red-500 transition-colors sm:opacity-0 group-hover:opacity-100"
                                            ><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Inclusions / General */}
                            <div className="space-y-6 lg:space-y-8">
                                <div className="flex items-center justify-between gap-4">
                                    <h3 className="text-lg lg:text-xl font-black text-zinc-900 flex items-center gap-2">
                                        <Package size={20} className="text-amber" /> Inclusions
                                    </h3>
                                    <button onClick={addInclusion} className="text-amber font-black text-[10px] uppercase tracking-widest flex items-center gap-1 hover:underline flex-shrink-0"><Plus size={16} /> Add Feature</button>
                                </div>
                                <div className="bg-white rounded-[1.5rem] lg:rounded-[3.0rem] p-6 lg:p-10 border border-zinc-100 shadow-sm space-y-4">
                                    {formData.included.map((item, idx) => (
                                        <div key={idx} className="flex gap-3 lg:gap-4 items-center">
                                            <input
                                                type="text"
                                                placeholder="Michelin Dining..."
                                                value={item.label}
                                                onChange={(e) => {
                                                    const newIncluded = [...formData.included];
                                                    newIncluded[idx].label = e.target.value;
                                                    setFormData({ ...formData, included: newIncluded });
                                                }}
                                                className="flex-1 bg-zinc-50 border-none rounded-lg lg:rounded-xl py-3 lg:py-4 px-4 lg:px-6 text-[11px] lg:text-sm font-bold text-zinc-900"
                                            />
                                            <button
                                                onClick={() => setFormData({ ...formData, included: formData.included.filter((_, i) => i !== idx) })}
                                                className="text-zinc-200 hover:text-red-500 transition-colors flex-shrink-0"
                                            ><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                    {formData.included.length === 0 && <p className="text-center py-6 lg:py-10 text-[9px] lg:text-[10px] font-bold text-zinc-300 tracking-widest uppercase">Empty list.</p>}
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <h3 className="text-lg lg:text-xl font-black text-zinc-900 flex items-center gap-2">
                                        <Briefcase size={20} className="text-amber" /> Wardrobe
                                    </h3>
                                </div>
                                <div className="bg-white rounded-[1.5rem] lg:rounded-[3rem] p-6 lg:p-10 border border-zinc-100 shadow-sm space-y-4">
                                    <div className="flex flex-wrap gap-2 mb-2 lg:mb-4">
                                        {formData.packing_list.map(item => (
                                            <span key={item} className="bg-zinc-100 text-zinc-900 text-[9px] lg:text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-2">
                                                {item}
                                                <button onClick={() => setFormData({ ...formData, packing_list: formData.packing_list.filter(p => p !== item) })}>×</button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newPackingItem}
                                            onChange={(e) => setNewPackingItem(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (setFormData({ ...formData, packing_list: [...formData.packing_list, newPackingItem] }), setNewPackingItem(''))}
                                            placeholder="Item..."
                                            className="flex-1 bg-zinc-50 border-none rounded-lg lg:rounded-xl py-2.5 lg:py-3 px-4 lg:px-6 text-[10px] lg:text-xs font-bold"
                                        />
                                        <button
                                            onClick={() => { if (newPackingItem) setFormData({ ...formData, packing_list: [...formData.packing_list, newPackingItem] }), setNewPackingItem('') }}
                                            className="w-10 h-10 lg:w-12 lg:h-12 bg-zinc-100 rounded-lg lg:rounded-xl flex items-center justify-center text-zinc-900"
                                        ><Plus size={18} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
