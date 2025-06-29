"use client";
import React from "react";
import { motion } from "motion/react";
import Image from "next/image";

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          y: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[
          ...new Array(2).fill(0).map((_, index: number) => (
            <React.Fragment key={index}>
              {props.testimonials.map(
                ({ text, image, name, role }: Testimonial, i: number) => (
                  <div
                    className="p-8 rounded-3xl border shadow-lg shadow-primary/10 max-w-xs w-full"
                    key={i}
                  >
                    <div>{text}</div>
                    <div className="flex items-center gap-2 mt-5">
                      <Image
                        width={40}
                        height={40}
                        src={image}
                        alt={name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="flex flex-col">
                        <div className="font-medium tracking-tight leading-5">
                          {name}
                        </div>
                        <div className="leading-5 opacity-60 tracking-tight">
                          {role}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
