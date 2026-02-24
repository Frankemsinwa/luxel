import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        <div className="flex items-center gap-2 group cursor-pointer">
          <Image src="/logo.png" alt="Luxel Logo" width={120} height={30} />
        </div>
        <div className="hidden md:flex items-center gap-8 text-[10px] font-bold tracking-[0.2em] text-white">
          <a href="#" className="text-amber border-b border-amber pb-1">HOME</a>
          <a href="#" className="hover:text-amber transition-colors">FLIGHT</a>
          <a href="#" className="hover:text-amber transition-colors">HOTEL</a>
          <a href="#" className="hover:text-amber transition-colors">RIDE</a>
          <a href="#" className="hover:text-amber transition-colors">TOUR</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-[10px] font-bold tracking-widest text-white hover:text-amber transition-colors cursor-pointer">Register</button>
          <button className="bg-white text-black px-6 py-2 rounded-lg text-[10px] font-bold tracking-widest hover:bg-amber transition-colors cursor-pointer">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}
