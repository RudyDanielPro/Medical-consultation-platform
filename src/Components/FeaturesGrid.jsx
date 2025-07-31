export function FeaturesGrid() {
  const features = [
    {
      icon: '🩺',
      title: 'Consultas Digitales',
      description: 'Registro completo de casos clínicos'
    },
    {
      icon: '📋',
      title: 'Feedback Detallado',
      description: 'Evaluación por médicos certificados'
    },
    {
    
      icon: '🔒',
      title: 'Historial Seguro',
      description: 'Cifrado de datos médicos'
    }
  ];

  return (
    <section className="py-16 bg-primary-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Nuestra Plataforma
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
              <span className="text-4xl text-primary-500">{feature.icon}</span>
              <h3 className="text-xl font-bold mt-4 text-primary-700">{feature.title}</h3>
              <p className="mt-2 text-primary-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}