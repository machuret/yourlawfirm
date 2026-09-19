import Link from 'next/link';
import { ArrowUpRight, BookOpen, Check, MapPin } from 'lucide-react';
import type { Group, PracticeArea, Region } from '@/lib/types';
import { regionNotes } from '@/content/regions';
import { areaGuides } from '@/content/areas';
import { groupGuides } from '@/content/groups';
import { reviewed, sources, stateHelp, type Source } from '@/content/sources';

export function GuideNav({ local = false }: { local?: boolean }) {
  return <nav className="guide-nav wrap" aria-label="On this page"><span>On this page</span><a href="#directory-results">Compare firms</a><a href="#practical-guide">{local ? 'Local guide' : 'Practical guide'}</a><a href="#questions">Questions to ask</a><a href="#official-help">Official resources</a></nav>;
}
function ResourceLinks({ links }: { links: Source[] }) {
  return <ul className="resource-links">{links.map(s=><li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}<ArrowUpRight size={15} aria-hidden="true" /></a></li>)}</ul>;
}
function EditorialNote() {
  return <p className="editorial-note">Directory guidance updated {reviewed}. General information to help you prepare for a conversation with a professional; not advice about your individual matter. Check current requirements with the relevant authority.</p>;
}
const accessGuidance: Record<string,string> = {
 capital_city:'A central office may be convenient, but the lawyer’s experience, availability and communication style still matter. Ask whether the person at the first meeting will handle the file and how work is allocated to other solicitors or a barrister. If you are travelling into the city, establish whether a video consultation would achieve the same purpose.',
 metro:'A metropolitan search can cross several suburbs and transport routes. Compare the actual office address, not just the region name, and ask whether follow-up meetings can be remote. If you need an interpreter, step-free access or a support person, discuss those arrangements before making the appointment.',
 regional:'For a regional matter, decide which parts of the service need to happen in person. A solicitor may be able to review records and give initial advice remotely, while a signing, conference or hearing needs separate arrangements. Ask who would attend and how travel, local agents or outside specialists would be charged.',
 remote:'In a remote area, a clear service arrangement matters as much as the office address. Ask about telephone or video intake, visiting services, interpretation and how original documents will be exchanged. Agree on a reliable contact method and responsibility for travel. Confirm any court venue and date directly before making travel plans.',
};
export function LocationGuide({ region:r }: { region:Region }) {
  const note=regionNotes[r.region_slug]; const help=stateHelp[r.state];
  const links=[help,...(r.region_slug==='vic-bendigo'?[sources.bendigo]:[])].filter(Boolean);
  return <section id="practical-guide" className="editorial-guide">
    <div className="guide-heading"><p className="section-eyebrow">A practical local guide</p><h2 className="h-md">Finding legal help in {r.region_name}</h2><p>Understand your options, prepare your first conversation and choose a service that fits your situation.</p></div>
    <div className="guide-columns">
      <article className="guide-prose">
        <h3>Start with the issue, then the location</h3><p>{note?.focus ?? `Explain the legal issue and the outcome you need before comparing firms in ${r.region_name}.`}</p>
        <p>The directory covers {r.major_centres.join(', ')}. These are browsing areas, not court boundaries or a guarantee that every listed firm serves every town. Check the firm’s actual address and ask whether it can take on your matter before making arrangements.</p>
        <h3>Appointments and access to advice</h3><p>{note?.access}</p><p>{accessGuidance[r.region_type] ?? accessGuidance.regional}</p>
        <h3>Compare the scope, not just the quoted price</h3><p>Ask what the initial consultation includes: listening to the background, reviewing documents, written advice or taking action. Request an estimate that separates the lawyer’s work from searches, applications, expert reports and other external costs. A free consultation or a fixed fee may cover a limited step rather than the complete matter.</p>
        <p>Agree who will handle the file, how you will receive updates and when you must approve additional work. If another practitioner, barrister or adviser may be needed, ask who will arrange that work and how their charges will be explained.</p>
        <h3 id="questions">Questions worth asking before you engage a firm</h3>
        <ul><li>Do you regularly handle this type of matter in {r.state}, and do you have capacity to assist now?</li><li>Which facts or documents do you need before you can give an estimate?</li><li>Who will be my main contact, and which meetings or appearances require attendance?</li><li>What is included in the fee, what could change it, and when will you tell me?</li><li>Is a specialist, community service or different process better suited to this issue?</li></ul>
      </article>
      <aside className="guide-sidebar">
        <div className="surface p-6"><BookOpen className="text-accent" size={23} aria-hidden="true"/><h3 className="mt-4">Before your first appointment</h3><ul className="preparation-list"><li>A short timeline with the key dates.</li><li>The contract, notice, decision or letter that prompted the enquiry.</li><li>Names of the people and organisations involved, so the firm can check conflicts.</li><li>The result you want and questions you need answered.</li><li>Any upcoming deadline and communication or accessibility needs.</li></ul><p className="text-sm text-muted mt-5">Ask how to send records securely. An initial enquiry does not establish that a firm has accepted the work.</p></div>
        <div id="official-help" className="surface p-6"><MapPin className="text-accent" size={23} aria-hidden="true"/><h3 className="mt-4">Other ways to get help</h3><p className="mt-3 text-sm leading-relaxed text-ink-2">{help?.label ?? 'Your state legal-aid service'} can explain its information and assistance services. Eligibility and the type of help available vary; ask the service directly. Private directory listings do not establish entitlement to legal aid.</p><ResourceLinks links={links}/><p className="mt-4 text-sm text-muted">For a hearing, use the venue on your notice and confirm current registry and access information.</p></div>
      </aside>
    </div><EditorialNote/>
  </section>;
}
export function PracticeGuide({group:g,area:a,region:r}:{group:Group;area?:PracticeArea;region?:Region}) {
  const guide=groupGuides[g.slug] ?? groupGuides.general; const detail=a?areaGuides[a.slug]:undefined;
  const title=a?.name ?? g.name; const local=r?regionNotes[r.region_slug]:undefined;
  const docs=detail?.documents ?? ['The current agreement, order, notice or decision.','A short chronology and relevant correspondence.','Names of parties, important dates and the outcome you want.'];
  const links=[sources[g.slug] ?? sources.general,...(r&&stateHelp[r.state]?[stateHelp[r.state]]:[]),...(a?.slug==='cyber-security-incidents'?[sources.privacy]:[]),...(a?.slug==='bankruptcy'?[sources.bankruptcy]:[]),...(a?.slug==='divorce-separation'?[sources.divorce,sources.propertyTime,sources.waFamily]:[])];
  return <section id="practical-guide" className="editorial-guide">
    <div className="guide-heading"><p className="section-eyebrow">Understand the next step</p><h2 className="h-md">A practical guide to {title.toLowerCase()}{r?` in ${r.region_name}`:''}</h2></div>
    <div className="guide-columns"><article className="guide-prose">
      <h3>{a?'What to discuss at the first meeting':'Choosing the right kind of assistance'}</h3><p>{detail?.focus ?? guide.overview}</p>
      {detail?<p>{detail.scope}</p>:null}
      {r?<><h3>Working with a firm in {r.region_name}</h3><p>{local?.focus}</p><p>For {title.toLowerCase()}, ask which parts of the work the firm handles itself and whether it has relevant {r.state} experience. Let the lawyer know if a property, employer, other party or existing proceeding is outside {r.region_name}. Your home address alone does not determine the applicable process.</p></>:null}
      <h3>How the engagement may progress</h3><ol className="guide-steps">{guide.steps.map((step,i)=><li key={step}><span aria-hidden="true">0{i+1}</span><p>{step}</p></li>)}</ol>
      <h3>Fees and the scope of work</h3><p>{guide.fees}</p><p>Ask for a written scope identifying the work you are authorising, the person responsible and when costs will be reviewed. If you only want advice on one step, say so before the firm begins wider work.</p>
      <h3>Dates to raise at first contact</h3><p>{guide.timing}</p>
      <h3 id="questions">Questions to ask a {title.toLowerCase()} adviser</h3><ul>{[...(detail?.questions??[]),...guide.questions].map(q=><li key={q}>{q}</li>)}</ul>
    </article><aside className="guide-sidebar">
      <div className="surface p-6"><Check size={24} className="text-accent" aria-hidden="true"/><h3 className="mt-4">Documents to prepare</h3><ul className="preparation-list">{docs.map(d=><li key={d}>{d}</li>)}</ul><p className="mt-5 text-sm text-muted">Use this as a starting checklist. Ask the adviser which originals, translations or further records are actually needed.</p></div>
      <div id="official-help" className="surface p-6"><BookOpen size={23} className="text-accent" aria-hidden="true"/><h3 className="mt-4">Official starting points</h3><p className="mt-3 text-sm text-muted">These resources explain relevant services and processes. State-specific pages are labelled; confirm the rules that apply to your matter.</p><ResourceLinks links={links}/></div>
      {r?<div className="surface p-6"><h3>Explore local options</h3><p className="mt-3 text-sm text-muted">Compare the relevant practice with other services available across {r.major_centres.slice(0,3).join(', ')}.</p><Link className="btn btn-soft mt-5 whitespace-normal" href={`/locations/${r.region_slug}`}>All lawyers in {r.region_name}</Link></div>:null}
    </aside></div><EditorialNote/>
  </section>;
}

