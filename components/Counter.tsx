"use client";

import React, { useEffect, useRef } from "react";
import { useInView, motion, useMotionValue, useTransform, animate } from "framer-motion";

interface CounterProps {
  value: number;
  direction?: "up" | "down";
  suffix?: string;
}

export default function Counter({ value, direction = "up", suffix = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // O valor do movimento (MotionValue)
  const count = useMotionValue(direction === "down" ? value : 0);
  
  // Transformamos o valor para um número inteiro
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 2.5, ease: "easeOut" });
      return controls.stop;
    }
  }, [isInView, count, value]);

  // CORREÇÃO: Usamos o useEffect para atualizar o texto do span manualmente
  // Isso evita o erro de "MotionValue is not a ReactNode"
  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = latest.toLocaleString() + suffix;
      }
    });
    return () => unsubscribe();
  }, [rounded, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      0{suffix}
    </span>
  );
}