export type GroupGuide = { overview: string; steps: string[]; questions: string[]; fees: string; timing: string };
export const groupGuides: Record<string, GroupGuide> = {
 family: {
  overview:'Family matters often involve several decisions at once: living arrangements, children, immediate expenses, property and formally ending a marriage. A useful first consultation separates those issues and identifies what needs attention now. Tell the lawyer about safety concerns and existing orders before arranging discussions involving another person.',
  steps:['Explain the relationship history, current arrangements and outcome you want. Identify immediate concerns and provide every existing order or agreement.', 'Discuss negotiation and family dispute resolution. Parenting applications generally involve prior dispute resolution unless an exception applies; ask the lawyer to assess the appropriate process.', 'Ask how an agreement would be documented and implemented. Clarify who handles related transfers, finance and estate-planning work.'],
  questions:['Will you handle parenting, property and divorce together or separately?','How will you communicate with me safely?','What would change the proposed approach or budget?'],
  fees:'Ask for separate estimates for advice, negotiation, document preparation and court work. A fixed divorce-application fee does not necessarily cover parenting or financial disputes.',
  timing:'Highlight court dates, proposed travel or relocation and any planned property sale. Ask which time limits apply to your particular issues rather than assuming there is one deadline for everything.'
 },
 wills: {
  overview:'Planning your affairs, administering an estate and challenging an inheritance are different engagements. Explain your role: will-maker, executor, beneficiary, attorney or concerned relative. Ownership and family relationships help the lawyer identify the necessary work and any conflicts between the people involved.',
  steps:['List family members, property, debts, companies, trusts and superannuation. Identify where original documents are held and which assets are jointly owned.', 'Ask what each document or application would achieve. Confirm which state rules and asset-ownership arrangements need to be considered.', 'Agree on signing, storage and future reviews, or on the executor’s responsibilities for records and distributions. Identify changes that should prompt further advice.'],
  questions:['Does the scope address assets outside my own name?','Who is the client if relatives attend together?','What information is needed before documents can be finalised?'],
  fees:'Compare a simple-will quote with more involved planning or estate administration. Ask about searches, applications, valuations and coordination with an accountant.',
  timing:'Provide the date of death and any estate correspondence promptly. Ask about relevant deadlines before distributing assets, signing a release or assuming a dispute can wait.'
 },
 criminal: {
  overview:'Criminal and traffic advice begins with the actual allegation and stage of the case. Say whether police want an interview, charges have been laid, bail conditions apply or a decision has been made. An enquiry is not confirmation that a lawyer has accepted responsibility for a forthcoming appearance.',
  steps:['Send the charge, summons, bail paperwork and hearing dates through the method requested by the lawyer. Identify whether you are enquiring for yourself or someone else.', 'Ask what evidence is available and what must be obtained. Decisions about a plea or statement should follow advice on your own circumstances.', 'Confirm who will attend the next event, where to meet and what preparation is included. Ask how changes in the case would affect the estimate.'],
  questions:['Can you act before the next interview or hearing?','Who will appear and is that included in the quote?','What should I do if police contact me again?'],
  fees:'One mention, a contested hearing and an appeal are different scopes of work. Ask about preparation, barrister fees and additional appearances.',
  timing:'Make hearing dates and bail conditions clear at first contact. If the firm cannot assist in time, ask about an available practitioner or the relevant legal-aid service.'
 },
 injury: {
  overview:'Workplace injuries, road accidents, public-place incidents and superannuation insurance claims can involve different schemes and evidence. Explain where and when the event occurred, its effect on you and whether a claim or decision already exists. Ask which pathway the lawyer proposes to assess.',
  steps:['Provide a chronology, relevant locations and employer or insurer details, together with forms and decisions already received.', 'Discuss medical, employment, incident and expense records. Ask who will obtain reports and how access, privacy and expert costs will be managed.', 'Have any offer, assessment or release explained before agreeing. Clarify what a resolution would cover and whether related claims need separate advice.'],
  questions:['Which scheme or policy are you assessing?','Who pays for reports and other evidence?','What could I pay if the claim does not succeed?'],
  fees:'Ask for the written meaning of no win, no fee, including expenses, any uplift and possible other costs. The phrase alone is not enough to compare arrangements.',
  timing:'Ask early about notice, claim and review limits in the relevant scheme. Keep the incident date and every insurer decision available for assessment.'
 },
 property: {
  overview:'Reviewing a purchase contract, administering a conveyance and resolving a building or tenancy dispute are different services. Explain whether you are buying, selling, leasing, developing or already in conflict. Confirm the scope offered by a lawyer or licensed conveyancer rather than assuming their services are identical.',
  steps:['Provide the address, parties and current contract or notice. Explain whether anything has been signed and identify every agreed date.', 'Ask which terms, searches and ownership questions will be reviewed. Explain finance, proposed use and any linked transaction.', 'Agree who communicates with agents, lenders and the other side. Confirm how documents are approved and what happens if the matter is delayed or disputed.'],
  questions:['What is included and what counts as extra work?','Have you handled this kind of transaction or dispute?','What must be decided before signing or the next scheduled date?'],
  fees:'Separate legal fees from searches, registration, taxes and third-party expenses. Complex ownership, negotiations or a dispute may fall outside an advertised conveyancing price.',
  timing:'Seek review before signing where possible. Ask about the actual dates in your documents; cooling-off and completion arrangements differ across states and transactions.'
 },
 business: {
  overview:'Start with the commercial objective: entering a contract, changing ownership, raising finance, resolving a dispute or managing risk. Identify the legal entity and who may give instructions. A company, its directors and its shareholders do not necessarily have the same interests.',
  steps:['Explain the transaction, amount involved, parties and desired result. Provide the current agreement and relevant entity or trust details.', 'Ask which risks need legal, accounting, tax or technical advice. Identify essential terms and those you are willing to negotiate.', 'Agree who negotiates, approves documents and tracks continuing obligations. Clarify whether post-completion advice is included.'],
  questions:['Who is your client: the business or me personally?','What specialist input is required?','Which risks and exclusions should I understand before approving the document?'],
  fees:'Request a defined scope or staged budget with assumptions about document review and negotiation rounds. Personal guarantees, tax and related disputes may need separate work.',
  timing:'Highlight signing dates, finance conditions and demands. Raise an inability to meet debts immediately so appropriate advice can be identified before further commitments.'
 },
 employment: {
  overview:'A workplace enquiry may concern dismissal, wages, a contract, discrimination or an investigation. Say whether you are the employee or employer and whether the employment has ended. Employment advice and a related injury claim are different types of work.',
  steps:['Gather the contract, dates, pay records and relevant correspondence. Identify the employer’s legal name rather than only a trading name.', 'Ask which law or process applies and whether its requirements are met. Fair Work Commission unfair dismissal applications have a 21-day filing timeframe, making prompt advice important.', 'Agree how to respond, prepare for a meeting or assess a settlement. Have any release and confidentiality terms explained before signing.'],
  questions:['Which claim or response fits these facts?','What deadline applies and what do you need now?','Does the engagement include conciliation or a hearing?'],
  fees:'Advice on a single document, an investigation response and ongoing representation need different estimates. Ask what negotiation and appearance work is covered.',
  timing:'Put the dismissal or decision date in the first enquiry. Ask whether an external deadline is running while an internal complaint is being considered.'
 },
 immigration: {
  overview:'Advice depends on the pathway, current status, location and application history. Disclose earlier refusals and cancellations. Home Affairs identifies registered migration agents, legal practitioners and certain exempt people as authorised providers of immigration assistance; confirm your adviser’s professional status.',
  steps:['Gather identity documents, visa records, decision letters and application history. Confirm who will give the advice and their scope of work.', 'Ask which requirements and evidence need assessment, including translations or reports. No provider can guarantee the application outcome.', 'Agree who receives correspondence and tracks requests. Keep a complete copy of lodged material and understand what you approve before submission.'],
  questions:['How can I verify your professional status?','Does the scope include further-information requests or review work?','Who monitors correspondence and urgent dates?'],
  fees:'Separate professional fees from government charges, translations and other expenses. Preparing an application does not necessarily include a review or court proceeding.',
  timing:'Provide expiry dates and the entire decision letter immediately. Review rights and dates depend on the particular decision and circumstances.'
 },
 disputes: {
  overview:'A demand, unpaid account, insurance decision or disagreement over professional work can require different strategies. Identify the outcome sought and supporting evidence. The amount involved, other party’s position and cost of pursuing the matter all affect a proportionate approach.',
  steps:['Prepare a chronology, agreement or policy, important communications and a calculation of any claimed amount. Distinguish firsthand facts from assumptions.', 'Discuss negotiation, a complaint scheme, mediation, a tribunal or court. Ask which options are available for this particular matter.', 'Agree on a first step and a point to reassess progress and cost. Before settling, understand what claims would be released and how obligations would be recorded.'],
  questions:['What evidence would change the assessment?','Is a complaint or dispute-resolution scheme available?','What are the practical costs and risks if agreement is not reached?'],
  fees:'Request stages for advice, correspondence, negotiations and proceedings. Discuss filing, expert and barrister costs and any potential liability for another party’s costs.',
  timing:'Provide every demand, decision and court document with its date. Do not assume informal negotiations suspend a response or filing deadline.'
 },
 government: {
  overview:'Identify the government decision, the agency and the result sought. A service complaint, merits review and court challenge are different processes. The right pathway depends on the actual decision rather than a general disagreement with an agency.',
  steps:['Keep the complete notice, reasons and review information. Record when and how the decision was received.', 'Ask whether internal review, a tribunal, complaint or court process is available. The Administrative Review Tribunal reviews specified Commonwealth decisions, not every government matter.', 'Identify evidence relevant to the disputed findings and ask how the agency file can be obtained. Clarify the result the reviewer can provide.'],
  questions:['Which body can review this decision?','What date and requirements need immediate attention?','What evidence is missing and what can the process achieve?'],
  fees:'Clarify charges for advice, submissions, appearances and reports. Ask about legal aid or specialist assistance where appropriate.',
  timing:'Give the decision and receipt dates immediately. A general complaint may not preserve an opportunity to seek formal review.'
 },
 specialist: {
  overview:'Specialist work may turn on an industry, technical document or particular qualification. Maritime, aviation, resources, entertainment and notarial services are not interchangeable. Describe the activity and exact task so a firm can assess its expertise or recommend a referral.',
  steps:['Provide the agreement, notice or receiving authority’s instructions. Explain the objective and any international connection.', 'Ask about comparable work, professional qualifications and coordination with technical advisers. For certification, confirm exactly what the receiving organisation requires.', 'Agree on the deliverable, whether a document, opinion, negotiation, regulatory response or representation. Record assumptions and exclusions.'],
  questions:['What comparable work have you handled?','Are additional qualifications or advisers needed?','What will I receive at the end of the engagement?'],
  fees:'Identify charges for technical reviews, reports, translations, certification and external professionals. These may sit outside a standard consultation.',
  timing:'Supply regulatory, transaction and overseas receiving dates. Ask about external processing time rather than treating an appointment as completion.'
 },
 general: {
  overview:'A general practice can be a useful first contact when several issues overlap or you are unsure how to describe the problem. Explain the facts and desired outcome first. Ask which parts the firm handles and whether specialist input would be appropriate.',
  steps:['Bring a short chronology and the document that prompted the enquiry. Identify the people involved and immediate dates.', 'Separate connected issues and decide what needs attention first. Agree who will coordinate the work or a referral.', 'Request a clear scope, estimate and contact person. If another firm becomes involved, confirm how documents and responsibilities will be transferred with your permission.'],
  questions:['Can you handle all parts of the matter?','Who coordinates specialist input?','What will you do and what do you need me to do?'],
  fees:'Confirm whether the first appointment includes document review and written advice. Request separate estimates when several issues need to be prioritised.',
  timing:'Show notices and deadlines even if you do not understand them. Confirm that a practitioner can act before an urgent date rather than relying on a routine appointment.'
 },
};
