import type { PracticeArea } from '../lib/types';

// Display-layer corrections preserve directory data while replacing verified stale copy.
// Sources are linked in the practical guide; see docs/CONTENT-AUDIT.md.
export function correctPracticeContent(area: PracticeArea): PracticeArea {
  if (area.slug !== 'divorce-separation') return area;
  return {
    ...area,
    body: 'Divorce formally ends a marriage. Parenting arrangements, property and financial support are separate issues, so ask which applications or agreements your circumstances require. Check eligibility, documents and dates before applying.',
    why: 'Ending the marriage does not itself divide property or settle parenting arrangements. Property applications generally need to be made within 12 months after a divorce becomes final; obtain advice about the deadline and any exception that may apply.',
    au_context: 'Divorce is based on the breakdown of the marriage, rather than fault. The FCFCOA removed the counselling-certificate requirement for applicants married less than two years from 10 June 2025. Check the current application process with the relevant court; Western Australia has its own Family Court.',
  };
}
