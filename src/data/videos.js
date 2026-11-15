const NESO_PL='https://www.youtube.com/playlist?list=PLBlnK6fEyqRgp46KUv4ZY69yXmpwKOIev';
const V={'dikEDuepOtI':['Pumping lemma for regular languages','8'],'Ty9tpikilAo':['Pumping lemma, example 1','14'],'kZzH8E-s-9o':['Pumping lemma, example 2','9'],
WrzaPNj9OZ4:['Regular languages','7'],'6aRJQNYYz4s':['Operations on regular languages','8'],'nX4JrcHgpZY':['Equivalence of two finite automata','11'],
OKFrju0HB7k:['NFA to regular expression','14'],'SmT1DXLl3f4':['DFA to regular expression','6'],'fRVljh8y7Qw':['DFA to RE, multiple final states','8'],'Idl_0mPzZjE':['Arden’s theorem','8'],
WgEsPTAL55Q:['Regular grammar','10'],'ejXgLRSIxsA':['Derivations from a grammar','10'],'5_tfVe7ED3g':['Context-free grammar and language','8'],'htoFbcwES28':['Does a string belong to a grammar','12'],
'u4-rpIlV9NI':['Derivation trees (left and right)','13'],'wQjppolFdas':['Ambiguous grammar','6'],'EF09zxzpVbk':['Simplification: reduction','14'],'B2o75KpzfU4':['Simplification: unit productions','9'],'mlXYQ8ug2v4':['Simplification: null productions','9'],
'Mh-UQVmAxnw':['Chomsky normal form','7'],'FNPSlnj3Vt0':['Converting CFG to CNF','13'],'ZCbJan6CGNM':['Greibach normal form and CFG to GNF','13'],'rauqqM0nfuI':['CFG to GNF: removing left recursion','11'],
jRhqx1_KcCk:['Pumping lemma for CFLs','8'],'eQ0XkUk3qGk':['CFL pumping lemma, examples part 1','12'],'DPs8sBcIjs8':['CFL pumping lemma, examples part 2','17'],
'4ejIAmp_Atw':['PDA introduction','7'],'JtRyd7Svlew':['PDA formal definition','9'],'eY7fwj5jvC4':['PDA graphical notation','12'],'TEQcJybMMFU':['PDA example: even palindrome, part 1','14'],'BxA-aI2dyRo':['PDA even palindrome, part 2','19'],'xHj2WI1Rrl4':['PDA even palindrome, part 3','14'],
FjGrU7vczyg:['CFG and PDA equivalence, part 1 (CFG to PDA)','22'],'kyvLetfjOhc':['CFG and PDA equivalence, part 2a (PDA to CFG)','21'],'DjbukiTf-48':['CFG and PDA equivalence, part 2b','19'],
PvLaPKPzq2I:['Turing machine introduction, part 1','8'],'GPSk9tRsK2I':['Turing machine introduction, part 2','10'],'yFEdBR-rP9g':['Turing machine formal definition','10'],'D9eF_B8URnw':['Turing machine example 1','11'],'cR4Re0YfoOo':['Turing machine example 2','14'],'0D7yInuKvKs':['Church–Turing thesis','13'],'KW9md3j4_cU':['Turing machine for even palindromes','15'],
BKhQJP4sa_8:['TM programming techniques, part 1','11'],'23vQEJWXc-k':['TM programming techniques, part 2','10'],'CyB3aQhH9u4':['TM programming techniques, part 3','8'],'CLLutxGVDY4':['Multitape Turing machine','17'],'gQnPM6sydkk':['Nondeterministic TM, part 1','15'],'9Bk11XgiC1E':['Nondeterministic TM, part 2','14']};
const YT={
'm3-1':{v:['dikEDuepOtI','Ty9tpikilAo','kZzH8E-s-9o']},
'm3-2':{v:['WrzaPNj9OZ4','6aRJQNYYz4s','nX4JrcHgpZY']},
'm3-3':{v:['SmT1DXLl3f4','fRVljh8y7Qw','OKFrju0HB7k','Idl_0mPzZjE'],note:'Neso teaches FA to RE with Arden’s theorem. The state elimination method in these notes gives the same answer. Watch for the idea, write state elimination in the exam if asked.'},
'm4-1':{v:['5_tfVe7ED3g','ejXgLRSIxsA','WgEsPTAL55Q','htoFbcwES28','EF09zxzpVbk','B2o75KpzfU4','mlXYQ8ug2v4']},
'm4-2':{v:['u4-rpIlV9NI','ejXgLRSIxsA']},
'm4-3':{v:['wQjppolFdas']},
'm4-4':{v:['EF09zxzpVbk','B2o75KpzfU4','mlXYQ8ug2v4','Mh-UQVmAxnw','FNPSlnj3Vt0']},
'm4-5':{v:['ZCbJan6CGNM','rauqqM0nfuI']},
'm4-6':{v:['jRhqx1_KcCk','eQ0XkUk3qGk','DPs8sBcIjs8']},
'm5-1':{v:['4ejIAmp_Atw','JtRyd7Svlew','eY7fwj5jvC4','TEQcJybMMFU','BxA-aI2dyRo','xHj2WI1Rrl4']},
'm5-2':{v:['JtRyd7Svlew','eY7fwj5jvC4'],note:'Neso has no separate video on final-state vs empty-stack acceptance. These two cover the PDA model; the notes above cover the conversion.'},
'm5-3':{v:['FjGrU7vczyg','kyvLetfjOhc','DjbukiTf-48']},
'm5-4':{v:['TEQcJybMMFU','BxA-aI2dyRo'],note:'Neso has no separate DPDA video. The even-palindrome PDA shows why a machine must guess the middle, which is the reason wwᴿ is not a DCFL.'},
'm5-5':{v:['PvLaPKPzq2I','GPSk9tRsK2I','yFEdBR-rP9g','D9eF_B8URnw','cR4Re0YfoOo','KW9md3j4_cU','0D7yInuKvKs']},
'm5-6':{v:['BKhQJP4sa_8','23vQEJWXc-k','CyB3aQhH9u4','CLLutxGVDY4','gQnPM6sydkk','9Bk11XgiC1E']}
};
export {NESO_PL,V,YT};
