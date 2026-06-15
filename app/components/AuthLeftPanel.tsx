export default function AuthLeftPanel() {
  return (
    <div className="hidden lg:flex w-1/2 bg-blue-600 text-white p-14 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-600 bg-opacity-80 backdrop-brightness-75"></div>

      <div className="relative z-10 max-w-md">
        <div className="text-5xl mb-6">🍽️</div>

        <h1 className="text-4xl font-bold mb-4">Start Your Journey</h1>
        <p className="text-lg mb-8 opacity-90">
          Join thousands of restaurants managing their operations efficiently with RestaurantOS.
        </p>

        <div className="space-y-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl">
          <p className="flex items-center gap-3">
            ✔ <span>30-day free trial</span>
          </p>
          <p className="flex items-center gap-3">
            ✔ <span>No credit card required</span>
          </p>
          <p className="flex items-center gap-3">
            ✔ <span>24/7 customer support</span>
          </p>
        </div>
      </div>
    </div>
  );
}
