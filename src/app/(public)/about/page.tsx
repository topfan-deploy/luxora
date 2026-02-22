import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Award,
  Leaf,
  Users,
  Globe,
  Target,
  Heart,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Luxora",
  description:
    "Learn about Luxora — our mission, our story, and our commitment to bringing premium lifestyle products to everyone worldwide.",
};

const values = [
  {
    icon: Award,
    title: "Quality",
    description:
      "We meticulously curate every product in our catalog, partnering only with trusted brands and manufacturers who share our commitment to excellence.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description:
      "We champion eco-conscious practices and products, striving to minimize our environmental impact while maximizing value for our customers.",
  },
  {
    icon: Heart,
    title: "Customer First",
    description:
      "Every decision we make starts with our customers. From product selection to post-purchase support, your satisfaction is our highest priority.",
  },
  {
    icon: Globe,
    title: "Global Access",
    description:
      "We believe premium products should be accessible everywhere. We ship worldwide and offer localized payment options to serve a global community.",
  },
];

const teamMembers = [
  {
    name: "Sarah Mitchell",
    role: "Founder & CEO",
    description: "Visionary leader with 15+ years in e-commerce and luxury retail.",
  },
  {
    name: "David Chen",
    role: "Head of Product",
    description:
      "Product curation expert with a passion for discovering emerging brands.",
  },
  {
    name: "Amara Osei",
    role: "Head of Operations",
    description:
      "Operations specialist ensuring seamless logistics and customer experience.",
  },
  {
    name: "Marcus Rivera",
    role: "Creative Director",
    description:
      "Award-winning creative lead shaping the Luxora brand identity and experience.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(217,154,43,0.06)_0%,_transparent_70%)]" />
          <div className="relative container mx-auto px-4 text-center">
            <h1 className="font-heading text-4xl lg:text-5xl xl:text-6xl font-bold text-charcoal-100">
              About <span className="gold-text">Luxora</span>
            </h1>
            <p className="mt-6 text-lg text-charcoal-300 max-w-2xl mx-auto leading-relaxed">
              A premium multi-category destination redefining the way you discover
              and shop for lifestyle essentials.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Image Placeholder */}
                <div className="bg-charcoal-900 border border-charcoal-700 rounded-xl aspect-[4/3] flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-charcoal-800 mb-4">
                      <Target className="h-8 w-8 text-gold-400" />
                    </div>
                    <p className="text-charcoal-400 text-sm">Our Story</p>
                  </div>
                </div>

                {/* Text */}
                <div>
                  <h2 className="font-heading text-3xl font-bold text-charcoal-100 mb-6">
                    Our <span className="gold-text">Story</span>
                  </h2>
                  <div className="space-y-4 text-charcoal-300 leading-relaxed">
                    <p>
                      Luxora was founded with a simple yet powerful vision: to create
                      a single destination where discerning shoppers can discover
                      premium lifestyle products at competitive prices.
                    </p>
                    <p>
                      What started as a small curated collection has grown into a
                      thriving marketplace spanning eight categories — from beauty
                      and wellness to tech and smart home. We partner directly with
                      brands and artisans worldwide to bring you products that meet
                      our exacting standards.
                    </p>
                    <p>
                      Every item in our catalog is hand-selected by our team of
                      product specialists who evaluate quality, design, sustainability,
                      and value before it reaches your screen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 lg:py-24 bg-charcoal-900/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-charcoal-800 border border-charcoal-700 mb-6">
                <Users className="h-6 w-6 text-gold-400" />
              </div>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-charcoal-100 mb-6">
                Our <span className="gold-text">Mission</span>
              </h2>
              <p className="text-lg text-charcoal-300 leading-relaxed">
                Making quality accessible to everyone, everywhere. We believe that
                premium products should not come with a premium barrier. Our mission
                is to democratize access to the finest lifestyle essentials by
                curating exceptional products, negotiating fair prices, and
                delivering them worldwide with care and efficiency.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-charcoal-100">
                Our <span className="gold-text">Values</span>
              </h2>
              <p className="mt-4 text-charcoal-400 max-w-2xl mx-auto">
                The principles that guide everything we do at Luxora.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {values.map((value) => {
                const IconComponent = value.icon;
                return (
                  <div
                    key={value.title}
                    className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-6 text-center hover:border-gold-400 transition-colors duration-300"
                  >
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-charcoal-800 mb-4">
                      <IconComponent className="h-6 w-6 text-gold-400" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-charcoal-100 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-charcoal-400 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 lg:py-24 bg-charcoal-900/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-charcoal-100">
                Meet the <span className="gold-text">Team</span>
              </h2>
              <p className="mt-4 text-charcoal-400 max-w-2xl mx-auto">
                The passionate people behind the Luxora experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-6 text-center hover:border-charcoal-600 transition-colors duration-200"
                >
                  {/* Avatar Placeholder */}
                  <div className="h-20 w-20 rounded-full bg-charcoal-800 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-heading font-bold text-gold-400">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-charcoal-100">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gold-400 font-medium mt-1">
                    {member.role}
                  </p>
                  <p className="text-sm text-charcoal-400 mt-3 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
