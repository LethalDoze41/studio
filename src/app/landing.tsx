'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Leaf, ChefHat, Sparkles, Camera, Heart, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/landing" className="flex items-center space-x-2">
            <Leaf className="h-7 w-7 text-primary" />
            <span className="font-bold text-2xl font-headline">Culinary Muse</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost">
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 leading-tight">
              Turn Your Ingredients Into{' '}
              <span className="text-primary">Delicious Recipes</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              AI-powered recipe generation from the ingredients you have. Simply snap a photo or type them in, and let Culinary Muse create personalized recipes just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg">
                <Link href="/signup">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get Started Free
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <Link href="/login">Log In</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/20">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
                alt="Fresh ingredients"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground rounded-full p-6 shadow-xl">
              <ChefHat className="h-12 w-12" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold font-headline mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to culinary inspiration
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: 'Snap or Type',
                description: 'Upload a photo of your ingredients or type them in manually.',
              },
              {
                icon: Sparkles,
                title: 'AI Magic',
                description: 'Our AI analyzes your ingredients and creates personalized recipes based on your preferences.',
              },
              {
                icon: ChefHat,
                title: 'Cook & Enjoy',
                description: 'Follow step-by-step instructions and create delicious meals.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-card rounded-xl p-8 shadow-lg border-2 border-primary/10 hover:border-primary/30 transition-colors h-full">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold font-headline mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold font-headline mb-6">
                Why Choose Culinary Muse?
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: Heart,
                    title: 'Personalized Recipes',
                    description: 'Tailored to your dietary preferences and taste.',
                  },
                  {
                    icon: Sparkles,
                    title: 'Reduce Food Waste',
                    description: 'Use what you have instead of letting it go bad.',
                  },
                  {
                    icon: Users,
                    title: 'Save Time & Money',
                    description: 'No need for expensive meal kits or grocery runs.',
                  },
                ].map((benefit) => (
                  <div key={benefit.title} className="flex gap-4">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-headline mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80"
                  alt="Cooking"
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold font-headline mb-6">
              Ready to Start Cooking?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of home cooks discovering new recipes every day.
            </p>
            <Button asChild size="lg" className="text-lg">
              <Link href="/signup">
                <Sparkles className="mr-2 h-5 w-5" />
                Sign Up Now - It's Free
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg font-headline">Culinary Muse</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Culinary Muse. Built with ❤️ by Firebase Studio.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}