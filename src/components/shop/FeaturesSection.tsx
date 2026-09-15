import { Shield, Truck, CreditCard, Award } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Premium Quality",
    description: "Swiss movements and finest materials",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On all orders nationwide",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "EasyPaisa & Cash on Delivery",
  },
  {
    icon: Shield,
    title: "Warranty Included",
    description: "Up to 3 years international",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-y border-white/10 bg-card py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 md:grid-cols-4 lg:px-8">
        {features.map((feature) => (
          <div key={feature.title} className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
              <feature.icon className="h-6 w-6 text-gold" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">{feature.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
