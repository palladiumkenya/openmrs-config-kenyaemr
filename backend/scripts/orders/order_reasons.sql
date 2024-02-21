-- Viral load reason updates
update concept_name set name = 'Routine VL' where concept_id = 161236 and locale = 'en' and concept_name_type ='FULLY_SPECIFIED';
update concept_name set name = 'Confirmation of treatment failure (repeat VL)' where concept_id = 843 and locale = 'en' and concept_name_type ='FULLY_SPECIFIED';
update concept_name set name = 'Baseline VL (for infants diagnsed through EID)' where concept_id = 162080 and locale = 'en' and concept_name_type ='FULLY_SPECIFIED';
update concept_name set name = 'Confirmation of persistent low level viremia (PLLV)' where concept_id = 160032 and locale = 'en' and concept_name_type ='FULLY_SPECIFIED';
update concept_name set name = 'Single drug substitution' where concept_id = 1259 and locale = 'en' and concept_name_type ='FULLY_SPECIFIED';

-- cd4 order reasons
update concept_name set name = 'Suspected treatment failure' where concept_id = 167387 and locale = 'en' and concept_name_type ='FULLY_SPECIFIED';
update concept_name set name = 'Return to care after Interrupting treatment for >3months' where concept_id = 160740 and locale = 'en' and concept_name_type ='FULLY_SPECIFIED';
update concept_name set name = 'Patient on fluconazole maintenance therapy' where concept_id = 167527 and locale = 'en' and concept_name_type ='FULLY_SPECIFIED';
update concept_name set name = 'Baseline' where concept_id = 167390 and locale = 'en' and concept_name_type ='FULLY_SPECIFIED';

-- PCR order reasons
update concept_name set name = 'Confirmatory PCR and Baseline VL' where concept_id = 162082 and locale = 'en' and concept_name_type ='FULLY_SPECIFIED';
update concept_name set name = 'Initial PCR (6week or first contact)' where concept_id = 1040 and locale = 'en' and concept_name_type ='FULLY_SPECIFIED';
update concept_name set name = '2nd PCR (6 months)' where concept_id = 1326 and locale = 'en' and concept_name_type ='FULLY_SPECIFIED';
update concept_name set name = '3rd PCR (12months)' where concept_id = 844 and locale = 'en' and concept_name_type ='FULLY_SPECIFIED';

-- antibody test order reasons
update concept_name set name = 'Ab test 6 weeks after cessation of breastfeeding' where concept_id = 164460 and locale = 'en' and concept_name_type ='FULLY_SPECIFIED';
update concept_name set name = 'Ab test at 18 months (1.5 years)' where concept_id = 164860 and locale = 'en' and concept_name_type ='FULLY_SPECIFIED';


