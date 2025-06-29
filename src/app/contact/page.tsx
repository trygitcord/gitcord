"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { Mail, MessageSquare, Phone, Send, MapPin, Clock } from "lucide-react";
import { HeroHeader } from "@/components/landing/hero";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
} as const;

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      description: "info@gitcord.com",
      subtitle: "We'll respond within 24 hours",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Available 24/7",
      subtitle: "Get instant support",
    },
    {
      icon: MapPin,
      title: "Location",
      description: "Remote Team",
      subtitle: "Working globally",
    },
    {
      icon: Clock,
      title: "Response Time",
      description: "Within 24 hours",
      subtitle: "Usually much faster",
    },
  ];

  return (
    <>
      <HeroHeader />
      <div className="min-h-screen bg-background">
        {/* Background Effects */}
        <div
          aria-hidden
          className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block"
        >
          <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        </div>

        <div className="relative pt-20 md:pt-28">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
          />
          
          <div className="mx-auto max-w-7xl px-6">
            {/* Header Section */}
            <div className="text-center mb-16">
              <AnimatedGroup variants={transitionVariants}>
                <h1 className="text-4xl md:text-6xl font-semibold text-balance mb-6">
                  Get in{" "}
                  <span className="bg-gradient-to-r from-[#4CFFAF] to-[#3ABA81] bg-clip-text text-transparent">
                    Touch
                  </span>
                </h1>
                <p className="mx-auto max-w-2xl text-balance text-lg text-neutral-400">
                  Have questions about Gitcord? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </AnimatedGroup>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-stretch">
              {/* Contact Form */}
              <AnimatedGroup variants={transitionVariants} className="h-full">
                <Card className="border-0 shadow-lg shadow-black/5 dark:shadow-zinc-950/15 bg-card/50 backdrop-blur-sm h-full">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold">Send us a message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Name
                          </label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="focus-visible:ring-green-500/50 focus-visible:border-green-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="focus-visible:ring-green-500/50 focus-visible:border-green-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-2">
                          Subject
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          placeholder="What's this about?"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="focus-visible:ring-green-500/50 focus-visible:border-green-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={6}
                          placeholder="Tell us more about your inquiry..."
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-green-500/50 focus-visible:border-green-500 focus-visible:ring-[3px] resize-none"
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full group relative rounded-xl px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-[#4CFFAF] to-[#3ABA81] text-neutral-950 dark:text-neutral-800 hover:shadow-lg hover:shadow-green-500/25 dark:hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 border-0 flex items-center justify-center gap-2"
                      >
                        Send Message
                        <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </AnimatedGroup>

              {/* Contact Information */}
              <AnimatedGroup variants={transitionVariants} className="space-y-6 h-full">
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                  <p className="text-neutral-400 mb-8">
                    We're here to help and answer any questions you might have. We look forward to hearing from you.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <Card key={index} className="border-0 shadow-sm bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-colors duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#4CFFAF] to-[#3ABA81] flex items-center justify-center">
                              <info.icon className="w-5 h-5 text-neutral-950" />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{info.title}</h3>
                            <p className="text-sm text-foreground font-medium">{info.description}</p>
                            <p className="text-xs text-neutral-400">{info.subtitle}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

              
              </AnimatedGroup>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
