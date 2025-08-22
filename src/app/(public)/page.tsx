"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LayoutDashboard, CreditCard, Users, Star, Menu, X, Plane } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Animation variants for kanban cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    }),
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full bg-gradient-to-b from-white/95 to-white/70 backdrop-blur supports-[backdrop-filter]:from-white/90 supports-[backdrop-filter]:to-white/60 border-b border-slate-200/50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Plane className="h-6 w-6 text-blue-600" />
              <a
                href="/"
                className="text-xl font-bold text-slate-800 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              >
                TripBoard
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block" role="navigation">
              <ul className="flex items-center space-x-8 list-none">
                <li>
                  <a
                    href="#features"
                    className="text-slate-600 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-slate-600 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
                  >
                    How it Works
                  </a>
                </li>
                <li>
                  <a
                    href="#reviews"
                    className="text-slate-600 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
                  >
                    Reviews
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-slate-600 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-blue-500"
              >
                Sign In
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white focus:ring-2 focus:ring-blue-500"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-controls="mobile-menu"
                  aria-expanded={mobileMenuOpen}
                  aria-label="Toggle navigation menu"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                id="mobile-menu"
                className="w-[300px] sm:w-[400px] bg-white"
              >
                <SheetHeader>
                  <SheetTitle className="text-left">Navigation</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-8" role="navigation">
                  <a
                    href="#features"
                    className="text-slate-600 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </a>
                  <a
                    href="#how-it-works"
                    className="text-slate-600 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    How it Works
                  </a>
                  <a
                    href="#reviews"
                    className="text-slate-600 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Reviews
                  </a>
                  <a
                    href="#pricing"
                    className="text-slate-600 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </a>
                  <div className="flex flex-col space-y-3 pt-6 border-t border-slate-200">
                    <Button
                      variant="outline"
                      className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-blue-500"
                    >
                      Sign In
                    </Button>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white focus:ring-2 focus:ring-blue-500"
                    >
                      Get Started
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-12 lg:py-20 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight">
                  Plan Your Perfect Trip
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl">
                  Organize destinations, track budgets, and collaborate with travel companions using our beautiful kanban-style planning boards.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold focus:ring-2 focus:ring-blue-500"
                    asChild
                  >
                    <a href="/login">Start Planning Free</a>
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="px-8 py-4 text-lg font-semibold focus:ring-2 focus:ring-blue-500"
                  >
                    Watch Demo
                  </Button>
                </div>

                {/* Metrics */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">10k+</span>
                    <span>Happy Travelers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">50k+</span>
                    <span>Trips Planned</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">4.9</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>User Rating</span>
                  </div>
                </div>
              </div>

              {/* Kanban Board Visual */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  {/* Laptop Frame */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="bg-slate-800 rounded-t-2xl p-6 shadow-2xl transform rotate-3 hover:rotate-1 transition-transform duration-300"
                  >
                    <div className="bg-white rounded-lg p-4 min-h-[320px] w-[400px] shadow-inner">
                      {/* Kanban Board */}
                      <div className="grid grid-cols-3 gap-3 h-full">
                        {/* Planning Column */}
                        <motion.div
                          custom={0}
                          variants={cardVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          className="bg-slate-50 rounded-lg p-3"
                        >
                          <h3 className="text-xs font-semibold text-slate-600 mb-3 text-center">
                            Planning
                          </h3>
                          <div className="space-y-2">
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                              className="bg-blue-50 border-l-4 border-blue-400 p-2 rounded text-xs shadow-sm"
                            >
                              <div className="font-medium text-slate-800">Research Hotels</div>
                              <div className="text-slate-600 text-xs mt-1">$500 budget</div>
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 }}
                              className="bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded text-xs shadow-sm"
                            >
                              <div className="font-medium text-slate-800">Book Flights</div>
                              <div className="text-slate-600 text-xs mt-1">$800 budget</div>
                            </motion.div>
                          </div>
                        </motion.div>

                        {/* Booked Column */}
                        <motion.div
                          custom={1}
                          variants={cardVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          className="bg-slate-50 rounded-lg p-3"
                        >
                          <h3 className="text-xs font-semibold text-slate-600 mb-3 text-center">
                            Booked
                          </h3>
                          <div className="space-y-2">
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 }}
                              className="bg-purple-50 border-l-4 border-purple-400 p-2 rounded text-xs shadow-sm"
                            >
                              <div className="font-medium text-slate-800">Airport Transfer</div>
                              <div className="text-slate-600 text-xs mt-1">$50 paid</div>
                            </motion.div>
                          </div>
                        </motion.div>

                        {/* Completed Column */}
                        <motion.div
                          custom={2}
                          variants={cardVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          className="bg-slate-50 rounded-lg p-3"
                        >
                          <h3 className="text-xs font-semibold text-slate-600 mb-3 text-center">
                            Completed
                          </h3>
                          <div className="space-y-2">
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 }}
                              className="bg-green-50 border-l-4 border-green-400 p-2 rounded text-xs shadow-sm flex flex-col"
                            >
                              <div className="font-medium text-slate-800">Get Passport</div>
                              <div className="text-slate-600 flex items-center gap-1 text-xs mt-1">
                                <Star className="h-3 w-3 fill-green-500 text-green-500" />
                                Done
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                  {/* Laptop Base */}
                  <div className="bg-slate-700 h-6 rounded-b-2xl transform rotate-3 hover:rotate-1 transition-transform duration-300 shadow-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
                Everything You Need to Plan
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <LayoutDashboard className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800">Visual Planning</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-slate-600 leading-relaxed">
                    Organize your trip with intuitive Kanban boards. Drag and drop tasks from planning to completion.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <CreditCard className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800">Smart Budgeting</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-slate-600 leading-relaxed">
                    Track expenses in real-time with automatic calculations and per-person budget breakdowns.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group md:col-span-2 lg:col-span-1">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800">Team Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-slate-600 leading-relaxed">
                    Plan together with real-time collaboration, comments, and role-based permissions.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-16 lg:py-24 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
                Simple. Powerful. Effective.
              </h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              <div className="text-center group">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300"
                >
                  1
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Create Your Board</h3>
                <p className="text-slate-600 leading-relaxed">
                  Start with a template or a custom board for your trip.
                </p>
              </div>

              <div className="text-center group">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300"
                >
                  2
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Add Your Tasks</h3>
                <p className="text-slate-600 leading-relaxed">
                  Break down your trip into manageable tasks with budgets and due dates.
                </p>
              </div>

              <div className="text-center group">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300"
                >
                  3
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Track Progress</h3>
                <p className="text-slate-600 leading-relaxed">
                  Move tasks through your workflow as you complete them.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-8">
                Loved by Travelers Worldwide
              </h2>

              {/* Metric Badges */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-md">
                  50K+ Trips Planned
                </div>
                <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-full font-semibold shadow-md">
                  99.9% Uptime
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <CardDescription className="text-slate-600 leading-relaxed">
                    "TripBoard made planning our European vacation effortless. The budget tracking feature saved us from overspending, and collaborating with my travel partner was seamless."
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-slate-800">— Sarah M.</p>
                  <p className="text-sm text-slate-500">Frequent Traveler</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <CardDescription className="text-slate-600 leading-relaxed">
                    "The kanban interface is intuitive and beautiful. I love how I can track everything from flight bookings to restaurant reservations in one place."
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-slate-800">— Mike R.</p>
                  <p className="text-sm text-slate-500">Business Traveler</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <CardDescription className="text-slate-600 leading-relaxed">
                    "Planning our family reunion became stress-free with TripBoard. The collaboration features let everyone contribute, and we stayed within budget thanks to the smart tracking."
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-slate-800">— Jennifer L.</p>
                  <p className="text-sm text-slate-500">Family Trip Planner</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Plan Your Next Adventure?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who trust TripBoard to organize their perfect trips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                asChild
              >
                <a href="/login">Start Free Trial</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Logo and Copyright */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Plane className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold text-white">TripBoard</span>
              </div>
              <p className="text-slate-400 text-sm">
                © 2025 TripBoard. All rights reserved.
              </p>
            </div>

            {/* Product Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Product</h3>
              <div className="space-y-2 text-sm">
                <a
                  href="#features"
                  className="block text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="block text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                >
                  Pricing
                </a>
                <a
                  href="/templates"
                  className="block text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                >
                  Templates
                </a>
                <a
                  href="/mobile"
                  className="block text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                >
                  Mobile App
                </a>
                <a
                  href="/about"
                  className="block text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                >
                  About
                </a>
                <a
                  href="/blog"
                  className="block text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                >
                  Blog
                </a>
                <a
                  href="/careers"
                  className="block text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                >
                  Careers
                </a>
                <a
                  href="/contact"
                  className="block text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                >
                  Contact
                </a>
              </div>
            </div>

            {/* Support Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Support</h3>
              <div className="space-y-2 text-sm">
                <a
                  href="/help"
                  className="block text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                >
                  Help Center
                </a>
                <a
                  href="/privacy"
                  className="block text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="block text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                >
                  Terms of Service
                </a>
                <a
                  href="/status"
                  className="block text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                >
                  Status
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}