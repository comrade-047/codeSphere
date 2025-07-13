const features = [
  {
    title: "🧠 AI Code Evaluation",
    desc: "Instant feedback on your code with intelligent suggestions and scoring.",
  },
  {
    title: "🏆 Live Coding Contests",
    desc: "Compete in real-time challenges and earn global rankings.",
  },
  {
    title: "📚 Vast Problem Library",
    desc: "Access problems covering DSA, system design, and more.",
  },
];

const Features = () => (
  <section className="py-20 bg-gradient-to-br from-white to-gray-100">
    <div className="max-w-6xl mx-auto px-4">
      <h3 className="text-4xl font-extrabold text-center text-gray-900 mb-16">
        Why Choose Our Platform?
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="bg-white backdrop-blur-md bg-opacity-60 border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6"
          >
            <div className="text-4xl mb-4">{f.title.split(" ")[0]}</div>
            <h4 className="text-xl font-semibold mb-2 text-gray-800">
              {f.title.replace(/^\S+\s/, '')}
            </h4>
            <p className="text-gray-600 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
