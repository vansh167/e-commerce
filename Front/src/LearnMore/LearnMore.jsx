import React from "react";
import {
  ShoppingBag,
  Truck,
  Gift,
  Users,
  Star,
  MapPin,
  Mail,
  Phone,
  Github,
  Linkedin
} from "lucide-react";
import "./LearnMore.css";

/* Reusable Components */
const Card = ({ children, className }) => (
  <div className={`card ${className || ""}`}>{children}</div>
);

const Badge = ({ children }) => <span className="topic-badge">{children}</span>;

const IconButton = ({ icon, children, href }) => (
  <a className="social-btn" href={href} target="_blank" rel="noopener noreferrer">
    {icon}
    <span>{children}</span>
  </a>
);

export default function AboutEcommerce() {
  return (
    <div className="about-ecom-container">
      {/* Hero */}
      <header className="hero-ecom">
        <div className="hero-left">
          <div className="hero-icon">
            <ShoppingBag size={56} />
          </div>
          <h1>About Our Store</h1>
          <p className="hero-sub">
            Curated products. Honest reviews. Fast delivery. Built for modern shoppers.
          </p>
        </div>
        <div className="hero-right">
          <div className="value">
            <Truck size={28} />
            <div>
              <h4>Fast Shipping</h4>
              <p>Most orders delivered within 48–72 hours.</p>
            </div>
          </div>
          <div className="value">
            <Gift size={28} />
            <div>
              <h4>Quality Guarantee</h4>
              <p>Hand-picked vendors & product checks.</p>
            </div>
          </div>
          <div className="value">
            <Star size={28} />
            <div>
              <h4>Customer Rated</h4>
              <p>Thousands of 5-star reviews.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="about-main">
        {/* Mission */}
        <Card className="mission-card">
          <div className="card-header">
            <Gift size={28} className="section-icon" />
            <h2>Our Mission</h2>
          </div>
          <p>
            We make shopping effortless by connecting you with trusted brands and products.
            Our aim is transparent pricing, fast delivery, and great customer service so you can
            shop with confidence.
          </p>
        </Card>

        {/* Categories */}
        <Card className="categories-card">
          <div className="card-header">
            <Users size={28} className="section-icon" />
            <h2>Top Categories</h2>
          </div>

          <div className="topics-grid">
            {[
              "Women's Fashion",
              "Men's Fashion",
              "Kids",
              "Home & Living",
              "Electronics",
              "Beauty",
              "Sports",
              "Accessories"
            ].map((c) => (
              <Badge key={c}>{c}</Badge>
            ))}
          </div>
        </Card>

        {/* How we source */}
        <Card className="sourcing-card">
          <h2>How We Source Products</h2>
          <p>
            We work directly with verified brands and vetted sellers. Every product goes through
            quality and authenticity checks. We also include independent customer reviews and
            returns policy details so you make a confident choice.
          </p>
          <ul className="sourcing-list">
            <li><strong>Verified Partners</strong> — Direct relationships with brands.</li>
            <li><strong>Product Checks</strong> — Quality inspection before listing.</li>
            <li><strong>Transparent Pricing</strong> — No hidden fees.</li>
          </ul>
        </Card>

        {/* Team & Stats */}
        <Card className="team-card">
          <div className="card-header">
            <Users size={28} className="section-icon" />
            <h2>Who We Are</h2>
          </div>

          <p className="card-text">
            A small, dedicated team of merchandisers, engineers and customer champions building a better
            shopping experience.
          </p>

          <div className="stats-grid">
            <div className="stat">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Orders / month</div>
            </div>
            <div className="stat">
              <div className="stat-number">1K+</div>
              <div className="stat-label">Active Sellers</div>
            </div>
            <div className="stat">
              <div className="stat-number">98%</div>
              <div className="stat-label">On-time Delivery</div>
            </div>
          </div>
        </Card>

        <hr className="separator" />

        {/* Customer care */}
        <div className="customer-care">
          <Card className="contact-card">
            <h3>Customer Care</h3>
            <p>If you need help with an order, returns or product details — we're here 24/7.</p>

            <div className="contact-grid">
              <div className="contact-item">
                <Mail size={18} />
                <div>
                  <div className="contact-label">Email</div>
                  <div className="contact-value">support@yourstore.com</div>
                </div>
              </div>

              <div className="contact-item">
                <Phone size={18} />
                <div>
                  <div className="contact-label">Phone</div>
                  <div className="contact-value">+1 (800) 555-0123</div>
                </div>
              </div>

              
            </div>

            <div className="social-row">
              <IconButton icon={<Github size={18} />} href="https://github.com">Developers</IconButton>
              <IconButton icon={<Linkedin size={18} />} href="https://linkedin.com">Careers</IconButton>
            </div>
          </Card>
        </div>

        {/* FAQ / Learn */}
        <Card className="faq-card">
          <h3>Frequently Asked</h3>
          <div className="faq-grid">
            <details>
              <summary>What is your return policy?</summary>
              <p>Most items can be returned within 15 days in original condition — some exclusions apply.</p>
            </details>

            <details>
              <summary>How long does shipping take?</summary>
              <p>Standard shipping is 3–5 business days. Express options are available at checkout.</p>
            </details>

            <details>
              <summary>Do you ship internationally?</summary>
              <p>We ship to selected countries; see the Shipping &amp; Delivery page for details.</p>
            </details>
          </div>
        </Card>
      </main>
    </div>
  );
}
