import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
}

interface ProgressStepsProps {
  currentStep: number;
  steps: Step[];
}

export function ProgressSteps({ currentStep, steps }: ProgressStepsProps) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center flex-1 relative">
            {/* Đường line nối nằm phía sau */}
            {index < steps.length - 1 && (
              <div className="absolute left-1/2 top-5 w-full h-1 -z-10">
                <div
                  className={`h-full transition-all ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              </div>
            )}

            {/* Vòng tròn số */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all z-10 ${
                currentStep > step.id
                  ? 'bg-green-500 text-white'
                  : currentStep === step.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {currentStep > step.id ? (
                <Check className="w-5 h-5" />
              ) : (
                <span>{step.id}</span>
              )}
            </div>

            {/* Nhãn bên dưới */}
            <p
              className={`mt-3 text-sm text-center ${
                currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              {step.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
