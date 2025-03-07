import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Recycle as Bicycle, BarChart2, CreditCard } from 'lucide-react';

const WelcomeSlides = [
  {
    title: 'Get Started Now',
    description: 'Join us and take control of your finances, track expenses, income and spending.',
    icon: Wallet,
    image: 'https://images.unsplash.com/photo-1532102235608-dc8fc689c9ab?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Track Your Expenses',
    description: 'Get detailed insights into your spending habits. Life gets simpler when we track your progress.',
    icon: BarChart2,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Save More With UBS',
    description: 'Set goals and achieve financial freedom with UBS. Make your target with UBS.',
    icon: Bicycle,
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'Welcome to UBS Switzerland',
    description: 'Manage your finances with ease and highest security.',
    icon: CreditCard,
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=600',
  },
];

export const Welcome: React.FC = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < WelcomeSlides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      navigate('/home');
    }
  };

  const slide = WelcomeSlides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 p-6 flex flex-col">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {WelcomeSlides.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentSlide ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Icon className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{slide.title}</h1>
          <p className="text-gray-600">{slide.description}</p>
        </div>

        {/* Image */}
        <div className="flex-1 flex items-center justify-center mb-8">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full max-w-sm rounded-2xl shadow-lg object-cover"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleNext}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          {currentSlide === WelcomeSlides.length - 1 ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  );
};