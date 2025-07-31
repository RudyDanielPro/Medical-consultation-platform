export function HeroSection() {
  return (
    <section className="relative h-[500px] bg-primary-700 overflow-hidden">
      {/* Fondo sutil */}
      <div className="absolute inset-0 bg-[url('/src/assets/medical-pattern.svg')] opacity-10"></div>
      
      <div className="container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-center mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Revolucionando la formación médica
          </h1>
          <p className="text-2xl text-white mb-8 ">
            La plataforma líder para evaluación clínica digital
          </p>
        </div>
      </div>
    </section>
  );
}