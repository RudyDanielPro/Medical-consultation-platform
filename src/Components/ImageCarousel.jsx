import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Importa tus imágenes desde la carpeta de assets
import imagen1 from "../assets/Carrusel/1.jpg";
import imagen2 from "../assets/Carrusel/2.jpg";
import imagen3 from "../assets/Carrusel/3.jpg";
import imagen4 from "../assets/Carrusel/4.jpg";
import imagen5 from "../assets/Carrusel/5.jpg";

// Componente personalizado para las flechas
const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} before:!text-black`}
      style={{ ...style, display: "block", right: "10px", zIndex: 1 }}
      onClick={onClick}
    />
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} before:!text-black`}
      style={{ ...style, display: "block", left: "10px", zIndex: 1 }}
      onClick={onClick}
    />
  );
};

export function ImageCarousel() {
  const slides = [
    {
      image: imagen1,
      alt: "Estudiante realizando consulta",
      title: "Digitaliza tus consultas médicas",
      description: "Registra casos clínicos en minutos con nuestro formulario intuitivo.",
    },
    {
      image: imagen3,
      alt: "Doctor evaluando caso",
      title: "Digitaliza el proceso",
      description: "Transforma tus apuntes en historiales médicos digitales profesionales.",
    },
    {
      image: imagen4,
      alt: "Doctor evaluando caso",
      title: "Cada dia mas cerca de la digitalización",
      description: "Nuestros estudiantes realizan sus pruebas y evaluaciones a traves del sistema.",
    },
    {
      image: imagen2,
      alt: "Doctor evaluando caso",
      title: "Facilitando el trabajo de todos",
      description: "Con un proceso totalmente digital.",
    },
    {
      image: imagen5,
      alt: "Doctor evaluando caso",
      title: "Lograr el objetivo",
      description: "Liberar un poco la tension de los estudiantes y el trabajo de los doctores.",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          arrows: true,
          dots: true
        }
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          dots: true
        }
      }
    ]
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative px-4">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="relative">
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-auto min-h-[300px] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] object-cover object-center 
              rounded-none md:rounded-xl shadow-none md:shadow-xl
              brightness-95 contrast-105 saturate-110"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 md:p-6 rounded-b-lg">
              <h3 className="text-lg sm:text-xl font-bold text-white">{slide.title}</h3>
              <p className="text-sm sm:text-base text-gray-200">{slide.description}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}