import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-accent text-accent-foreground">
    <div className="container mx-auto px-4 py-16">
      <div className="grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <span className="font-heading text-lg font-bold text-primary-foreground">M</span>
            </div>
            <span className="font-heading text-xl font-bold">MyRestaurant</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed opacity-70">
            Experience the finest flavors with a modern dining experience. Scan, order, and enjoy — all from your table.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-foreground/10 transition-colors hover:bg-accent-foreground/20">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-foreground/10 transition-colors hover:bg-accent-foreground/20">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-widest opacity-50">Quick Links</h4>
          <div className="mt-4 flex flex-col gap-3">
            <Link to="/menu" className="text-sm opacity-70 transition-opacity hover:opacity-100">Our Menu</Link>
            <Link to="/cart" className="text-sm opacity-70 transition-opacity hover:opacity-100">Cart</Link>
            <Link to="/track-order" className="text-sm opacity-70 transition-opacity hover:opacity-100">Track Order</Link>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-widest opacity-50">Hours</h4>
          <div className="mt-4 flex flex-col gap-3 text-sm opacity-70">
            <span>Mon - Fri: 11am - 11pm</span>
            <span>Sat - Sun: 10am - 12am</span>
            <span>Happy Hours: 4pm - 7pm</span>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-widest opacity-50">Contact</h4>
          <div className="mt-4 flex flex-col gap-3">
            <span className="flex items-center gap-2.5 text-sm opacity-70"><Phone className="h-4 w-4 shrink-0" /> +91 98765 43210</span>
            <span className="flex items-center gap-2.5 text-sm opacity-70"><Mail className="h-4 w-4 shrink-0" /> hello@myrestaurant.in</span>
            <span className="flex items-center gap-2.5 text-sm opacity-70"><MapPin className="h-4 w-4 shrink-0" /> Mumbai, India</span>
          </div>
        </div>
      </div>
      <div className="mt-12 border-t border-accent-foreground/10 pt-6 text-center text-sm opacity-40">
        © 2026 MyRestaurant. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
