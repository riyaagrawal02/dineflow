import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, QrCode, CreditCard, Clock, Star, Quote, MapPin, Phone, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useMenuItems } from "@/hooks/useMenuItems";
import MenuCard from "@/components/MenuCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-food.jpg";
import RestaurantMap from "@/components/RestaurantMap";

const testimonials = [
  { name: "Ananya R.", text: "The smoothest dining experience ever! No waiting for the bill. The food was absolutely divine.", rating: 5 },
  { name: "Vikram S.", text: "Love scanning and ordering right from my phone. The biryani is to die for!", rating: 5 },
  { name: "Meera P.", text: "The food was amazing and the ordering process was seamless. Highly recommend!", rating: 4 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0, 0, 0.2, 1] as const },
  }),
};

const Index = () => {
  const [searchParams] = useSearchParams();
  const { setTableNumber } = useCart();
  const { data: menuItems } = useMenuItems();

  useEffect(() => {
    const table = searchParams.get("table");
    if (table) setTableNumber(parseInt(table));
  }, [searchParams, setTableNumber]);

  const featuredItems = (menuItems || []).filter((i) => i.is_popular).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Delicious food spread" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-accent/95 via-accent/85 to-accent/30" />
        </div>
        <div className="container relative mx-auto px-4 py-28 md:py-40 lg:py-48">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-1.5 text-sm font-medium text-secondary backdrop-blur-sm">
              <ChefHat className="h-4 w-4" /> Welcome to MyRestaurant
            </span>
            <h1 className="mt-6 font-heading text-5xl font-bold leading-[1.1] text-accent-foreground md:text-6xl lg:text-7xl">
              Scan. Order.{" "}
              <span className="text-gradient-gold">Enjoy.</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-accent-foreground/75 md:text-xl">
              Experience authentic flavors with our seamless digital ordering. No waiting, no hassle — just great food, delivered to your table.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full px-8 text-base shadow-glow transition-transform duration-200 hover:scale-105">
                <Link to="/menu">View Menu <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-accent-foreground/20 px-8 text-black hover:bg-accent-foreground/10 text-base backdrop-blur-sm"
              >
                <Link to="/menu">Order Now</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Decorative floating elements */}
        <div className="absolute bottom-8 right-8 hidden animate-float md:block">
          <div className="rounded-2xl bg-card/90 p-4 shadow-elevated backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-secondary text-secondary" />
              <span className="font-heading text-lg font-bold text-card-foreground">4.8</span>
              <span className="text-sm text-muted-foreground">Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
            <motion.span variants={fadeUp} custom={0} className="text-sm font-semibold uppercase tracking-widest text-primary">
              Simple & Easy
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="mt-2 font-heading text-3xl font-bold text-foreground md:text-4xl">
              How It Works
            </motion.h2>
          </motion.div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              { icon: QrCode, title: "Scan QR Code", desc: "Scan the QR code placed at your table to instantly access our digital menu" },
              { icon: CreditCard, title: "Order & Pay", desc: "Browse dishes, customize your order, and pay securely — all from your phone" },
              { icon: Clock, title: "Track & Enjoy", desc: "Watch your order being prepared in real-time and enjoy fresh food at your table" },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="group relative rounded-2xl border border-border bg-card p-8 text-center shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-6 font-heading text-xl font-semibold text-card-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                <span className="absolute -top-3.5 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-secondary font-body text-xs font-bold text-secondary-foreground shadow-card">
                  {i + 1}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      {featuredItems.length > 0 && (
        <section className="bg-muted/40 py-24">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-sm font-semibold uppercase tracking-widest text-primary">Chef's Picks</span>
                <h2 className="mt-2 font-heading text-3xl font-bold text-foreground md:text-4xl">
                  Featured Dishes
                </h2>
              </div>
              <Link to="/menu" className="hidden text-sm font-semibold text-primary transition-colors hover:text-primary/80 md:inline-flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredItems.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Link to="/menu" className="text-sm font-semibold text-primary">View All Menu →</Link>
            </div>
          </div>
        </section>
      )}

      {/* Our Story */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">Our Story</span>
              <h2 className="mt-2 font-heading text-3xl font-bold text-foreground md:text-4xl">
                A Legacy of Flavors
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Born from a passion for authentic Indian cuisine, MyRestaurant brings together traditional recipes passed down through generations with a modern dining experience. Every dish is crafted with the freshest ingredients and served with love.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                We believe dining should be effortless. That's why we've embraced technology — letting you focus on what truly matters: the food, the company, and the experience.
              </p>
              <div className="mt-8 flex gap-8">
                <div>
                  <p className="font-heading text-3xl font-bold text-primary">15+</p>
                  <p className="mt-1 text-sm text-muted-foreground">Years of Excellence</p>
                </div>
                <div>
                  <p className="font-heading text-3xl font-bold text-primary">50+</p>
                  <p className="mt-1 text-sm text-muted-foreground">Signature Dishes</p>
                </div>
                <div>
                  <p className="font-heading text-3xl font-bold text-primary">10K+</p>
                  <p className="mt-1 text-sm text-muted-foreground">Happy Guests</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src={heroImage}
                alt="Our restaurant"
                className="rounded-2xl shadow-elevated object-cover aspect-[4/3]"
                loading="lazy"
              />
              <div className="absolute -bottom-4 -left-4 rounded-xl bg-primary p-4 shadow-glow">
                <p className="font-heading text-2xl font-bold text-primary-foreground">4.8★</p>
                <p className="text-xs text-primary-foreground/80">Google Rating</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/40 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">Testimonials</span>
            <h2 className="mt-2 font-heading text-3xl font-bold text-foreground md:text-4xl">
              What Our Guests Say
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl border border-border bg-card p-7 shadow-card transition-all duration-300 hover:shadow-elevated"
              >
                <Quote className="h-8 w-8 text-primary/15" />
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground italic">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-bold text-primary">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">{t.name}</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-3.5 w-3.5 fill-secondary text-secondary" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl bg-accent p-10 md:p-16 text-accent-foreground">
            <div className="grid gap-10 md:grid-cols-2 items-center">
              <div>
                <span className="text-sm font-semibold uppercase tracking-widest text-secondary">Visit Us</span>
                <h2 className="mt-2 font-heading text-3xl font-bold md:text-4xl">
                  Find Us Here
                </h2>
                <p className="mt-4 text-accent-foreground/70 leading-relaxed">
                  Located in the heart of Mumbai, we're easy to find and always ready to serve you an unforgettable meal.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-foreground/10">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <span className="text-sm">123 Food Street, Bandra West, Mumbai 400050</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-foreground/10">
                      <Phone className="h-5 w-5" />
                    </div>
                    <span className="text-sm">+91 98765 43210</span>
                  </div>
                </div>
                <Button asChild size="lg" className="mt-8 rounded-full px-8">
                  <Link to="/menu">Reserve a Table</Link>
                </Button>
              </div>
              <RestaurantMap className="h-64 md:h-80" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-5xl">
              Ready to <span className="text-gradient-gold">Dine?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Browse our menu, place your order, and enjoy an unforgettable dining experience.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg" className="rounded-full px-8 shadow-glow">
                <Link to="/menu">Explore Menu <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
