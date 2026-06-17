import basic_img from "../assets/basic_plan_dashboard.png"
import premium_img from "../assets/premium_plan_dashboard.png"
import enterprise_img from "../assets/enterprise_plan_dashboard.png"

export default function ProductsPreview() {

  const plans = [
    {
      name: "Basic",
      price: "$19/mo",
      image: basic_img,
      description:
      "Essential protection for individual property owners.",
      features: [
        "Flood Monitoring",
        "Risk Alerts",
        "Claim Assessment",
      ],
    },

    {
      name: "Premium",
      price: "$49/mo",
      image: premium_img,
      description:
      "Enhanced protection for multiple properties.",
      features: [
        "Everything in Basic",
        "Priority Claims",
        "Advanced Analytics",
      ],
    },

    {
      name: "Enterprise",
      price: "Custom",
      image: enterprise_img,
      description:
      "Designed for organizations and large portfolios.",
      features: [
        "Portfolio Monitoring",
        "Custom Risk Models",
        "Dedicated Support",
      ],
    },
  ];
  return (
    <section className="py-28 bg-slate-50">

    <div className="max-w-7xl mx-auto px-10">

    <h2 className="text-center text-4xl font-bold text-blue-950">
    Protection Plans
    </h2>

    <p className="text-center text-gray-600 mt-4">
    Choose the level of intelligence and protection
    that fits your needs.
    </p>

    <div className="grid grid-cols-3 gap-8 mt-16">

    {plans.map((plan) => (
    <div
      key={plan.name}
      className="
        bg-white
        rounded-3xl
        overflow-hidden
        shadow-sm
        hover:shadow-xl
        transition
      "
    >

      <img
        src={plan.image}
        alt={plan.name}
        className="
          w-full
          h-56
          object-cover
        "
      />

      <div className="p-8">

        <h3 className="text-2xl font-bold text-blue-900">
          {plan.name}
        </h3>

        <p className="text-4xl font-bold mt-4">
          {plan.price}
        </p>

        <p className="text-gray-600 mt-4">
          {plan.description}
        </p>

        <ul className="mt-8 space-y-3">
          {plan.features.map((feature) => (
            <li key={feature}>
              ✓ {feature}
            </li>
          ))}
        </ul>

        <button
          className="
            mt-8
            w-full
            bg-blue-900
            text-white
            py-3
            rounded-xl
          "
        >
          Get Started
        </button>

      </div>
    </div>
    ))}

    </div>

    </div>

    </section>
  );
}
