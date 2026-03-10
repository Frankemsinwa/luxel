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
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ImageUpload from "@/components/ImageUpload";
import Image from "next/image";

export default function EditTourPage() {
    const router = useRouter();
    const params = useParams();
    const tourId = params.id;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
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

    useEffect(() => {
        const fetchTour = async () => {
            try {
                // Fetching by ID from our backend
                const response = await api.get(`/tours/id/${tourId}`);
                const data = response.data;
                setFormData({
                    ...data,
                    price: data.price.toString(),
                    available_slots: data.available_slots?.toString() || '50',
                    tags: data.tags || [],
                    themes: data.themes || [],
                    itinerary: data.itinerary || [],
                    guides: data.guides || [],
                    included: data.included || [],
                    excluded: data.excluded || [],
                    meeting_point: data.meeting_point || '',
                    packing_list: data.packing_list || []
                });
            } catch (error: any) {
                console.error('Fetch error:', error);
                if (error.response?.status === 401) {
                    router.push('/');
                } else {
                    alert('Failed to fetch tour details');
                    router.push('/agent/tours');
                }
            } finally {
                setIsFetching(false);
            }
        };

        if (tourId) fetchTour();
    }, [tourId, router]);

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
            const response = await api.patch(`/tours/${tourId}`, {
                ...formData,
                price: Number(formData.price),
                available_slots: Number(formData.available_slots)
            });

            if (response.status === 200) {
                router.push('/agent/tours');
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (error: any) {
            console.error('Update error:', error);
            alert(`Failed to update tour: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-amber animate-spin" />
                <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Recalibrating Experience Engine...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-[#F8F9FA]/80 backdrop-blur-md py-6 z-30">
                <div className="flex items-center gap-6">
                    <button
                        onClick={handleBack}
                        className="w-12 h-12 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-all shadow-sm"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Edit Experience</h1>
                        <p className="text-xs font-bold text-zinc-400 tracking-widest uppercase mt-1">
                            {step === 1 ? 'Primary Details' : step === 2 ? 'Experience Map' : 'Inclusions & Experts'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-6">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? 'w-10 bg-amber shadow-sm' : step > s ? 'w-4 bg-emerald-500' : 'w-4 bg-zinc-200'
                                    }`}
                            />
                        ))}
                    </div>
                    {step < 3 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="bg-zinc-900 text-white px-8 py-4 rounded-2xl font-black text-xs tracking-widest uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-zinc-200"
                        >
                            Next Module
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-xs tracking-widest uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-100 flex items-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Update Experience
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
                    className="space-y-8"
                >
                    {step === 1 && (
                        <div className="space-y-8">
                            {/* Core Info */}
                            <section className="bg-white rounded-[2.5rem] p-10 border border-zinc-100 shadow-sm space-y-8">
                                <div className="flex items-center gap-3 text-zinc-900">
                                    <Palmtree size={20} className="text-amber" />
                                    <h3 className="font-bold tracking-tight text-lg">Core Metadata</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Public Experience Title</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. The Serengeti Silk Safari"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-zinc-50 border-none rounded-2xl py-5 px-8 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all placeholder:text-zinc-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">SEO-Friendly Slug (Unique)</label>
                                        <input
                                            type="text"
                                            placeholder="serengeti-silk-safari"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="w-full bg-zinc-50 border-none rounded-2xl py-5 px-8 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all placeholder:text-zinc-200"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Global Location</label>
                                        <div className="relative">
                                            <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300" />
                                            <input
                                                type="text"
                                                placeholder="Tokyo, Japan"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full bg-zinc-50 border-none rounded-2xl py-5 pl-14 pr-8 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Precise Meeting Point</label>
                                        <div className="relative">
                                            <Navigation size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300" />
                                            <input
                                                type="text"
                                                placeholder="Gate B-12, Airport Terminal"
                                                value={formData.meeting_point}
                                                onChange={(e) => setFormData({ ...formData, meeting_point: e.target.value })}
                                                className="w-full bg-zinc-50 border-none rounded-2xl py-5 pl-14 pr-8 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Base Rate (PP)</label>
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 font-black">₦</span>
                                            <input
                                                type="number"
                                                placeholder="1850000"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full bg-zinc-50 border-none rounded-2xl py-5 pl-12 pr-8 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Experience Duration</label>
                                        <div className="relative">
                                            <Calendar size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300" />
                                            <input
                                                type="text"
                                                placeholder="7 Days / 6 Nights"
                                                value={formData.duration}
                                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                                className="w-full bg-zinc-50 border-none rounded-2xl py-5 pl-14 pr-8 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-4">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Experience Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full bg-zinc-50 border-none rounded-2xl py-5 px-8 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all cursor-pointer"
                                    >
                                        <option value="DRAFT">DRAFT - Internal Only</option>
                                        <option value="PUBLISHED">PUBLISHED - Live for Booking</option>
                                        <option value="ARCHIVED">ARCHIVED - Hide from listings</option>
                                    </select>
                                </div>
                            </section>

                            {/* Visuals & Description */}
                            <section className="bg-white rounded-[2.5rem] p-10 border border-zinc-100 shadow-sm space-y-8">
                                <div className="flex items-center gap-3 text-zinc-900">
                                    <ImageIcon size={20} className="text-amber" />
                                    <h3 className="font-bold tracking-tight text-lg">Visual Storytelling</h3>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Hero Image (Experience Header)</label>
                                    <ImageUpload
                                        value={formData.hero_image}
                                        onChange={(url) => setFormData({ ...formData, hero_image: url })}
                                        onRemove={() => setFormData({ ...formData, hero_image: '' })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Elevator Pitch / Description</label>
                                    <textarea
                                        rows={5}
                                        placeholder="Traverse the ancient pathways of merchants..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-zinc-50 border-none rounded-2xl py-5 px-8 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all resize-none"
                                    />
                                </div>
                            </section>

                            {/* Tags & Themes */}
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white rounded-[2.5rem] p-10 border border-zinc-100 shadow-sm space-y-6">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Marketing Tags</label>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map(tag => (
                                            <span key={tag} className="bg-zinc-900 text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-2">
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
                                            placeholder="Add tag..."
                                            className="flex-1 bg-zinc-50 border-none rounded-xl py-3 px-6 text-xs font-bold"
                                        />
                                        <button
                                            onClick={() => { if (newTag) setFormData({ ...formData, tags: [...formData.tags, newTag] }), setNewTag('') }}
                                            className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-900"
                                        ><Plus size={20} /></button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[2.5rem] p-10 border border-zinc-100 shadow-sm space-y-6">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Core Themes</label>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.themes.map(theme => (
                                            <span key={theme} className="bg-amber text-black text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-2">
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
                                            placeholder="Add theme..."
                                            className="flex-1 bg-zinc-50 border-none rounded-xl py-3 px-6 text-xs font-bold"
                                        />
                                        <button
                                            onClick={() => { if (newTheme) setFormData({ ...formData, themes: [...formData.themes, newTheme] }), setNewTheme('') }}
                                            className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-900"
                                        ><Plus size={20} /></button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-zinc-900">Itinerary Orchestration</h3>
                                <button
                                    onClick={addItineraryDay}
                                    className="text-amber font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:underline"
                                >
                                    <Plus size={16} /> Add Day Sequence
                                </button>
                            </div>

                            <div className="space-y-6">
                                {formData.itinerary.map((day, idx) => (
                                    <motion.div
                                        key={idx}
                                        layout
                                        className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden"
                                    >
                                        <div className="p-8 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-black text-xs">
                                                    {day.day}
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Day Title (e.g. Twilight Over the Bosphorus)"
                                                    value={day.title}
                                                    onChange={(e) => {
                                                        const newItinerary = [...formData.itinerary];
                                                        newItinerary[idx].title = e.target.value;
                                                        setFormData({ ...formData, itinerary: newItinerary });
                                                    }}
                                                    className="bg-transparent border-none text-sm font-black text-zinc-900 focus:ring-0 p-0 w-96"
                                                />
                                            </div>
                                            <button
                                                onClick={() => removeItineraryDay(idx)}
                                                className="text-zinc-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Daily Focus / Subtitle</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Arrival & Welcome Dinner"
                                                        value={day.subtitle}
                                                        onChange={(e) => {
                                                            const newItinerary = [...formData.itinerary];
                                                            newItinerary[idx].subtitle = e.target.value;
                                                            setFormData({ ...formData, itinerary: newItinerary });
                                                        }}
                                                        className="w-full bg-zinc-50 border-none rounded-xl py-4 px-6 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Narrative Detail</label>
                                                    <textarea
                                                        rows={4}
                                                        placeholder="Your private chauffeur awaits..."
                                                        value={day.content}
                                                        onChange={(e) => {
                                                            const newItinerary = [...formData.itinerary];
                                                            newItinerary[idx].content = e.target.value;
                                                            setFormData({ ...formData, itinerary: newItinerary });
                                                        }}
                                                        className="w-full bg-zinc-50 border-none rounded-xl py-4 px-6 text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-amber/10 transition-all resize-none"
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
                                                            <div key={i} className="w-20 h-20 rounded-xl bg-zinc-100 overflow-hidden relative shadow-sm border border-zinc-200 group">
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
                                    <div className="py-20 border-2 border-dashed border-zinc-100 rounded-[3rem] flex flex-col items-center justify-center gap-4">
                                        <Calendar size={32} className="text-zinc-200" />
                                        <p className="text-zinc-400 font-bold">Chronological flow is empty.</p>
                                        <button onClick={addItineraryDay} className="text-amber font-black text-[10px] uppercase tracking-widest hover:underline">Start Mapping</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Experts / Guides */}
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-zinc-900 flex items-center gap-2">
                                        <Users size={20} className="text-amber" /> Global Experts
                                    </h3>
                                    <button onClick={addGuide} className="text-amber font-black text-[10px] uppercase tracking-widest flex items-center gap-1 hover:underline"><Plus size={16} /> Add Guide</button>
                                </div>
                                <div className="space-y-4">
                                    {formData.guides.map((guide, idx) => (
                                        <div key={idx} className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-sm flex items-start gap-6 relative group">
                                            <div className="w-16 h-16 rounded-2xl bg-zinc-50 relative overflow-hidden flex-shrink-0 border border-zinc-200">
                                                {guide.image ? <Image src={guide.image} alt="Guide" fill className="object-cover" /> : <Users size={24} className="m-auto mt-4 text-zinc-200" />}
                                            </div>
                                            <div className="flex-1 grid grid-cols-1 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="Guide Name (e.g. Julian Vance)"
                                                    value={guide.name}
                                                    onChange={(e) => {
                                                        const newGuides = [...formData.guides];
                                                        newGuides[idx].name = e.target.value;
                                                        setFormData({ ...formData, guides: newGuides });
                                                    }}
                                                    className="w-full bg-zinc-50 border-none rounded-xl py-3 px-6 text-sm font-bold text-zinc-900"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Role / Title"
                                                    value={guide.role}
                                                    onChange={(e) => {
                                                        const newGuides = [...formData.guides];
                                                        newGuides[idx].role = e.target.value;
                                                        setFormData({ ...formData, guides: newGuides });
                                                    }}
                                                    className="w-full bg-zinc-50 border-none rounded-xl py-3 px-6 text-xs font-bold text-zinc-500"
                                                />
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Expert Portrait</label>
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
                                                className="absolute top-6 right-6 text-zinc-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            ><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Inclusions / General */}
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-zinc-900 flex items-center gap-2">
                                        <Package size={20} className="text-amber" /> Inclusions
                                    </h3>
                                    <button onClick={addInclusion} className="text-amber font-black text-[10px] uppercase tracking-widest flex items-center gap-1 hover:underline"><Plus size={16} /> Add Entry</button>
                                </div>
                                <div className="bg-white rounded-[3rem] p-10 border border-zinc-100 shadow-sm space-y-4">
                                    {formData.included.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 items-center">
                                            <input
                                                type="text"
                                                placeholder="Michelin Star Dining"
                                                value={item.label}
                                                onChange={(e) => {
                                                    const newIncluded = [...formData.included];
                                                    newIncluded[idx].label = e.target.value;
                                                    setFormData({ ...formData, included: newIncluded });
                                                }}
                                                className="flex-1 bg-zinc-50 border-none rounded-xl py-4 px-6 text-sm font-bold text-zinc-900"
                                            />
                                            <button
                                                onClick={() => setFormData({ ...formData, included: formData.included.filter((_, i) => i !== idx) })}
                                                className="text-zinc-200 hover:text-red-500 transition-colors"
                                            ><Trash2 size={20} /></button>
                                        </div>
                                    ))}
                                    {formData.included.length === 0 && <p className="text-center py-10 text-xs font-bold text-zinc-300 tracking-widest uppercase">No features listed.</p>}
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <h3 className="text-xl font-black text-zinc-900 flex items-center gap-2">
                                        <Briefcase size={20} className="text-amber" /> What to Pack
                                    </h3>
                                </div>
                                <div className="bg-white rounded-[3rem] p-10 border border-zinc-100 shadow-sm space-y-4">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {formData.packing_list.map(item => (
                                            <span key={item} className="bg-zinc-100 text-zinc-900 text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-2">
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
                                            placeholder="e.g. Valid Passport, Sunscreen..."
                                            className="flex-1 bg-zinc-50 border-none rounded-xl py-3 px-6 text-xs font-bold"
                                        />
                                        <button
                                            onClick={() => { if (newPackingItem) setFormData({ ...formData, packing_list: [...formData.packing_list, newPackingItem] }), setNewPackingItem('') }}
                                            className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-900"
                                        ><Plus size={20} /></button>
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
