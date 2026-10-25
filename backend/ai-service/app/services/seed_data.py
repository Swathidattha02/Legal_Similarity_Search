"""
Landmark Indian Court Judgments Seed Dataset.
Provides structured, authentic legal precedents with statutory provisions,
factual summaries, and judicial ratios for indexing into ChromaDB.
"""
from typing import List, Dict, Any

LANDMARK_CASES: List[Dict[str, Any]] = [
    {
        "document_id": "case_puttaswamy_2017",
        "case_title": "Justice K. S. Puttaswamy (Retd.) and Anr. v. Union of India and Ors.",
        "court": "Supreme Court of India (9-Judge Constitution Bench)",
        "year": 2017,
        "citation": "(2017) 10 SCC 1; AIR 2017 SC 4161",
        "statutes": ["Article 21", "Article 14", "Article 19", "Information Technology Act 2000"],
        "source_url": "https://main.sci.gov.in/supremecourt/2012/35071/35071_2012_Judgement_24-Aug-2017.pdf",
        "summary": "Nine-judge Constitution Bench unanimously held that the Right to Privacy is an intrinsic and protected fundamental right under Article 21 and Part III of the Constitution of India.",
        "text": """
FACTS OF THE CASE:
A batch of writ petitions was filed challenging the constitutional validity of the Aadhaar biometric identification scheme initiated by the Union of India. The primary constitutional question referred to a nine-judge Constitution Bench was whether the right to privacy is guaranteed as an independent fundamental right under the Constitution of India, in light of previous decisions in M.P. Sharma (1954) and Kharak Singh (1962).

ARGUMENTS AND SUBMISSIONS:
The petitioners contended that privacy is a core constitutional value essential to individual autonomy, bodily integrity, personal dignity, and informational self-determination under Article 21 and Article 19. The Attorney General for India submitted that the framers of the Constitution consciously excluded privacy from the fundamental rights chapter and that privacy could only be recognized as a common law or statutory right.

HELD AND JUDICIAL RULING:
The Supreme Court unanimously held that the Right to Privacy is a fundamental right protected under Article 21 as an intrinsic part of the right to life and personal liberty, and as a facet of the freedoms guaranteed in Part III of the Constitution. M.P. Sharma v. Satish Chandra to the extent that it held privacy is not protected under the Constitution, and Kharak Singh v. State of U.P. to the extent that it held privacy is not a fundamental right, are expressly overruled.

LEGAL RATIO AND PRINCIPLES:
Privacy includes personal autonomy, bodily integrity, spatial privacy, and informational privacy. Informational privacy requires a robust data protection framework. Any encroachment upon privacy by the State must satisfy the three-fold constitutional test: (1) Legality (valid law authorizing encroachment); (2) Legitimate state aim (proportionality and necessity); and (3) Procedural safeguards to prevent abuse.
"""
    },
    {
        "document_id": "case_kesavananda_1973",
        "case_title": "Kesavananda Bharati Sripadagalvaru and Ors. v. State of Kerala and Anr.",
        "court": "Supreme Court of India (13-Judge Constitution Bench)",
        "year": 1973,
        "citation": "(1973) 4 SCC 225; AIR 1973 SC 1461",
        "statutes": ["Article 368", "Article 13", "Article 14", "Article 19", "Article 31C"],
        "source_url": "https://main.sci.gov.in/judgment/judis/4963.pdf",
        "summary": "Established the Basic Structure Doctrine, ruling that Parliament's constituent power to amend the Constitution under Article 368 does not extend to altering or destroying its basic structure.",
        "text": """
FACTS OF THE CASE:
His Holiness Kesavananda Bharati, head of Edneer Mutt in Kerala, challenged the Kerala Land Reforms Amendment Acts of 1969 and 1971 which curtailed religious property ownership rights under Articles 25 and 26. While the petition was pending, Parliament enacted the 24th, 25th, and 29th Constitutional Amendments curtailing judicial review of property acquisition and expanding parliamentary amending power under Article 368.

ARGUMENTS AND SUBMISSIONS:
The petitioner, represented by Nani Palkhivala, argued that Article 368 grants the power to amend but not to alter or abrogate the essential features and identity of the Constitution. The respondents contended that the power of constitutional amendment under Article 368 is unlimited, plenary, and sovereign, not subject to substantive judicial review.

HELD AND JUDICIAL RULING:
By a 7:6 majority, the Supreme Court held that while Parliament has wide constituent powers to amend any provision of the Constitution under Article 368, it does not possess the power to alter, destroy, or abrogate the basic structure or framework of the Constitution.

LEGAL RATIO AND PRINCIPLES:
The Basic Structure Doctrine establishes that fundamental pillars of the Indian constitutional order—including supremacy of the Constitution, republican and democratic form of government, secular character, separation of powers between the legislature, executive, and judiciary, and federalism—are immune from constitutional amendment.
"""
    },
    {
        "document_id": "case_arnesh_kumar_2014",
        "case_title": "Arnesh Kumar v. State of Bihar and Anr.",
        "court": "Supreme Court of India",
        "year": 2014,
        "citation": "(2014) 8 SCC 273; AIR 2014 SC 2756",
        "statutes": ["Section 41 CrPC", "Section 41A CrPC", "Section 498A IPC", "Section 4 Dowry Prohibition Act"],
        "source_url": "https://main.sci.gov.in/judgment/judis/41736.pdf",
        "summary": "Laid down mandatory guidelines restraining arbitrary police arrests in criminal offences punishable with imprisonment of seven years or less, mandating issuance of Section 41A CrPC notice.",
        "text": """
FACTS OF THE CASE:
The appellant husband was prosecuted for offences under Section 498A IPC (cruelty to married woman) and Section 4 of the Dowry Prohibition Act 1961 on allegations by his wife. Apprehending arrest, the appellant sought anticipatory bail, which was rejected by the High Court of Patna. The matter came in appeal before the Supreme Court challenging mechanical arrest practices.

ARGUMENTS OF THE PARTIES:
The appellant argued that provisions of Section 498A IPC were frequently weaponized to harass husband and in-laws, leading to immediate custodial arrest without inquiry. The State argued that allegations in matrimonial offences warrant prompt custodial investigation to protect aggrieved women.

HELD AND JUDICIAL RULING:
The Supreme Court held that arrest should not be a mechanical consequence of registration of a cognizable offence. In cases where the offence is punishable with imprisonment for a term which may be less than seven years or may extend up to seven years, police officers shall not automatically arrest the accused unless the conditions enumerated in Section 41(1)(b)(ii) CrPC are satisfied.

LEGAL RATIO AND DIRECTIONS:
Police officers must be provided with a checklist containing specified sub-clauses under Section 41(1)(b)(ii). The police officer shall forward the checklist duly filled and produce reasons and materials justifying arrest before the Magistrate while seeking detention. In all other cases, notice of appearance under Section 41A CrPC must be served on the accused within two weeks from the date of institution of the case. Failure to comply makes the police officer liable for departmental action and contempt of court.
"""
    },
    {
        "document_id": "case_sushila_aggarwal_2020",
        "case_title": "Sushila Aggarwal and Ors. v. State (NCT of Delhi) and Anr.",
        "court": "Supreme Court of India (5-Judge Constitution Bench)",
        "year": 2020,
        "citation": "(2020) 5 SCC 1; 2020 SCC OnLine SC 98",
        "statutes": ["Section 438 CrPC", "Section 437 CrPC", "Section 439 CrPC", "Article 21"],
        "source_url": "https://main.sci.gov.in/supremecourt/2018/7279/7279_2018_4_1501_20117_Judgement_29-Jan-2020.pdf",
        "summary": "Constitution Bench held that anticipatory bail under Section 438 CrPC is not bound by rigid time limits and ordinarily operates until the conclusion of the trial unless special conditions are imposed.",
        "text": """
FACTS OF THE CASE:
Conflicting judgments of the Supreme Court existed regarding whether pre-arrest bail under Section 438 of the Code of Criminal Procedure 1973 should be restricted to a specific period or until the filing of the charge sheet. A 5-judge Constitution Bench was constituted to resolve whether anticipatory bail must be limited in duration and whether it expires upon summoning by court.

ARGUMENTS OF THE PARTIES:
Petitioners argued that Section 438 CrPC contains no words of limitation, and reading a time cap into it impairs personal liberty under Article 21. The prosecution argued that unlimited pre-arrest protection hampers ongoing investigation and collecting custodial discoveries under Section 27 of the Evidence Act.

HELD AND JUDICIAL RULING:
The Constitution Bench unanimously held that the protection granted to a person under Section 438 CrPC should not invariably be limited to a fixed period; it should inure in favor of the accused without restriction on time until the end of the trial, unless exceptional reasons are recorded by the court.

LEGAL RATIO AND PRINCIPLES:
The court cannot read into Section 438 conditions or restrictions not placed by Parliament. The application for anticipatory bail should be based on concrete facts and reasonable apprehension of arrest. The order of anticipatory bail does not impede the police from conducting investigation or seeking recovery under Section 27 of the Evidence Act, as deemed custody applies during police interrogation.
"""
    },
    {
        "document_id": "case_jacob_mathew_2005",
        "case_title": "Jacob Mathew v. State of Punjab and Anr.",
        "court": "Supreme Court of India",
        "year": 2005,
        "citation": "(2005) 6 SCC 1; AIR 2005 SC 3180",
        "statutes": ["Section 304A IPC", "Section 336 IPC", "Consumer Protection Act 1986"],
        "source_url": "https://main.sci.gov.in/judgment/judis/27077.pdf",
        "summary": "Established the benchmark of gross negligence required for criminal prosecution of doctors under Section 304A IPC and mandated independent medical opinion prior to registering criminal charges.",
        "text": """
FACTS OF THE CASE:
A patient admitted to a private hospital in Ludhiana suffered breathing distress. The oxygen cylinder connected to him was found empty; an alternative cylinder took time to arrange, during which the patient passed away. The appellant doctor was charged under Section 304A (causing death by negligence) read with Section 34 of the Indian Penal Code.

ARGUMENTS AND SUBMISSIONS:
The appellant argued that an error of judgment or medical mishap does not constitute criminal negligence. The complainant contended that failure to maintain a functioning oxygen supply in a hospital constitutes culpable negligence attracting Section 304A IPC.

HELD AND JUDICIAL RULING:
The Supreme Court held that the standard of negligence required to establish criminal liability under Section 304A IPC is significantly higher than that in civil tort law. To constitute criminal negligence, the negligence must be gross, reckless, or displaying callous disregard for human life and safety.

LEGAL RATIO AND DIRECTIVES:
A medical professional possesses skill and knowledge; so long as the doctor adopts an acceptable practice recognized by a competent body of medical opinion (the Bolam test), no negligence arises simply because an alternative treatment existed. Private complaints against medical practitioners shall not be entertained by police or courts unless supported by an independent credible medical opinion from a qualified government medical doctor confirming gross negligence.
"""
    },
    {
        "document_id": "case_shreya_singhal_2015",
        "case_title": "Shreya Singhal v. Union of India",
        "court": "Supreme Court of India",
        "year": 2015,
        "citation": "(2015) 5 SCC 1; AIR 2015 SC 1523",
        "statutes": ["Section 66A Information Technology Act 2000", "Article 19(1)(a)", "Article 19(2)", "Section 69A IT Act"],
        "source_url": "https://main.sci.gov.in/judgment/judis/42478.pdf",
        "summary": "Struck down Section 66A of the Information Technology Act 2000 as unconstitutional, affirming that online speech enjoys the same constitutional protections under Article 19(1)(a) as offline speech.",
        "text": """
FACTS OF THE CASE:
Writ petitions were filed challenging the constitutional validity of Section 66A of the Information Technology Act 2000 following high-profile arrests of citizens for posting political commentary, satirical remarks, and opinions on social media platforms.

ARGUMENTS AND SUBMISSIONS:
The petitioners argued that Section 66A suffered from extreme vagueness and overbreadth, criminalizing speech that was merely annoying or inconvenient, thereby violating Article 19(1)(a). The Union argued that internet reach requires stronger regulation and that the provision is saved under reasonable restrictions in Article 19(2).

HELD AND JUDICIAL RULING:
The Supreme Court struck down Section 66A of the Information Technology Act 2000 in its entirety as unconstitutional and violative of the right to freedom of speech and expression guaranteed under Article 19(1)(a).

LEGAL RATIO AND PRINCIPLES:
Section 66A was neither narrowly tailored nor covered by any of the eight grounds of reasonable restrictions in Article 19(2). The court distinguished between 'discussion', 'advocacy', and 'incitement'—holding that advocacy of even an unpopular cause cannot be suppressed unless it reaches the clear threshold of incitement to violence or public disorder. The vagueness of terms like 'grossly offensive' created an impermissible chilling effect on speech.
"""
    },
    {
        "document_id": "case_rangappa_2010",
        "case_title": "Rangappa v. Sri Mohan",
        "court": "Supreme Court of India (3-Judge Bench)",
        "year": 2010,
        "citation": "(2010) 11 SCC 441; AIR 2010 SC 1898",
        "statutes": ["Section 138 Negotiable Instruments Act 1881", "Section 139 NI Act", "Section 118 NI Act"],
        "source_url": "https://main.sci.gov.in/judgment/judis/36319.pdf",
        "summary": "Held that the statutory presumption under Section 139 of the Negotiable Instruments Act includes the existence of a legally enforceable debt, rebuttable on a preponderance of probabilities.",
        "text": """
FACTS OF THE CASE:
The appellant issued a cheque of Rs. 45,000 to the respondent which was dishonoured by the bank with the endorsement 'payment stopped by drawer'. The complainant issued statutory demand notice and filed a complaint under Section 138 of the Negotiable Instruments Act 1881. The trial court acquitted the accused, but the High Court reversed the acquittal.

ARGUMENTS AND SUBMISSIONS:
The appellant argued that he had lost a signed blank cheque and that no legally enforceable debt existed between the parties, citing Krishna Janardhan Bhat v. Dattatraya G. Hegde. The respondent argued that Section 139 mandates a legal presumption of enforceable debt once signature on the cheque is admitted.

HELD AND JUDICIAL RULING:
The Supreme Court upheld the conviction, modifying the earlier stance in Krishna Janardhan Bhat. The court ruled that the presumption mandated by Section 139 NI Act indeed extends to the existence of a legally enforceable debt or liability.

LEGAL RATIO AND PRINCIPLES:
Once execution of the cheque is admitted or proved, the court is duty-bound to presume that the cheque was issued for discharge of a debt. However, this is a rebuttable presumption. The standard of proof required for the accused to rebut the presumption is not proof beyond reasonable doubt, but preponderance of probabilities. The accused can rebut the presumption through cross-examination of the complainant and materials on record without necessarily entering the witness box.
"""
    },
    {
        "document_id": "case_vidya_drolia_2021",
        "case_title": "Vidya Drolia and Ors. v. Durga Trading Corporation",
        "court": "Supreme Court of India (3-Judge Bench)",
        "year": 2021,
        "citation": "(2021) 2 SCC 1; 2020 SCC OnLine SC 1018",
        "statutes": ["Section 8 Arbitration and Conciliation Act 1996", "Section 11 Arbitration Act", "Transfer of Property Act 1882"],
        "source_url": "https://main.sci.gov.in/supremecourt/2019/3932/3932_2019_34_1501_25150_Judgement_14-Dec-2020.pdf",
        "summary": "Formulated a four-fold test for arbitrability of disputes and held that landlord-tenant disputes governed by the Transfer of Property Act are arbitrable.",
        "text": """
FACTS OF THE CASE:
A dispute arose under a lease deed between a landlord and tenant. The landlord invoked the arbitration clause and approached the High Court under Section 11 of the Arbitration and Conciliation Act 1996 for appointment of an arbitrator. The tenant resisted arbitration citing previous decisions holding tenancy disputes non-arbitrable.

ARGUMENTS AND SUBMISSIONS:
The appellant tenant argued that tenancy matters are governed by special public policy regimes and summary statutory forums, making them incapable of arbitration. The respondent argued that private contractual leases under the Transfer of Property Act are contractual actions in personam and fully arbitrable.

HELD AND JUDICIAL RULING:
The Supreme Court held that landlord-tenant disputes governed by the Transfer of Property Act 1882 are arbitrable as they pertain to subordinate rights in personam arising from rights in rem. Only those tenancy disputes covered by special Rent Control legislation are non-arbitrable.

LEGAL RATIO AND PRINCIPLES:
The court formulated a four-fold test to determine non-arbitrability: A dispute is non-arbitrable when: (1) it relates to actions in rem (not subordinate rights in personam); (2) it affects third-party rights or has erga omnes effect; (3) it involves sovereign functions of the State; or (4) it is expressly or implicitly non-arbitrable under mandatory statutory provisions conferring exclusive jurisdiction on public forums.
"""
    },
    {
        "document_id": "case_maneka_gandhi_1978",
        "case_title": "Maneka Gandhi v. Union of India",
        "court": "Supreme Court of India (7-Judge Bench)",
        "year": 1978,
        "citation": "(1978) 1 SCC 248; AIR 1978 SC 597",
        "statutes": ["Article 21", "Article 14", "Article 19", "Passports Act 1967"],
        "source_url": "https://main.sci.gov.in/judgment/judis/5230.pdf",
        "summary": "Revolutionized Article 21 by holding that 'procedure established by law' must be just, fair, and reasonable, creating the constitutional doctrine of substantive due process in India.",
        "text": """
FACTS OF THE CASE:
The passport of petitioner Maneka Gandhi was impounded by the Regional Passport Office, New Delhi under Section 10(3)(c) of the Passports Act 1967 'in the public interest' without providing any reasons or opportunity of hearing. The petitioner challenged the impounding order under Article 32 of the Constitution.

ARGUMENTS AND SUBMISSIONS:
The petitioner contended that the right to travel abroad is part of personal liberty under Article 21 and freedom of expression under Article 19(1)(a). The impounding violated principles of natural justice (audi alteram partem). The Union argued that executive orders under statutory authorization satisfy the literal wording of 'procedure established by law'.

HELD AND JUDICIAL RULING:
The Supreme Court held that Article 21 cannot be read in isolation. The procedure established by law must satisfy the tests of Article 14 (non-arbitrariness) and Article 19 (reasonableness). A procedure depriving a person of life or liberty must be just, fair, and reasonable, not arbitrary, fanciful, or oppressive.

LEGAL RATIO AND PRINCIPLES:
The Golden Triangle of the Constitution (Articles 14, 19, and 21) must be satisfied conjunctively. Principles of natural justice are an integral component of fair procedure under Article 21. Natural justice cannot be eliminated merely because a statute is silent. The right to travel abroad is an essential component of personal liberty under Article 21.
"""
    },
    {
        "document_id": "case_dk_basu_1997",
        "case_title": "D.K. Basu v. State of West Bengal",
        "court": "Supreme Court of India",
        "year": 1997,
        "citation": "(1997) 1 SCC 416; AIR 1997 SC 610",
        "statutes": ["Article 21", "Article 22", "Section 50 CrPC", "Section 57 CrPC"],
        "source_url": "https://main.sci.gov.in/judgment/judis/13300.pdf",
        "summary": "Formulated mandatory constitutional guidelines to prevent custodial torture and deaths, imposing strict accountability on arresting police officers.",
        "text": """
FACTS OF THE CASE:
The Executive Chairman of Legal Aid Services, West Bengal addressed a letter to the Chief Justice of India drawing attention to recurrent deaths in police custody and lock-ups. The Supreme Court treated the letter as a public interest writ petition under Article 32 to prescribe safeguards against custodial violence.

ARGUMENTS AND SUBMISSIONS:
The amicus curiae and legal aid bodies argued that custodial violence and torture violate human dignity and Article 21. The State submitted that strict guidelines are needed but should not paralyze police investigation of heinous crimes.

HELD AND JUDICIAL RULING:
The Supreme Court held that custodial torture is a naked violation of human dignity protected by Article 21 and laid down 11 mandatory guidelines to be strictly followed in all cases of arrest and detention until statutory provisions are enacted.

LEGAL RATIO AND GUIDELINES:
(1) Arresting officers must wear accurate identification tags with designation; (2) Arrest memo must be prepared at the time of arrest and witnessed by at least one family member or respected citizen; (3) Person arrested has the right to have a friend or relative informed of arrest within 8 to 12 hours; (4) Medical inspection of the arrested person must be conducted at the time of arrest and repeated every 48 hours; (5) Copies of all arrest memos must be dispatched to the local Magistrate. Contempt of court applies to defaulting officers.
"""
    },
    {
        "document_id": "case_lalita_kumari_2014",
        "case_title": "Lalita Kumari v. Govt. of U.P. and Ors.",
        "court": "Supreme Court of India (5-Judge Constitution Bench)",
        "year": 2014,
        "citation": "(2014) 2 SCC 1; AIR 2014 SC 187",
        "statutes": ["Section 154 CrPC", "Section 156 CrPC", "Section 157 CrPC"],
        "source_url": "https://main.sci.gov.in/judgment/judis/41004.pdf",
        "summary": "Held that registration of an FIR under Section 154 CrPC is mandatory upon receipt of information disclosing commission of a cognizable offence.",
        "text": """
FACTS OF THE CASE:
A writ petition under Article 32 was filed alleging that a minor girl had been kidnapped and the police officer in charge of the police station refused to register a First Information Report (FIR) despite receiving a complaint disclosing a cognizable offence. Conflicting decisions of the Supreme Court existed regarding whether preliminary inquiry is permissible before registering an FIR.

ARGUMENTS AND SUBMISSIONS:
The petitioner argued that the word 'shall' in Section 154(1) CrPC is mandatory and admits no discretion. The State argued that preliminary inquiry is necessary to prevent harassment of innocent citizens and abuse of criminal process in frivolous complaints.

HELD AND JUDICIAL RULING:
The Constitution Bench held that registration of an FIR is mandatory under Section 154 of the Code of Criminal Procedure if the information discloses commission of a cognizable offence, and no preliminary inquiry is permissible in such a situation.

LEGAL RATIO AND EXCEPTIONS:
If information does not disclose a cognizable offence but indicates the necessity for an inquiry, a preliminary inquiry may be conducted only to ascertain whether a cognizable offence is disclosed. Preliminary inquiry is strictly time-bound (not exceeding 7 days) and permissible only in designated classes of cases: (a) Matrimonial disputes; (b) Commercial offences; (c) Medical negligence; (d) Corruption cases; and (e) Abnormal delay in lodging complaints.
"""
    },
    {
        "document_id": "case_mc_mehta_1987",
        "case_title": "M.C. Mehta and Anr. v. Union of India and Ors. (Oleum Gas Leak Case)",
        "court": "Supreme Court of India (5-Judge Bench)",
        "year": 1987,
        "citation": "(1987) 1 SCC 395; AIR 1987 SC 1086",
        "statutes": ["Article 21", "Article 32", "Environment Protection Act 1986", "Water Act 1974"],
        "source_url": "https://main.sci.gov.in/judgment/judis/10778.pdf",
        "summary": "Formulated the revolutionary doctrine of Absolute Liability for hazardous industrial enterprises, holding that liability for industrial harm is strict and subject to no exceptions.",
        "text": """
FACTS OF THE CASE:
In December 1985, a major leakage of oleum gas occurred from the caustic chlorine plant of Shriram Foods and Fertilizer Industries in Delhi, causing death and injury to several workers and residents. Public interest litigator M.C. Mehta approached the Supreme Court under Article 32 seeking compensation and closure of the hazardous unit.

ARGUMENTS AND SUBMISSIONS:
The enterprise argued that liability should be determined under the common law rule of strict liability laid down in Rylands v. Fletcher (1868), which allows exceptions such as act of God, consent of plaintiff, or independent third-party acts. The petitioners argued that Indian environmental jurisprudence needs an unyielding rule of enterprise liability.

HELD AND JUDICIAL RULING:
The Supreme Court rejected the nineteenth-century English rule of strict liability and evolved the indigenous principle of Absolute Liability.

LEGAL RATIO AND PRINCIPLES:
Where an enterprise is engaged in a hazardous or inherently dangerous activity and harm results to anyone on account of an accident in the operation of such activity, the enterprise is strictly and absolutely liable to compensate all those affected. Such liability is not subject to any of the exceptions to the rule of strict liability in Rylands v. Fletcher. The measure of compensation must be correlative to the magnitude and capacity of the enterprise to have a deterring effect.
"""
    }
]


def get_all_seed_cases() -> List[Dict[str, Any]]:
    """Return the landmark cases dataset."""
    return LANDMARK_CASES
