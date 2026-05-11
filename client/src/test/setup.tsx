import React from 'react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// 1. IntersectionObserver mock
class IntersectionObserverMock {
  root = null;
  rootMargin = "";
  thresholds = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

// 8. Mock framer-motion (strip out motion props to avoid React warnings)
const motionComponent = (Tag: keyof React.JSX.IntrinsicElements & string) => {
  // Use Omit to avoid conflicts with existing HTML attributes
  interface MotionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
    children?: React.ReactNode;
    initial?: unknown;
    animate?: unknown;
    exit?: unknown;
    variants?: unknown;
    transition?: unknown;
    layout?: unknown;
    viewport?: unknown;
    whileInView?: unknown;
    whileHover?: unknown;
    whileTap?: unknown;
    onAnimationStart?: unknown;
    onAnimationComplete?: unknown;
    drag?: unknown;
  }

  const Component = ({ 
    children, 
    initial: _initial, 
    animate: _animate, 
    exit: _exit, 
    variants: _variants, 
    transition: _transition, 
    layout: _layout, 
    viewport: _viewport, 
    whileInView: _whileInView,
    whileHover: _whileHover,
    whileTap: _whileTap,
    onAnimationStart: _onAnimationStart,
    onAnimationComplete: _onAnimationComplete,
    ...props 
  }: MotionProps) => {
    return React.createElement(Tag, props, children);
  };
  Component.displayName = `motion.${Tag}`;
  return Component;
};

vi.mock('framer-motion', () => ({
  motion: {
    div: motionComponent('div'),
    span: motionComponent('span'),
    aside: motionComponent('aside'),
    header: motionComponent('header'),
    section: motionComponent('section'),
    button: motionComponent('button'),
    tr: motionComponent('tr'),
    nav: motionComponent('nav'),
    h1: motionComponent('h1'),
    h2: motionComponent('h2'),
    h3: motionComponent('h3'),
    p: motionComponent('p'),
    form: motionComponent('form'),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// 7. Mock recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Bar: () => null,
  Pie: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  CartesianGrid: () => null,
  Legend: () => null,
}));
