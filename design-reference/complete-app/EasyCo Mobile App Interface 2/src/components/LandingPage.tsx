import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Search,
  Home,
  Shield,
  Users,
  Heart,
  Leaf,
  ArrowRight,
  Star,
  CheckCircle,
  MapPin,
  Calendar,
  DollarSign,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Menu,
  X
} from "lucide-react";

interface LandingPageProps {
  onFindColiving: () => void;
  onListProperty: () => void;
  onSignUp: () => void;
  onLogin: () => void;
  onAbout: () => void;
}

export function LandingPage({
  onFindColiving,
  onListProperty,
  onSignUp,
  onLogin,
  onAbout,
}: LandingPageProps) {
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = () => {
    // Pass search parameters and navigate to property search
    onFindColiving();
  };

  return (
    <div className="min-h-screen bg-[var(--color-easyCo-gray-50)]">
      {/* Header */}
      <header className="easyCo-header sticky top-0 z-50 border-b border-[var(--color-easyCo-gray-200)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">
              <span className="text-[var(--color-easyCo-purple)]">EASY</span>
              <span className="text-[var(--color-easyCo-mustard)]">Co</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={onFindColiving}
              className="easyCo-btn-ghost"
            >
              Find a Coliving
            </button>
            <button
              onClick={onSignUp}
              className="easyCo-btn-ghost"
            >
              For Tenants
            </button>
            <button
              onClick={onListProperty}
              className="easyCo-btn-ghost"
            >
              For Landlords
            </button>
            <button
              onClick={onAbout}
              className="easyCo-btn-ghost"
            >
              About EasyCo
            </button>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={onLogin}
              className="easyCo-btn-ghost"
            >
              Log in
            </button>
            <Button
              onClick={onSignUp}
              className="easyCo-btn-primary"
            >
              Sign up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden easyCo-btn-icon"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[var(--color-easyCo-gray-200)] bg-white">
            <div className="px-6 py-4 space-y-4">
              <button
                onClick={() => {
                  onFindColiving();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-[var(--color-easyCo-gray-700)] hover:text-[var(--color-easyCo-purple)]"
              >
                Find a Coliving
              </button>
              <button
                onClick={() => {
                  onSignUp();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-[var(--color-easyCo-gray-700)] hover:text-[var(--color-easyCo-purple)]"
              >
                For Tenants
              </button>
              <button
                onClick={() => {
                  onListProperty();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-[var(--color-easyCo-gray-700)] hover:text-[var(--color-easyCo-purple)]"
              >
                For Landlords
              </button>
              <button
                onClick={() => {
                  onAbout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-[var(--color-easyCo-gray-700)] hover:text-[var(--color-easyCo-purple)]"
              >
                About EasyCo
              </button>
              <div className="pt-4 border-t border-[var(--color-easyCo-gray-200)] space-y-3">
                <button
                  onClick={() => {
                    onLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-[var(--color-easyCo-gray-700)]"
                >
                  Log in
                </button>
                <Button
                  onClick={() => {
                    onSignUp();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full easyCo-btn-primary"
                >
                  Sign up
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1581209410127-8211e90da024?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzaGFyZWQlMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1OTg1ODY3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Modern shared apartment living space"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Find your ideal co-living,<br />
            <span className="text-[var(--color-easyCo-mustard)]">in just a few clicks.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-200 leading-relaxed">
            EasyCo connects people and properties for simple, secure, and sustainable living.
          </p>

          {/* Search Bar */}
          <div className="easyCo-search max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[var(--color-easyCo-gray-600)] uppercase tracking-wide">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--color-easyCo-gray-400)]" />
                  <Input
                    placeholder="Where do you want to live?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 easyCo-input border-0 bg-[var(--color-easyCo-gray-50)]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-[var(--color-easyCo-gray-600)] uppercase tracking-wide">
                  Price Range
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--color-easyCo-gray-400)] z-10" />
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="pl-10 easyCo-input border-0 bg-[var(--color-easyCo-gray-50)]">
                      <SelectValue placeholder="Budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-500">€0 - €500</SelectItem>
                      <SelectItem value="500-800">€500 - €800</SelectItem>
                      <SelectItem value="800-1200">€800 - €1,200</SelectItem>
                      <SelectItem value="1200+">€1,200+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-[var(--color-easyCo-gray-600)] uppercase tracking-wide">
                  Move-in Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--color-easyCo-gray-400)]" />
                  <Input
                    type="date"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    className="pl-10 easyCo-input border-0 bg-[var(--color-easyCo-gray-50)]"
                  />
                </div>
              </div>

              <Button
                onClick={handleSearch}
                className="easyCo-btn-primary h-12 px-8"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Dual CTA Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Seekers Card */}
            <Card className="easyCo-property-card bg-gradient-to-br from-[var(--color-easyCo-purple)] to-[var(--color-easyCo-purple-dark)] text-white">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Looking for a room?</h3>
                <p className="text-lg mb-8 text-white/90 leading-relaxed">
                  Discover verified properties and connect with like-minded people in your ideal neighborhood.
                </p>
                <Button
                  onClick={onFindColiving}
                  className="easyCo-btn-primary w-full"
                >
                  Start your search
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Landlords Card */}
            <Card className="easyCo-property-card bg-gradient-to-br from-[var(--color-easyCo-mustard)] to-[var(--color-easyCo-mustard-dark)] text-black">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-black/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Home className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Have a property to rent?</h3>
                <p className="text-lg mb-8 text-black/80 leading-relaxed">
                  List your property and find verified, responsible tenants for secure co-living arrangements.
                </p>
                <Button
                  onClick={onListProperty}
                  className="easyCo-btn-secondary w-full"
                >
                  List your property
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-easyCo-gray-900)] mb-4">
              Why choose EasyCo?
            </h2>
            <p className="text-xl text-[var(--color-easyCo-gray-600)] max-w-2xl mx-auto">
              We make co-living simple, secure, and sustainable for everyone involved.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Smart Matching */}
            <div className="text-center">
              <div className="w-20 h-20 bg-[var(--color-easyCo-purple-light)] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-[var(--color-easyCo-purple)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-easyCo-gray-900)] mb-4">Smart matching</h3>
              <p className="text-[var(--color-easyCo-gray-600)] leading-relaxed">
                Our algorithm connects compatible people and properties based on lifestyle, preferences, and values.
              </p>
            </div>

            {/* Transparent Contracts */}
            <div className="text-center">
              <div className="w-20 h-20 bg-[var(--color-easyCo-mustard-light)] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-[var(--color-easyCo-mustard-dark)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-easyCo-gray-900)] mb-4">Transparent contracts</h3>
              <p className="text-[var(--color-easyCo-gray-600)] leading-relaxed">
                Clear agreements, secure payments, and verified identities ensure everyone's safety and peace of mind.
              </p>
            </div>

            {/* Sustainable Living */}
            <div className="text-center">
              <div className="w-20 h-20 bg-[var(--color-easyCo-success-light)] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-10 h-10 text-[var(--color-easyCo-success)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-easyCo-gray-900)] mb-4">Sustainable living</h3>
              <p className="text-[var(--color-easyCo-gray-600)] leading-relaxed">
                Share resources, reduce environmental impact, and build meaningful communities that last.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[var(--color-easyCo-gray-50)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-easyCo-gray-900)] mb-4">
              What our community says
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="easyCo-card">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[var(--color-easyCo-mustard)] text-[var(--color-easyCo-mustard)]" />
                  ))}
                </div>
                <p className="text-[var(--color-easyCo-gray-700)] mb-6 leading-relaxed">
                  "EasyCo helped me find the perfect flatmates and a beautiful apartment in Amsterdam. The matching process was so smooth!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[var(--color-easyCo-purple-light)] rounded-full flex items-center justify-center mr-4">
                    <span className="text-[var(--color-easyCo-purple)] font-bold">SM</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-easyCo-gray-900)]">Sarah M.</p>
                    <p className="text-sm text-[var(--color-easyCo-gray-500)]">Marketing Professional</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="easyCo-card">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[var(--color-easyCo-mustard)] text-[var(--color-easyCo-mustard)]" />
                  ))}
                </div>
                <p className="text-[var(--color-easyCo-gray-700)] mb-6 leading-relaxed">
                  "As a landlord, EasyCo gave me peace of mind with verified tenants and transparent processes. Highly recommended!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[var(--color-easyCo-mustard-light)] rounded-full flex items-center justify-center mr-4">
                    <span className="text-[var(--color-easyCo-mustard-dark)] font-bold">MJ</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-easyCo-gray-900)]">Michael J.</p>
                    <p className="text-sm text-[var(--color-easyCo-gray-500)]">Property Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="easyCo-card">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[var(--color-easyCo-mustard)] text-[var(--color-easyCo-mustard)]" />
                  ))}
                </div>
                <p className="text-[var(--color-easyCo-gray-700)] mb-6 leading-relaxed">
                  "The community features and expense sharing tools make living together so much easier. Love the sustainable approach!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[var(--color-easyCo-success-light)] rounded-full flex items-center justify-center mr-4">
                    <span className="text-[var(--color-easyCo-success)] font-bold">AL</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-easyCo-gray-900)]">Anna L.</p>
                    <p className="text-sm text-[var(--color-easyCo-gray-500)]">Graduate Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-[var(--color-easyCo-purple)] to-[var(--color-easyCo-purple-dark)]">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join the EasyCo community today.
          </h2>
          <p className="text-xl mb-12 text-white/90 leading-relaxed">
            Whether you're looking for a place to live or have a property to share, we're here to make it simple.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              onClick={onFindColiving}
              className="easyCo-btn-primary px-8 py-4 text-lg"
            >
              Find a Coliving
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={onListProperty}
              className="easyCo-btn-secondary px-8 py-4 text-lg"
            >
              List your Property
              <Home className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[var(--color-easyCo-gray-200)] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Company */}
            <div>
              <h4 className="font-semibold text-[var(--color-easyCo-gray-900)] mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={onAbout} className="text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)] transition-colors">
                    About EasyCo
                  </button>
                </li>
                <li>
                  <a href="#" className="text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)] transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)] transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)] transition-colors">
                    Press
                  </a>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="font-semibold text-[var(--color-easyCo-gray-900)] mb-4">Community</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={onFindColiving} className="text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)] transition-colors">
                    Find a Coliving
                  </button>
                </li>
                <li>
                  <button onClick={onListProperty} className="text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)] transition-colors">
                    List your Property
                  </button>
                </li>
                <li>
                  <a href="#" className="text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)] transition-colors">
                    Community Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)] transition-colors">
                    Success Stories
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-[var(--color-easyCo-gray-900)] mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)] transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)] transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)] transition-colors">
                    Safety Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)] transition-colors">
                    Trust & Safety
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-[var(--color-easyCo-gray-900)] mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)] transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)] transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)] transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)] transition-colors">
                    Accessibility
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-[var(--color-easyCo-gray-200)] pt-8 flex flex-col md:flex-row justify-between items-center">
            {/* Logo & Copyright */}
            <div className="flex items-center mb-4 md:mb-0">
              <h2 className="text-xl font-bold mr-6">
                <span className="text-[var(--color-easyCo-purple)]">EASY</span>
                <span className="text-[var(--color-easyCo-mustard)]">Co</span>
              </h2>
              <p className="text-sm text-[var(--color-easyCo-gray-500)]">
                © 2024 EasyCo. All rights reserved.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-[var(--color-easyCo-gray-100)] hover:bg-[var(--color-easyCo-purple-light)] rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5 text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)]" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[var(--color-easyCo-gray-100)] hover:bg-[var(--color-easyCo-purple-light)] rounded-lg flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5 text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)]" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[var(--color-easyCo-gray-100)] hover:bg-[var(--color-easyCo-purple-light)] rounded-lg flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5 text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)]" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[var(--color-easyCo-gray-100)] hover:bg-[var(--color-easyCo-purple-light)] rounded-lg flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5 text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)]" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}