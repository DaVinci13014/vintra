"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ShieldCheck, Target } from "lucide-react";

const motionTransition = { duration: 0.3, ease: "easeOut" as const };

export function LandingVisual() {
  return (
    <div className="relative flex min-h-[440px] items-center justify-center overflow-hidden border-l border-border bg-surface px-6 py-12 lg:min-h-0 lg:px-12">
      <div aria-hidden="true" className="absolute inset-0 opacity-40">
        <div className="absolute left-0 top-1/4 h-px w-full bg-divider" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-divider" />
        <div className="absolute left-0 top-3/4 h-px w-full bg-divider" />
        <div className="absolute left-1/4 top-0 h-full w-px bg-divider" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-divider" />
        <div className="absolute left-3/4 top-0 h-full w-px bg-divider" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={motionTransition}
        className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl shadow-black/30 sm:p-8"
      >
        <div className="flex items-start justify-between gap-4 border-b border-divider pb-6">
          <div>
            <p className="text-sm text-secondary-text">Objectif principal</p>
            <h2 className="mt-2 text-xl font-semibold">Épargne de sécurité</h2>
          </div>
          <div className="flex size-11 items-center justify-center rounded-xl bg-brand text-brand-foreground">
            <Target aria-hidden="true" size={20} />
          </div>
        </div>

        <div className="py-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-secondary-text">Progression estimée</p>
              <p className="mt-2 font-mono text-4xl font-medium tracking-tight">3 240 €</p>
            </div>
            <p className="font-mono text-sm text-brand">54 %</p>
          </div>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-elevated">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 0.54 }}
              transition={{ ...motionTransition, delay: 0.15 }}
              className="h-full origin-left rounded-full bg-brand"
            />
          </div>
          <div className="mt-3 flex justify-between text-xs text-muted">
            <span>Aujourd’hui</span>
            <span>6 000 €</span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <ShieldCheck aria-hidden="true" className="text-brand" size={20} />
            <p className="mt-5 text-xs text-secondary-text">Capacité estimée</p>
            <p className="mt-1 font-mono text-xl font-medium">320 €/mois</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4">
            <ArrowUpRight aria-hidden="true" className="text-secondary" size={20} />
            <p className="mt-5 text-xs text-secondary-text">Échéance estimée</p>
            <p className="mt-1 font-mono text-xl font-medium">9 mois</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
