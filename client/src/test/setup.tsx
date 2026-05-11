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
const motionComponent = (Tag: string) => {
  const Component = ({ 
    children, 
    _initial, 
    _animate, 
    _exit, 
    _variants, 
    _transition, 
    _layout, 
    _viewport, 
    _whileInView,
    _whileHover,
    _whileTap,
    _onAnimationStart,
    _onAnimationComplete,
    ...props 
  }: any) => {
    return <Tag {...props}>{children}</Tag>;
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
  AnimatePresence: ({ children }: any) => children,
}));

// 7. Mock recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => children,
  BarChart: ({ children }: any) => <div>{children}</div>,
  PieChart: ({ children }: any) => <div>{children}</div>,
  Bar: () => null,
  Pie: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  CartesianGrid: () => null,
  Legend: () => null,
}));
